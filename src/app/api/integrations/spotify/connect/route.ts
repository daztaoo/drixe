// Spotify OAuth Step 1: Redirect user to Spotify authorization page
// GET /api/integrations/spotify/connect

import { NextResponse } from "next/server";

export async function GET() {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;

  if (!CLIENT_ID) {
    return NextResponse.json({ error: "Spotify not configured" }, { status: 500 });
  }

  const scopes = [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-top-read",
    "user-read-playback-state",
  ].join(" ");

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/integrations/spotify/callback`,
    scope: scopes,
    show_dialog: "true", // Always show the auth dialog (avoids stale sessions)
  });

  return NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
}
