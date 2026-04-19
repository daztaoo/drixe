// Public Spotify now-playing route — called by public profile pages
// GET /api/profile/[username]/spotify
// Returns current track for the given user's Spotify integration

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getValidUserSpotifyToken } from "@/lib/spotify";

// Service role client to read tokens (bypasses RLS)
// NOTE: This route is server-side only — tokens are never sent to the browser
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  _req: NextRequest,
  { params }: { params: { username: string } }
) {
  const { username } = params;

  // 1. Look up user's profile
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();

  if (!profile) {
    return NextResponse.json({ isPlaying: false });
  }

  // 2. Get their Spotify integration (only if enabled)
  const { data: integration } = await supabaseAdmin
    .from("integrations")
    .select("id, access_token, refresh_token, token_expires_at")
    .eq("user_id", profile.id)
    .eq("platform", "spotify")
    .eq("is_enabled", true)
    .single();

  if (!integration || !integration.refresh_token) {
    return NextResponse.json({ isPlaying: false });
  }

  // 3. Get a valid (possibly refreshed) token
  const token = await getValidUserSpotifyToken(integration);
  if (!token) {
    return NextResponse.json({ isPlaying: false });
  }

  // 4. Call Spotify API
  const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 30 }, // Cache 30s — balances freshness vs. API load
  });

  // 204 = nothing is playing
  if (res.status === 204) {
    return NextResponse.json({ isPlaying: false });
  }

  if (!res.ok) {
    return NextResponse.json({ isPlaying: false });
  }

  const data = await res.json();

  // Only return playing state if it is actually playing (not paused)
  if (!data?.is_playing || !data?.item) {
    return NextResponse.json({ isPlaying: false });
  }

  return NextResponse.json({
    isPlaying: true,
    song: {
      title: data.item.name,
      artist: data.item.artists.map((a: any) => a.name).join(", "),
      album: data.item.album.name,
      image: data.item.album.images[0]?.url ?? null,
      url: data.item.external_urls.spotify,
      progressMs: data.progress_ms,
      durationMs: data.item.duration_ms,
    },
  });
}
