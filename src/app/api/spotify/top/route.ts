import { NextResponse } from "next/server";
import { spotifyFetch } from "@/lib/spotify";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const data = await spotifyFetch<any>(
      "/me/top/tracks?limit=8&time_range=short_term"
    );

    if (!data?.items) {
      return NextResponse.json([]);
    }

    const tracks = data.items.map((track: any) => ({
      title: track.name,
      artist: track.artists
        .map((a: any) => a.name)
        .join(", "),
      album: track.album.name,
      image: track.album.images[0]?.url,
      url: track.external_urls.spotify,
    }));

    return NextResponse.json(tracks);
  } catch (err) {
    console.error("TOP TRACKS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch top tracks" },
      { status: 500 }
    );
  }
}
