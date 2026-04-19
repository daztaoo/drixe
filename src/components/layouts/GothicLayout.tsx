"use client";

import { motion, AnimatePresence } from "framer-motion";
import { UnifrakturMaguntia, Cinzel_Decorative, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  FaYoutube, FaTwitch, FaSpotify, FaDiscord, FaInstagram,
  FaTwitter, FaGithub, FaTiktok, FaTelegram, FaSoundcloud,
  FaReddit, FaPatreon, FaSteam, FaGlobe
} from "react-icons/fa";
import { SiRoblox, SiCashapp } from "react-icons/si";

const gothic = UnifrakturMaguntia({ weight: ["400"], subsets: ["latin"] });
const cinzel = Cinzel_Decorative({ weight: ["400", "700"], subsets: ["latin"] });
const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600"] });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "700"] });

// Platform icon map
const PLATFORM_ICONS: Record<string, { Icon: any; color: string }> = {
  youtube:    { Icon: FaYoutube,    color: "#FF0000" },
  twitch:     { Icon: FaTwitch,     color: "#9147FF" },
  spotify:    { Icon: FaSpotify,    color: "#1DB954" },
  discord:    { Icon: FaDiscord,    color: "#5865F2" },
  instagram:  { Icon: FaInstagram,  color: "#E1306C" },
  twitter:    { Icon: FaTwitter,    color: "#1DA1F2" },
  tiktok:     { Icon: FaTiktok,     color: "#ffffff" },
  telegram:   { Icon: FaTelegram,   color: "#229ED9" },
  github:     { Icon: FaGithub,     color: "#ffffff" },
  soundcloud: { Icon: FaSoundcloud, color: "#FF5500" },
  reddit:     { Icon: FaReddit,     color: "#FF4500" },
  patreon:    { Icon: FaPatreon,    color: "#FF424D" },
  steam:      { Icon: FaSteam,      color: "#aaaaaa" },
  roblox:     { Icon: SiRoblox,     color: "#E2231A" },
  cashapp:    { Icon: SiCashapp,    color: "#00D54B" },
  custom:     { Icon: FaGlobe,      color: "#888888" },
};

// LIVE badge
function LiveBadge() {
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-[9px] font-black text-white uppercase tracking-widest animate-pulse">
      <span className="w-1.5 h-1.5 rounded-full bg-white" />LIVE
    </span>
  );
}

export default function GothicLayout({
  profile,
  links,
  integrations = [],
  isLive = false,
}: {
  profile: any;
  links: any[];
  integrations?: any[];
  isLive?: boolean;
}) {
  const [typedName, setTypedName] = useState("");
  const fullName = profile.full_name || profile.username;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedName(fullName.slice(0, i + 1));
      i++;
      if (i > fullName.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [fullName]);

  const discord = integrations?.find((i: any) => i.platform === "discord" && i.platform_user_id && i.show_on_profile);
  const spotify = integrations?.find((i: any) => i.platform === "spotify" && i.show_on_profile);

  return (
    <div className="min-h-screen w-full bg-[#0e0e0e] text-white relative overflow-x-hidden">

      {/* CRT scanlines */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.06]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0) 50%, rgba(0,0,0,0.5) 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Subtle grain */}
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none z-40"
        style={{ backgroundImage: "url(\"https://grainy-gradients.vercel.app/noise.svg\")" }}
      />

      {/* Vignette */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)] pointer-events-none z-30" />

      {/* ===== MAIN LAYOUT ===== */}
      <div className="relative z-20 flex flex-col lg:flex-row min-h-screen">

        {/* ── LEFT COLUMN: Identity Card ─────────────────────────────── */}
        <div className="w-full lg:w-[280px] xl:w-[300px] lg:min-h-screen flex-shrink-0 bg-black/40 border-r border-white/[0.06] flex flex-col">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center p-6 pt-10 gap-4 flex-1"
          >
            {/* Top label */}
            <p className={cn("text-[9px] tracking-[0.5em] uppercase text-white/20 text-center", cinzel.className)}>
              The Ritual Begins
            </p>

            {/* Avatar */}
            <div className="relative mt-2">
              <div className="absolute -inset-[2px] rounded-none bg-gradient-to-b from-white/10 to-transparent" />
              <div className="relative w-40 h-40 overflow-hidden border border-white/10" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                ) : (
                  <div className="w-full h-full bg-[#111] flex items-center justify-center text-5xl text-white/10 font-black">
                    {profile.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="text-center mt-2">
              <h1 className={cn("text-3xl xl:text-4xl text-white leading-none", gothic.className)}>
                {typedName}<span className="animate-pulse text-white/30">_</span>
              </h1>
              <p className={cn("text-[10px] tracking-[0.3em] uppercase text-white/25 mt-2", mono.className)}>
                @{profile.username}
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />

            {/* Bio */}
            {(profile.bio || profile.description) && (
              <p className={cn("text-xs text-white/40 text-center leading-relaxed italic px-2", inter.className)}>
                {profile.bio || profile.description}
              </p>
            )}

            {/* Stats row */}
            <div className="flex gap-3 mt-2">
              <div className="flex flex-col items-center">
                <span className={cn("text-lg font-black text-white", mono.className)}>{profile.views_count || 0}</span>
                <span className="text-[9px] text-white/25 uppercase tracking-widest">views</span>
              </div>
              <div className="w-px bg-white/10" />
              <div className="flex flex-col items-center">
                <span className={cn("text-lg font-black text-white", mono.className)}>{profile.likes_count || 0}</span>
                <span className="text-[9px] text-white/25 uppercase tracking-widest">likes</span>
              </div>
            </div>

            {/* Spacer pushes presence to bottom */}
            <div className="flex-1" />

            {/* Discord presence (left column, bottom) */}
            {discord && (
              <div className="w-full mt-4">
                <DiscordMiniCard discordId={discord.platform_user_id} />
              </div>
            )}
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN: Content ──────────────────────────────────── */}
        <div className="flex-1 p-6 md:p-10 lg:p-14 overflow-y-auto space-y-12">

          {/* ABOUT ME */}
          {(profile.bio || profile.description) && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className={cn("text-[10px] tracking-[0.4em] uppercase text-white/30 mb-3", cinzel.className)}>About Me</p>
              <div className="space-y-1">
                <p className={cn("text-white/80 text-sm leading-relaxed", inter.className)}>
                  {profile.bio || profile.description}
                </p>
              </div>
            </motion.section>
          )}

          {/* LINKS */}
          {links.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <p className={cn("text-[10px] tracking-[0.4em] uppercase text-white/30", cinzel.className)}>Links</p>
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className={cn("text-[9px] text-white/15", mono.className)}>{links.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {links.map((link, i) => {
                  const pt = link.platform_type || "custom";
                  const platInfo = PLATFORM_ICONS[pt] || PLATFORM_ICONS.custom;
                  const isLiveLink = isLive && (pt === "twitch" || pt === "youtube");

                  return (
                    <motion.a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.07 }}
                      className="group relative flex items-center gap-3 p-4 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.07] hover:border-white/20 rounded-none transition-all duration-300 overflow-hidden"
                      style={{
                        clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                      }}
                    >
                      {/* Hover glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{ background: `linear-gradient(135deg, ${platInfo.color}08, transparent)` }}
                      />

                      {/* Platform icon */}
                      <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 relative z-10">
                        <platInfo.Icon size={18} style={{ color: platInfo.color }} />
                      </div>

                      {/* Title */}
                      <span className={cn("text-sm text-white/70 group-hover:text-white transition-colors flex-1 truncate relative z-10", inter.className)}>
                        {link.title}
                      </span>

                      {/* Live badge or arrow */}
                      <div className="relative z-10 flex-shrink-0">
                        {isLiveLink ? (
                          <LiveBadge />
                        ) : (
                          <ArrowUpRight size={14} className="text-white/20 group-hover:text-white/60 -translate-x-1 group-hover:translate-x-0 transition-all duration-300" />
                        )}
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* SPOTIFY NOW PLAYING */}
          {spotify && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <p className={cn("text-[10px] tracking-[0.4em] uppercase text-white/30 mb-4", cinzel.className)}>
                Now Playing
              </p>
              <SpotifyMiniCard username={profile.username} />
            </motion.section>
          )}

          {/* FOOTER */}
          <div className="pt-8 border-t border-white/[0.05]">
            <p className={cn("text-[9px] tracking-[0.35em] uppercase text-white/10 text-right", cinzel.className)}>
              Drixe · {profile.username}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mini Discord card (inline, no external dependency boundary needed) ──────────
function DiscordMiniCard({ discordId }: { discordId: string }) {
  const [data, setData] = useState<any>(null);
  const [state, setState] = useState<"loading" | "live" | "offline" | "error">("loading");
  const mono2 = mono;

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
        if (!res.ok) { setState("error"); return; }
        const json = await res.json();
        if (!json.success) { setState("error"); return; }
        setData(json.data);
        setState(json.data.discord_status === "offline" ? "offline" : "live");
      } catch { setState("error"); }
    };
    fetch_();
    const id = setInterval(fetch_, 30_000);
    return () => clearInterval(id);
  }, [discordId]);

  const STATUS_COLORS: Record<string, string> = { online: "#23a55a", idle: "#f0b232", dnd: "#f23f43", offline: "#80848e" };

  if (state === "loading") return (
    <div className="w-full p-3 bg-[#111015] border border-white/[0.07] flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
      <div className="flex-1 space-y-1.5">
        <div className="h-2 bg-white/5 animate-pulse rounded w-20" />
        <div className="h-1.5 bg-white/5 animate-pulse rounded w-14" />
      </div>
    </div>
  );

  if (state === "error") return null;

  const avatar = data?.discord_user?.avatar
    ? `https://cdn.discordapp.com/avatars/${discordId}/${data.discord_user.avatar}.png?size=64`
    : null;

  const statusColor = STATUS_COLORS[data?.discord_status || "offline"];
  const activity = data?.activities?.find((a: any) => a.type === 0);
  const spotify = data?.spotify;

  return (
    <div className="w-full bg-[#111015] border border-white/[0.07] p-3 space-y-2">
      <p className={cn("text-[8px] tracking-[0.4em] uppercase text-white/20", cinzel.className)}>Discord</p>
      <div className="flex items-center gap-2.5">
        <div className="relative flex-shrink-0">
          {avatar
            ? <img src={avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
            : <div className="w-8 h-8 rounded-full bg-[#5865F2]/20 flex items-center justify-center text-xs text-[#5865F2]">D</div>
          }
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#111015]" style={{ background: statusColor }} />
        </div>
        <div className="min-w-0">
          <p className={cn("text-[11px] font-bold text-white/80 truncate", mono2.className)}>
            {data?.discord_user?.display_name || data?.discord_user?.username}
          </p>
          {spotify ? (
            <p className="text-[9px] text-[#1DB954] truncate">♫ {spotify.song}</p>
          ) : activity ? (
            <p className="text-[9px] text-white/30 truncate">Playing {activity.name}</p>
          ) : (
            <p className="text-[9px] text-white/25">{data?.discord_status === "online" ? "Online" : data?.discord_status === "idle" ? "Idle" : data?.discord_status === "dnd" ? "Do Not Disturb" : "Offline"}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Mini Spotify card ──────────────────────────────────────────────────────────
function SpotifyMiniCard({ username }: { username: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/spotify/now-playing?username=${username}`);
        if (res.ok) { const json = await res.json(); setData(json); }
      } catch { /* silent */ } finally { setLoading(false); }
    };
    load();
  }, [username]);

  if (loading) return (
    <div className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/[0.06]">
      <div className="w-12 h-12 bg-[#1DB954]/10 animate-pulse" />
      <div className="space-y-2 flex-1"><div className="h-2.5 bg-white/10 animate-pulse rounded w-32" /><div className="h-2 bg-white/5 animate-pulse rounded w-20" /></div>
    </div>
  );

  if (!data?.isPlaying) return (
    <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/[0.05]">
      <div className="w-12 h-12 bg-[#1DB954]/5 border border-[#1DB954]/10 flex items-center justify-center flex-shrink-0">
        <FaSpotify size={20} color="#1DB954" className="opacity-30" />
      </div>
      <div>
        <p className={cn("text-xs text-white/40", inter.className)}>The archive is silent.</p>
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-3 p-4 bg-[#1DB954]/5 border border-[#1DB954]/15">
      {data.albumArt && <img src={data.albumArt} alt="" className="w-12 h-12 object-cover flex-shrink-0" />}
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-bold text-white truncate", inter.className)}>{data.title}</p>
        <p className="text-xs text-[#1DB954]/70 truncate">{data.artist}</p>
      </div>
      <div className="flex gap-0.5 items-end flex-shrink-0">
        {[1, 2, 3, 4].map((b) => (
          <div key={b} className="w-0.5 rounded-full bg-[#1DB954] transition-all"
            style={{ height: `${6 + b * 3}px`, animation: `music-bar ${0.4 + b * 0.15}s ease-in-out infinite alternate` }}
          />
        ))}
      </div>
    </div>
  );
}