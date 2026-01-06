"use client";

import { useEffect, useState } from "react";

export default function SpotifyRecent() {
  const [tracks, setTracks] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/spotify")
      .then((r) => r.json())
      .then((d) => setTracks(d.recent.items));
  }, []);

  return (
    <div className="bg-white/5 p-4 rounded-2xl space-y-2">
      <p className="text-xs uppercase tracking-widest text-white/40">
        recent listens
      </p>

      {tracks.map((t, i) => (
        <div key={i} className="text-xs flex justify-between">
          <span>{t.track.name}</span>
          <span className="opacity-40">
            {t.track.artists[0].name}
          </span>
        </div>
      ))}
    </div>
  );
}
