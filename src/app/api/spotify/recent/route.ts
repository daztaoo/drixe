import { NextResponse } from "next/server";
import { spotifyFetch } from "@/lib/spotify";

export async function GET() {
  try {
    const data = await spotifyFetch<any>(
      "/me/player/recently-played?limit=10"
    );

    if (!data?.items) {
      return NextResponse.json([]);
    }

    const tracks = data.items.map((item: any) => ({
      title: item.track.name,
      artist: item.track.artists
        .map((a: any) => a.name)
        .join(", "),
      album: item.track.album.name,
      image: item.track.album.images[0]?.url,
      playedAt: item.played_at,
      url: item.track.external_urls.spotify,
    }));

    return NextResponse.json(tracks);
  } catch (err) {
    console.error("RECENT ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch recent tracks" },
      { status: 500 }
    );
  }
}
