"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LanyardActivity {
  name: string;
  type: number;
  details?: string;
  state?: string;
  timestamps?: { start?: number; end?: number };
  assets?: { large_image?: string; large_text?: string; small_image?: string };
  application_id?: string;
}

interface LanyardData {
  discord_status: "online" | "idle" | "dnd" | "offline";
  discord_user: { id: string; username: string; discriminator: string; avatar: string | null; display_name?: string };
  activities: LanyardActivity[];
  spotify: { song: string; artist: string; album_cover_url: string | null; track_id: string; timestamps?: { start: number; end: number } } | null;
}

const STATUS_COLORS: Record<string, string> = {
  online: "#23a55a", idle: "#f0b232", dnd: "#f23f43", offline: "#80848e",
};
const STATUS_LABELS: Record<string, string> = {
  online: "Online", idle: "Idle", dnd: "Do Not Disturb", offline: "Offline",
};

function getElapsed(startMs: number) {
  const diffSec = Math.floor((Date.now() - startMs) / 1000);
  const h = Math.floor(diffSec / 3600);
  const m = Math.floor((diffSec % 3600) / 60);
  const s = diffSec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

interface Props { discordId: string; accentColor?: string; }

type FetchState = "loading" | "error" | "not_in_lanyard" | "offline" | "live";

export function DiscordPresence({ discordId, accentColor = "#a855f7" }: Props) {
  const [data, setData] = useState<LanyardData | null>(null);
  const [elapsed, setElapsed] = useState("");
  const [fetchState, setFetchState] = useState<FetchState>("loading");

  useEffect(() => {
    const fetchPresence = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
        if (res.status === 404) { setFetchState("not_in_lanyard"); return; }
        if (!res.ok) { setFetchState("error"); return; }
        const json = await res.json();
        if (!json.success) { setFetchState("error"); return; }
        setData(json.data);
        setFetchState(json.data.discord_status === "offline" ? "offline" : "live");
      } catch {
        setFetchState("error");
      }
    };
    fetchPresence();
    const interval = setInterval(fetchPresence, 30_000);
    return () => clearInterval(interval);
  }, [discordId]);

  const activity = data?.activities?.find((a) => a.type === 0 && a.timestamps?.start);
  useEffect(() => {
    if (!activity?.timestamps?.start) return;
    const tick = () => setElapsed(getElapsed(activity.timestamps!.start!));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [activity]);

  // ── LOADING ──────────────────────────────────────────────────────────────────
  if (fetchState === "loading") {
    return (
      <div className="w-full max-w-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse flex-shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-2.5 bg-white/10 rounded animate-pulse w-24" />
          <div className="h-2 bg-white/5 rounded animate-pulse w-16" />
        </div>
      </div>
    );
  }

  // ── NOT IN LANYARD ────────────────────────────────────────────────────────────
  if (fetchState === "not_in_lanyard") {
    return (
      <div className="w-full max-w-full rounded-2xl border border-white/[0.07] bg-black/30 backdrop-blur-md p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#5865F2" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.32.116 18.14.131 18.17a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-white/50">Discord</p>
          <p className="text-[10px] text-white/25 mt-0.5">Not connected to Lanyard</p>
        </div>
        <a
          href="https://discord.gg/lanyard"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[9px] text-[#5865F2]/60 hover:text-[#5865F2] transition-colors flex-shrink-0"
        >
          Fix →
        </a>
      </div>
    );
  }

  // ── ERROR ─────────────────────────────────────────────────────────────────────
  if (fetchState === "error") {
    return (
      <div className="w-full max-w-full rounded-2xl border border-white/[0.07] bg-black/30 backdrop-blur-md p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#80848e]" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white/40">Discord</p>
          <p className="text-[10px] text-white/20 mt-0.5">Presence unavailable</p>
        </div>
      </div>
    );
  }

  // ── OFFLINE ───────────────────────────────────────────────────────────────────
  if (fetchState === "offline" && data) {
    const avatarId = data.discord_user.avatar;
    const avatarUrl = avatarId
      ? `https://cdn.discordapp.com/avatars/${discordId}/${avatarId}.${avatarId.startsWith("a_") ? "gif" : "png"}?size=64`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(data.discord_user.discriminator || "0") % 5}.png`;

    return (
      <div className="w-full max-w-full rounded-2xl border border-white/[0.07] bg-black/30 backdrop-blur-md p-4 flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <img src={avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black bg-[#80848e]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-white/60 truncate">
            {data.discord_user.display_name || data.discord_user.username}
          </p>
          <p className="text-[10px] text-white/25 mt-0.5">Offline</p>
        </div>
      </div>
    );
  }

  // ── LIVE (online / idle / dnd) ────────────────────────────────────────────────
  if (!data) return null;

  const avatarId = data.discord_user.avatar;
  const avatarUrl = avatarId
    ? `https://cdn.discordapp.com/avatars/${discordId}/${avatarId}.${avatarId.startsWith("a_") ? "gif" : "png"}?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(data.discord_user.discriminator || "0") % 5}.png`;

  const statusColor = STATUS_COLORS[data.discord_status];
  const spotify = data.spotify;
  const gameActivity = data.activities?.find((a) => a.type === 0);

  return (
    <div className="w-full max-w-full rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
      {/* Header bar */}
      <div className="p-3 sm:p-4 flex items-center gap-3 min-w-0">
        <div className="relative flex-shrink-0">
          <img src={avatarUrl} alt={data.discord_user.username} className="w-10 h-10 rounded-full object-cover" />
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-black" style={{ background: statusColor }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white truncate">
            {data.discord_user.display_name || data.discord_user.username}
          </p>
          <p className="text-[10px] text-white/40 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: statusColor }} />
            {STATUS_LABELS[data.discord_status]}
          </p>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#5865F2" className="flex-shrink-0 opacity-60">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.14.116 18.32.131 18.17a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
        </svg>
      </div>

      {/* Spotify row */}
      {spotify && (
        <div className="flex items-center gap-3 px-3 sm:px-4 pb-3 min-w-0">
          <div className="relative flex-shrink-0">
            {spotify.album_cover_url
              ? <img src={spotify.album_cover_url} alt={spotify.song} className="w-10 h-10 rounded-lg object-cover" />
              : <div className="w-10 h-10 rounded-lg bg-[#1DB954]/20 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
                </div>
            }
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{spotify.song}</p>
            <p className="text-[10px] text-white/40 truncate">{spotify.artist}</p>
          </div>
          <div className="flex gap-0.5 items-end flex-shrink-0">
            {[1, 2, 3].map((b) => (
              <div key={b} className="w-0.5 rounded-full bg-[#1DB954] animate-[music-bar_1s_ease-in-out_infinite]"
                style={{ height: `${8 + b * 3}px`, animationDelay: `${b * 0.2}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* Game activity */}
      {gameActivity && !spotify && (
        <div className="flex items-center gap-3 px-3 sm:px-4 pb-3 min-w-0">
          {gameActivity.assets?.large_image ? (
            <img
              src={`https://cdn.discordapp.com/app-assets/${gameActivity.application_id}/${gameActivity.assets.large_image}.png`}
              alt={gameActivity.name}
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-lg">🎮</div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{gameActivity.name}</p>
            {gameActivity.details && <p className="text-[10px] text-white/40 truncate">{gameActivity.details}</p>}
            {activity?.timestamps?.start && elapsed && (
              <p className="text-[9px] text-white/25">{elapsed} elapsed</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
