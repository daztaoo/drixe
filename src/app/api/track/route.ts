import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

// Initialize Supabase Admin Client
// We use the SERVICE_ROLE_KEY to bypass Row Level Security (RLS)
// so we can insert analytics data for anonymous users.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile_id, event_type, link_url, referrer } = body;

    if (!profile_id) return NextResponse.json({ error: "Missing Profile ID" }, { status: 400 });

    // --- 1. HANDLING DUPLICATE VIEWS ---
    const viewedCookieName = `viewed_${profile_id}`;
    const hasViewed = req.cookies.get(viewedCookieName);

    // CRITICAL LOGIC: 
    // If it is a 'view', we check the cookie. 
    // If it is a 'click', we IGNORE the cookie and let it pass.
    if (event_type === 'view' && hasViewed) {
      return NextResponse.json({ message: "Duplicate view ignored" });
    }

    // --- 2. GATHER METADATA ---
    const userAgent = req.headers.get("user-agent") || "";
    const parser = new UAParser(userAgent);
    const device = parser.getDevice().type || "desktop";
    
    // Vercel Geolocation Headers
    const country = req.headers.get("x-vercel-ip-country") || "Unknown";
    const city = req.headers.get("x-vercel-ip-city") || "Unknown";
    
    // Clean Referrer (e.g., "instagram.com" instead of full URL)
    const cleanReferrer = referrer 
      ? referrer.replace(/^https?:\/\//, '').split('/')[0] 
      : "Direct";

    // Ensure we only save link_url if it's actually a click event
    const finalLinkUrl = event_type === 'click' ? link_url : null;

    // --- 3. LOG TO DATABASE ---
    const { error } = await supabase.from("analytics").insert({
      profile_id,
      event_type,        // 'view' or 'click'
      link_url: finalLinkUrl, // Stores the URL only for clicks
      country,
      city,
      device_type: device,
      referrer: cleanReferrer,
    });

    if (error) {
      console.error("Supabase Insert Error:", error);
      throw error;
    }

    // Debug Log (Check Vercel Function Logs to see this)
    if (event_type === 'click') {
       console.log(`[CLICK TRACKED] Profile: ${profile_id} -> Link: ${finalLinkUrl}`);
    }

    // --- 4. HANDLE VIEW COUNT INCREMENT ---
    const response = NextResponse.json({ success: true });
    
    // Only increment 'views_count' if it is a VIEW event
    if (event_type === 'view') {
      
      // A. Increment the Public Counter
      const { data: profile } = await supabase
        .from('profiles')
        .select('views_count')
        .eq('id', profile_id)
        .single();

      const newViewCount = (profile?.views_count || 0) + 1;
      
      await supabase
        .from('profiles')
        .update({ views_count: newViewCount })
        .eq('id', profile_id);

      // B. Set the Cookie (So we don't count them again for 1 year)
      response.cookies.set(viewedCookieName, 'true', { 
        path: '/', 
        maxAge: 60 * 60 * 24 * 365, // 1 Year
        httpOnly: true 
      });
    }

    return response;

  } catch (error: any) {
    console.error("Tracking API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}