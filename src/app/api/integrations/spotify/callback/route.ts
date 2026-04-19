// Spotify OAuth Step 2: Handle callback, exchange code for tokens, save to DB
// GET /api/integrations/spotify/callback?code=...

import { NextRequest, NextResponse } from "next/server";
import { getBasicAuthHeader } from "@/lib/spotify";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  // User denied access
  if (error || !code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_URL}/dashboard/integrations?spotify=denied`
    );
  }

  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_URL}/api/integrations/spotify/callback`;

  // 1. Exchange authorization code for tokens
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": getBasicAuthHeader(),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!tokenRes.ok) {
    console.error("Spotify token exchange failed:", await tokenRes.text());
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_URL}/dashboard/integrations?spotify=error`
    );
  }

  const { access_token, refresh_token, expires_in } = await tokenRes.json();

  // 2. Get Spotify user info
  const meRes = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!meRes.ok) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_URL}/dashboard/integrations?spotify=error`
    );
  }

  const me = await meRes.json();

  // 3. Get the current Supabase user from the session cookie
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_URL}/auth?reason=session_expired`
    );
  }

  // 4. Upsert to integrations table
  // Never expose refresh_token to the client — it stays in DB only
  const { error: dbError } = await supabase.from("integrations").upsert({
    user_id: user.id,
    platform: "spotify",
    platform_user_id: me.id,
    platform_username: me.display_name,
    access_token,
    refresh_token,
    token_expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
    is_enabled: true,
    show_on_profile: true,
    updated_at: new Date().toISOString(),
  }, {
    onConflict: "user_id,platform",
  });

  if (dbError) {
    console.error("Supabase upsert error:", dbError);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_URL}/dashboard/integrations?spotify=error`
    );
  }

  // 5. Success — redirect back to integrations dashboard
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_URL}/dashboard/integrations?spotify=connected`
  );
}
