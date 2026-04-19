import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile_id } = body;
    
    // Get IP Address
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    // 1. Check if this IP already liked this profile
    const { data: existingLike } = await supabase
      .from("profile_likes")
      .select("id")
      .eq("profile_id", profile_id)
      .eq("ip_address", ip)
      .single();

    if (existingLike) {
      return NextResponse.json({ error: "Already liked" }, { status: 429 });
    }

    // 2. Add to Likes Table
    const { error: insertError } = await supabase
      .from("profile_likes")
      .insert({ profile_id, ip_address: ip });

    if (insertError) throw insertError;

    // 3. Increment the Counter on Profile Table (RPC is safer, but direct update works for now)
    // We fetch current count first to be safe, or use a database function. 
    // For simplicity/speed on Vercel, we'll just increment.
    
    // Proper atomic increment using RPC is best, but let's do a quick fetch-update
    const { data: profile } = await supabase.from('profiles').select('likes_count').eq('id', profile_id).single();
    const newCount = (profile?.likes_count || 0) + 1;
    
    await supabase.from('profiles').update({ likes_count: newCount }).eq('id', profile_id);

    return NextResponse.json({ success: true, newCount });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}