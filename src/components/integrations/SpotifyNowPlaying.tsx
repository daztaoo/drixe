"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface SpotifyTrack {
  title: string;
  artist: string;
  album: string;
  image: string | null;
  url: string;
  progressMs: number;
  durationMs: number;
}

interface SpotifyState {
  isPlaying: boolean;
  song?: SpotifyTrack;
}

function formatMs(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

interface Props {
  username: string; // The Drixe username — used to call our API route
}

export function SpotifyNowPlaying({ username }: Props) {
  const [state, setState] = useState<SpotifyState | null>(null);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  // Poll our own API route, not Spotify directly — tokens stay server-side
  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(`/api/profile/${username}/spotify`);
        const data: SpotifyState = await res.json();
        setState(data);

        if (data.isPlaying && data.song) {
          setProgress(data.song.progressMs);
        }
      } catch {
        // Silently fail — don't show widget if error
        setState({ isPlaying: false });
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30_000); // refresh every 30s
    return () => clearInterval(interval);
  }, [username]);

  // Progress bar ticks every second locally (avoids re-fetching Spotify every second)
  useEffect(() => {
    if (progressRef.current) clearInterval(progressRef.current);

    if (state?.isPlaying && state.song) {
      progressRef.current = setInterval(() => {
        setProgress((prev) => Math.min(prev + 1000, state.song!.durationMs));
      }, 1000);
    }

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [state]);

  if (!state?.isPlaying || !state.song) return null;

  const pct = Math.min((progress / state.song.durationMs) * 100, 100);

  return (
    <a
      href={state.song.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md hover:border-white/20 transition-colors"
    >
      <div className="flex items-center gap-3 p-4">
        {/* Album art */}
        {state.song.image && (
          <div className="relative flex-shrink-0">
            <img
              src={state.song.image}
              alt={state.song.album}
              className="w-12 h-12 rounded-xl object-cover"
            />
            {/* Animated music bars overlay */}
            <div className="absolute inset-0 flex items-end justify-center gap-[2px] pb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-xl">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-[#1DB954] rounded-t-sm"
                  style={{
                    height: `${40 + i * 15}%`,
                    animation: `music-bar ${0.8 + i * 0.1}s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Track info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <svg viewBox="0 0 24 24" width="10" height="10" fill="#1DB954">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            <span className="text-[9px] text-[#1DB954] font-bold uppercase tracking-widest">
              Now Playing
            </span>
          </div>
          <p className="text-sm font-bold text-white truncate">{state.song.title}</p>
          <p className="text-[10px] text-white/40 truncate">{state.song.artist}</p>
        </div>

        {/* Timestamps */}
        <div className="flex-shrink-0 text-[9px] text-white/30 font-mono text-right">
          <p>{formatMs(progress)}</p>
          <p>{formatMs(state.song.durationMs)}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] bg-white/5 mx-4 mb-3 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#1DB954] rounded-full transition-all duration-1000 linear"
          style={{ width: `${pct}%` }}
        />
      </div>
    </a>
  );
}
