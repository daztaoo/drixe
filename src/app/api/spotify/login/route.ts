import { NextResponse } from "next/server";

const scopes = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-top-read",
];

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    response_type: "code",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    scope: scopes.join(" "),
  });

  return NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params}`
  );
}
