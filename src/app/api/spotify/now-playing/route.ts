import { NextResponse } from "next/server";
import { spotifyFetch } from "@/lib/spotify";

export async function GET() {
  try {
    const data = await spotifyFetch<any>(
      "/me/player/currently-playing"
    );

    if (!data || !data.item) {
      return NextResponse.json({
        isPlaying: false,
      });
    }

    return NextResponse.json({
      isPlaying: data.is_playing,
      progressMs: data.progress_ms,
      durationMs: data.item.duration_ms,
      song: {
        title: data.item.name,
        artist: data.item.artists
          .map((a: any) => a.name)
          .join(", "),
        album: data.item.album.name,
        image: data.item.album.images[0]?.url,
        url: data.item.external_urls.spotify,
      },
    });
  } catch (err) {
    console.error("NOW PLAYING ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch now playing" },
      { status: 500 }
    );
  }
}
