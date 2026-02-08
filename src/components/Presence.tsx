"use client";

import { useEffect, useState, useRef } from "react";
import { FaSpotify, FaInstagram, FaGlobe, FaGamepad } from "react-icons/fa";
import { SiRoblox } from "react-icons/si";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Grenze_Gotisch, 
  UnifrakturMaguntia, 
  Cinzel_Decorative, 
  Inter_Tight, 
  JetBrains_Mono 
} from "next/font/google";

/* --- GOTHIC ARCHIVE FONTS --- */
const goth = Grenze_Gotisch({ weight: ["400", "700", "900"], subsets: ["latin"] });
const blackletter = UnifrakturMaguntia({ weight: ["400"], subsets: ["latin"] });
const cinzel = Cinzel_Decorative({ weight: ["400", "700"], subsets: ["latin"] });
const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

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

/* -------------------- ACTIVITY CARD -------------------- */
function ActivityCard({ activity }: { activity: any }) {
  const [timeString, setTimeString] = useState<string>("");

  const getAssetUrl = (assetId: string | undefined, appId: string) => {
    if (!assetId) return null;
    if (assetId.startsWith("mp:")) return assetId.replace("mp:", "https://media.discordapp.net/");
    return `https://cdn.discordapp.com/app-assets/${appId}/${assetId}.png`;
  };

  const largeImage = getAssetUrl(activity.assets?.large_image, activity.application_id);

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      if (activity.timestamps?.end) {
        const diff = activity.timestamps.end - now;
        if (diff <= 0) return setTimeString("00:00");
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeString(`${minutes}:${seconds.toString().padStart(2, "0")} left`);
      } 
      else if (activity.timestamps?.start) {
        const diff = now - activity.timestamps.start;
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeString(
          hours > 0 
            ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} elapsed`
            : `${minutes}:${seconds.toString().padStart(2, '0')} elapsed`
        );
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [activity.timestamps]);

  return (
    <div className="relative border-2 border-black p-5 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.03)] w-full overflow-hidden">
      <div className="flex gap-5 items-center">
        <div className="relative flex-shrink-0">
          {largeImage ? (
            <img src={largeImage} className="w-16 h-16 border-2 border-black object-cover" alt="" />
          ) : (
            <div className="w-16 h-16 border-2 border-black flex items-center justify-center bg-zinc-50">
              <FaGamepad className="text-black/10" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn("text-base font-black text-black truncate leading-tight mb-1", inter.className)}>{activity.name}</h3>
          <p className={cn("text-[10px] text-black/50 uppercase tracking-tighter truncate", mono.className)}>{activity.details || "Active Manifestation"}</p>
          <p className={cn("mt-2 text-[9px] font-black text-black/30 tracking-[0.2em]", mono.className)}>{timeString}</p>
        </div>
      </div>
    </div>
  );
}

/* -------------------- MAIN COMPONENT -------------------- */
export default function Presence() {
  const [discord, setDiscord] = useState<any>(null);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [recent, setRecent] = useState<Track[]>([]);
  const [top, setTop] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<any>(null);
  const [progress, setProgress] = useState(0);
const [accentGradient, setAccentGradient] = useState<string | null>(null);


/* CINEMATIC DOMINANT GRADIENT ENGINE */
const extractGradientFromImage = (imgUrl: string) => {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = imgUrl;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 40;
    canvas.width = size;
    canvas.height = size;
    ctx.drawImage(img, 0, 0, size, size);

    const data = ctx.getImageData(0, 0, size, size).data;

    let colors: number[][] = [];

    for (let i = 0; i < data.length; i += 40) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Ignore near-white pixels
      if (r > 240 && g > 240 && b > 240) continue;

      colors.push([r, g, b]);
    }

    if (colors.length < 2) {
      setAccentGradient(null);
      return;
    }

    // Pick two far-apart colors
    const c1 = colors[Math.floor(Math.random() * colors.length)];
    const c2 = colors[Math.floor(Math.random() * colors.length)];

    const darken = (c: number[]) => [
      Math.floor(c[0] * 0.5),
      Math.floor(c[1] * 0.5),
      Math.floor(c[2] * 0.5),
    ];

    const d1 = darken(c1);
    const d2 = darken(c2);

    const gradient = `linear-gradient(135deg, rgb(${d1[0]},${d1[1]},${d1[2]}), rgb(${d2[0]},${d2[1]},${d2[2]}))`;

    setAccentGradient(gradient);
  };
};


  useEffect(() => {
    // Priority: Spotify First, then Activity
    const activityImg = lastActivity?.assets?.large_image ? `https://cdn.discordapp.com/app-assets/${lastActivity.application_id}/${lastActivity.assets.large_image}.png` : null;
    const currentImg = nowPlaying?.isPlaying ? nowPlaying.song?.image : activityImg;
    
   if (currentImg) {
  extractGradientFromImage(currentImg);
} else {
  setAccentGradient(null);
}

  }, [nowPlaying?.isPlaying, nowPlaying?.song?.image, lastActivity]);

  /* LOGIC: DISCORD FETCH (PRESERVED) */
  useEffect(() => {
    const fetchDiscord = async () => {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
      const json = await res.json();
      setDiscord(json.data);
      const nonSpotifyActivities = json.data.activities?.filter((a: any) => a.name !== "Spotify");
      if (nonSpotifyActivities?.length > 0) setLastActivity(nonSpotifyActivities[0]);
    };
    fetchDiscord();
    const i = setInterval(fetchDiscord, 5000);
    return () => clearInterval(i);
  }, []);

  /* LOGIC: SPOTIFY FETCH (PRESERVED) */
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
      } catch (e) { console.error(e); }
    };
    fetchSpotify();
    const i = setInterval(fetchSpotify, 15000);
    return () => clearInterval(i);
  }, []);

  /* LOGIC: PROGRESS BAR (PRESERVED) */
  useEffect(() => {
    if (!nowPlaying?.isPlaying || !nowPlaying.progressMs || !nowPlaying.durationMs) return;
    setProgress(nowPlaying.progressMs / nowPlaying.durationMs);
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 1 / (nowPlaying.durationMs! / 1000), 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [nowPlaying]);

  if (loading || !discord) return <div className="w-full h-96 border-[3px] border-black animate-pulse bg-zinc-50 rounded-[2.5rem]" />;

  const avatar = `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${discord.discord_user.avatar}.png`;
  const statusColor = discord.discord_status === "online" ? "#4ade80" : discord.discord_status === "idle" ? "#fbbf24" : discord.discord_status === "dnd" ? "#ef4444" : "#9ca3af";

  return (
    <div 
      className="relative w-full border-[3px] border-black p-6 md:p-10 space-y-12 bg-white transition-all duration-1000 rounded-[2.5rem] shadow-[24px_24px_0px_0px_rgba(0,0,0,0.03)] overflow-hidden"
      style={{
  borderColor: accentGradient ? "black" : "black",
  background: accentGradient ? accentGradient : "white",
}}

    >
      {/* REACTIVE DEEP AURA */}
    

      {/* ================= HEADING: discord ================= */}
      <div className="relative z-10 space-y-6">
        <p className={cn("text-[12px] font-black tracking-[0.5em] text-white uppercase", cinzel.className)}>discord</p>
        <div className="relative border-2 border-black p-6 bg-white flex items-center gap-6 shadow-sm">
          <div className="relative flex-shrink-0">
            <img src={avatar} className="w-16 h-16 border-2 border-black p-0.5" alt="" />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 border-4 border-white rounded-full" style={{ backgroundColor: statusColor }} />
          </div>
          <div className="min-w-0">
            <p className={cn("text-3xl font-bold text-black truncate leading-none", blackletter.className)}>{discord.discord_user.username}</p>
            <p className={cn("text-[10px] tracking-[0.3em] text-black/40 uppercase font-black mt-2", mono.className)}>
              {discord.discord_status} {discord.active_on_discord_desktop && "// STATION"}
            </p>
          </div>
        </div>
      </div>

      {/* ================= HEADING: spotify ================= */}
      <div className="relative z-10 space-y-6">
        <p className={cn("text-[12px] font-black tracking-[0.5em] text-white uppercase", cinzel.className)}>Now Playing</p>
        <div className="border-2 border-black p-6 bg-white shadow-sm transition-all duration-700">
          {nowPlaying?.isPlaying && nowPlaying.song ? (
            <div className="flex gap-6 items-center">
              <img src={nowPlaying.song.image} className="w-20 h-20 border-2 border-black shadow-md flex-shrink-0" alt="" />
              <div className="flex-1 min-w-0">
                <p className={cn("text-2xl font-black text-black leading-tight truncate mb-1", goth.className)}>{nowPlaying.song.title}</p>
                <p className={cn("text-[11px] tracking-widest text-black/40 uppercase font-bold truncate", mono.className)}>{nowPlaying.song.artist}</p>
                <div className="mt-6 h-[5px] w-full bg-black/5 relative overflow-hidden rounded-full">
                  
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-5 py-2 opacity-20">
              <FaSpotify size={28} />
              <p className={cn("text-xl italic tracking-widest", goth.className)}>The archive is silent.</p>
            </div>
          )}
        </div>
      </div>

      {/* ================= HEADING: recently played ================= */}
      <div className="relative z-10 space-y-5">
        <p className={cn("text-[11px] font-black tracking-[0.4em] text-white uppercase", cinzel.className)}>recently played</p>
        <div className="space-y-3">
          {recent.slice(0, 5).map((t, i) => (
            <div key={i} className="flex items-center gap-5 p-3 border border-black/5 hover:border-black transition-all bg-white group cursor-crosshair">
              <img src={t.image} className="w-12 h-12 border border-black/10 transition-transform group-hover:scale-105 flex-shrink-0" alt="" />
              <div className="flex-1 min-w-0">
                <p className={cn("text-[11px] font-black text-black truncate uppercase tracking-tighter", inter.className)}>{t.title}</p>
                <p className={cn("text-[9px] text-black/40 truncate uppercase font-bold", mono.className)}>{t.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= HEADING: top tracks ================= */}
      <div className="relative z-10 space-y-5">
        <p className={cn("text-[11px] font-black tracking-[0.4em] text-white uppercase", cinzel.className)}>top tracks</p>
        <div className="grid grid-cols-4 gap-4">
          {top.slice(0, 4).map((t, i) => (
            <div key={i} className="group overflow-hidden border-2 border-black/10 aspect-square bg-white hover:border-black transition-all">
              <img src={t.image} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" title={t.title} />
            </div>
          ))}
        </div>
      </div>

      {/* ================= HEADING: connections ================= */}
      <div className="relative z-10 space-y-5">
        <p className={cn("text-[12px] font-black tracking-[0.5em] text-white uppercase", cinzel.className)}>connections</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: "Instagram", link: "https://instagram.com/arihanntt", icon: FaInstagram },
            { name: "Spotify", link: "#", icon: FaSpotify },
            { name: "Roblox", link: "#", icon: SiRoblox },
            { name: "Studio", link: "#", icon: FaGlobe },
          ].map((c, i) => (
            <a key={i} href={c.link} target="_blank" className="flex items-center gap-4 border-2 border-black p-4 hover:bg-black hover:text-white transition-all group bg-white overflow-hidden">
              <c.icon size={16} className="opacity-40 group-hover:opacity-100 flex-shrink-0" />
              <p className={cn("text-[11px] font-black uppercase tracking-widest truncate", mono.className)}>{c.name}</p>
            </a>
          ))}
        </div>
      </div>

      {/* ================= HEADING: current activity ================= */}
      {lastActivity && (
        <div className="relative z-10 pt-8 border-t-2 border-black/10 space-y-6">
           <p className={cn("text-[11px] font-black tracking-[0.5em] text-white uppercase", cinzel.className)}>current activity</p>
           <ActivityCard activity={lastActivity} />
        </div>
      )}

      {/* FINAL CHISELED MARKER */}
      <div className="pt-6 flex justify-center text-black/5 select-none relative z-10">
         <span className="text-7xl font-light">†</span>
      </div>
    </div>
  );
}