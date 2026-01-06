"use client";

import { useEffect, useState } from "react";
import {
  FaSpotify,
  FaInstagram,
  FaGlobe,
} from "react-icons/fa";
import { SiRoblox } from "react-icons/si";



/* -------------------- TYPES -------------------- */
type NowPlaying = {
  isPlaying: boolean;
  progressMs?: number;
  durationMs?: number;
  song?: {
    title: string;
    artist: string;
    album: string;
    image: string;
    url: string;
  };
};

type Track = {
  title: string;
  artist: string;
  album: string;
  image: string;
  url: string;
  playedAt?: string;
};

const DISCORD_USER_ID = "928934131893686292";

/* -------------------- COMPONENT -------------------- */
export default function Presence() {
  const [discord, setDiscord] = useState<any>(null);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [recent, setRecent] = useState<Track[]>([]);
  const [top, setTop] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<any>(null);


  const [progress, setProgress] = useState(0);
  function ActivityCard({ activity }: { activity: any }) {
  const startedAt = activity.timestamps?.start
    ? Math.floor((Date.now() - activity.timestamps.start) / 60000)
    : null;

  const image =
    activity.assets?.large_image
      ? activity.assets.large_image.replace(
          "mp:",
          "https://media.discordapp.net/"
        )
      : null;

  return (
    <div className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
      {image && (
        <img
          src={image}
          className="w-16 h-16 rounded-lg object-cover"
        />
      )}

      <div className="flex-1">
        <p className="text-sm font-semibold">
          {activity.name}
        </p>

        {activity.details && (
          <p className="text-xs text-white/60">
            {activity.details}
          </p>
        )}

        {startedAt !== null && (
          <p className="mt-1 text-[11px] text-white/40">
            active for {startedAt} min
          </p>
        )}
      </div>
    </div>
  );
}


  /* -------------------- FETCH DISCORD -------------------- */
  useEffect(() => {
    const fetchDiscord = async () => {
      const res = await fetch(
        `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`
      );
      const json = await res.json();
      setDiscord(json.data);

const nonSpotifyActivities = json.data.activities?.filter(
  (a: any) => a.name !== "Spotify"
);

if (nonSpotifyActivities?.length > 0) {
  setLastActivity(nonSpotifyActivities[0]);
}

    };

    fetchDiscord();
    const i = setInterval(fetchDiscord, 10000);
    return () => clearInterval(i);
  }, []);

  /* -------------------- FETCH SPOTIFY -------------------- */
  useEffect(() => {
    const fetchSpotify = async () => {
      try {
        const [now, recentRes, topRes] = await Promise.all([
          fetch("/api/spotify/now-playing").then((r) => r.json()),
          fetch("/api/spotify/recent").then((r) => r.json()),
          fetch("/api/spotify/top").then((r) => r.json()),
        ]);

        setNowPlaying(now);
        setRecent(recentRes);
        setTop(topRes);
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    };

    fetchSpotify();
    const i = setInterval(fetchSpotify, 15000);
    return () => clearInterval(i);
  }, []);

  /* -------------------- PROGRESS BAR -------------------- */
  useEffect(() => {
    if (!nowPlaying?.isPlaying || !nowPlaying.progressMs || !nowPlaying.durationMs)
      return;

    setProgress(nowPlaying.progressMs / nowPlaying.durationMs);

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 1 / (nowPlaying.durationMs! / 1000), 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [nowPlaying]);

  /* -------------------- SKELETON -------------------- */
  if (loading) {
    return (
      <div className="grid gap-4 animate-pulse">
        <div className="h-20 rounded-2xl bg-white/10" />
        <div className="h-32 rounded-2xl bg-white/10" />
        <div className="h-40 rounded-2xl bg-white/10" />
      </div>
    );
  }

  if (!discord) return null;

  const avatar = `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${discord.discord_user.avatar}.png`;

  const statusColor =
    discord.discord_status === "online"
      ? "bg-green-400"
      : discord.discord_status === "idle"
      ? "bg-yellow-400"
      : discord.discord_status === "dnd"
      ? "bg-red-500"
      : "bg-gray-500";

  /* -------------------- UI -------------------- */
 return (
 <div className="
  relative
  rounded-3xl p-6 space-y-6
  bg-black/40
  backdrop-blur-2xl
  border border-white/10
  shadow-[0_0_40px_rgba(0,0,0,0.6)]
">


{/* ================= SECTION TITLE ================= */}
<p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
  discord
</p>

  {/* ================= DISCORD IDENTITY ================= */}
<div className="
  relative
  rounded-2xl p-4
  bg-white/5
  backdrop-blur-2xl
  border border-white/15
  shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
  overflow-hidden
">


  {/* subtle top glow */}
  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

  <div className="relative flex items-center gap-4">

    {/* AVATAR */}
    <div className="relative">
      <img
        src={avatar}
        className="w-16 h-16 rounded-full border border-white/20"
        alt="discord avatar"
      />

      {/* STATUS DOT */}
      <span
        className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-black ${statusColor}`}
      />
    </div>

    {/* USER INFO */}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold truncate">
        {discord.discord_user.username}
        <span className="text-white/40 ml-1">
          #{discord.discord_user.discriminator}
        </span>
      </p>

      {/* ONLINE STATE */}
      <p className="text-xs text-white/50 capitalize">
        {discord.discord_status}
        {discord.active_on_discord_desktop && " · desktop"}
        {discord.active_on_discord_mobile && " · mobile"}
        {discord.active_on_discord_web && " · web"}
      </p>

      {/* CUSTOM STATUS */}
      {discord.activities?.find((a: any) => a.type === 4)?.state && (
        <p className="mt-1 text-xs text-white/70 truncate">
          {discord.activities.find((a: any) => a.type === 4).state}
        </p>
      )}
    </div>
  </div>
</div>

    {/* ================= SPOTIFY ================= */}
    <div className="space-y-4">

      {/* NOW PLAYING */}
      <div className="
  rounded-2xl p-4
  bg-white/10
  backdrop-blur-md
  border border-white/15
">

        <p className="text-[11px] uppercase tracking-widest text-green-400 mb-2">
          spotify
        </p>

        {nowPlaying?.isPlaying && nowPlaying.song ? (
          <div className="flex gap-4">
            <img
              src={nowPlaying.song.image}
              className="w-14 h-14 rounded-lg"
            />

            <div className="flex-1">
              <p className="text-sm font-semibold">
                {nowPlaying.song.title}
              </p>
              <p className="text-xs text-white/60">
                {nowPlaying.song.artist}
              </p>

              <div className="mt-3 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400 transition-all"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-white/50">
  <div className="w-14 h-14 rounded-lg bg-black/40 flex items-center justify-center">
    <FaSpotify className="text-green-400 text-2xl opacity-80" />
  </div>
  <div>
    <p className="text-sm font-medium">Not playing</p>
    <p className="text-xs text-white/40">Spotify idle</p>
  </div>
</div>

        )}
      </div>

      {/* RECENT */}
      <div className="
  rounded-2xl p-4
  bg-white/10
  backdrop-blur-md
  border border-white/15
">

        <p className="text-[11px] uppercase tracking-widest text-white/40 mb-2">
          recently played
        </p>

        <div className="space-y-2">
          {recent.slice(0,5).map((t) => (

            <div key={t.url} className="flex items-center gap-3">
              <img src={t.image} className="w-9 h-9 rounded-md" />
              <div className="text-xs">
                <p className="font-medium">{t.title}</p>
                <p className="text-white/50">{t.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TOP */}
      <div className="
  rounded-2xl p-4
  bg-white/10
  backdrop-blur-md
  border border-white/15
">

        <p className="text-[11px] uppercase tracking-widest text-white/40 mb-2">
          top tracks
        </p>

        <div className="grid grid-cols-4 gap-2">
          {top.slice(0, 4).map((t) => (
            <img
              key={t.url}
              src={t.image}
              className="rounded-lg opacity-80 hover:opacity-100 hover:scale-105 transition"
              title={`${t.title} — ${t.artist}`}
            />
          ))}
        </div>
      </div>
    </div>

    {/* ================= CONNECTIONS ================= */}
    <div>
      <p className="text-[11px] uppercase tracking-widest text-white/40 mb-3">
        connections
      </p>

      <div className="grid grid-cols-2 gap-3">
        {[
          {
            name: "arihanntt",
            label: "Instagram",
            link: "https://instagram.com/arihanntt",
            icon: FaInstagram,
          },
          {
            name: "Spotify",
            label: "Music",
            link: "https://open.spotify.com/user/31r3l3stkdiod6iz3vnurdmiltai",
            icon: FaSpotify,
          },
          {
  name: "Roblox",
  label: "Gaming",
  link: "https://www.roblox.com/users/3621433441/profile",
  icon: SiRoblox,
},
          {
            name: "Drixe studio",
            label: "Domain",
            link: "https://drixestudio.services",
            icon: FaGlobe,
          },
        ].map((c) => (
          <a
            key={c.name}
            href={c.link}
            target="_blank"
            className="
              flex items-center justify-between
              rounded-xl px-4 py-3
              bg-white/5 border border-white/10
              hover:bg-white/10 transition
            "
          >
            
            <div className="flex items-center gap-3">
              <c.icon size={16} className="text-white/60" />
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-[11px] text-white/40">{c.label}</p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-green-400" />
          </a>
        ))}
        {/* ================= DISCORD ACTIVITY ================= */}
{/* ================= DISCORD ACTIVITY ================= */}
{(discord.activities?.filter((a: any) => a.name !== "Spotify").length > 0 ||
  lastActivity) && (
  <div>
    <p className="text-[11px] uppercase tracking-widest text-white/40 mb-3">
      activity
    </p>

    {discord.activities?.filter((a: any) => a.name !== "Spotify").length > 0
      ? discord.activities
          .filter((a: any) => a.name !== "Spotify")
          .slice(0, 1)
          .map((a: any) => (
            <ActivityCard key={a.id} activity={a} />
          ))
      : lastActivity && <ActivityCard activity={lastActivity} />}
  </div>
)}

      </div>
    </div>
  </div>
);
}