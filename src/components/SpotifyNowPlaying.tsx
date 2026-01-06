"use client";
import { useEffect, useState } from "react";

export default function SpotifyNowPlaying() {
  const [track, setTrack] = useState<any>(null);

  useEffect(() => {
    fetch("/api/spotify/now-playing")
      .then(res => res.json())
      .then(setTrack);
  }, []);

  if (!track?.item) {
    return <div className="text-white/50">Not listening</div>;
  }

  return (
    <div className="flex gap-4 animate-fade-in">
      <img
        src={track.item.album.images[0].url}
        className="w-20 h-20 rounded-xl"
      />
      <div>
        <p className="font-semibold">{track.item.name}</p>
        <p className="text-sm text-white/60">
          {track.item.artists.map((a: any) => a.name).join(", ")}
        </p>

        {/* progress */}
        <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-400"
            style={{
              width: `${
                (track.progress_ms / track.item.duration_ms) * 100
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
