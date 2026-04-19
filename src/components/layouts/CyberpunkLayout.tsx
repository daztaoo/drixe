"use client";

import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Inter_Tight, Share_Tech_Mono } from "next/font/google";
import { LiveBadge } from "@/components/ui/LiveBadge";

const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "600", "800"] });
const techMono = Share_Tech_Mono({ subsets: ["latin"], weight: ["400"] });

export default function CyberpunkLayout({
  profile,
  links,
  integrations = [],
}: {
  profile: any;
  links: any[];
  integrations?: any[];
}) {
  const accent = "#00ffe0";
  const pink = "#ff00c8";
  const liveTwitch = integrations.find((i) => i.platform === "twitch" && i.is_live);
  const liveYoutube = integrations.find((i) => i.platform === "youtube" && i.is_live);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #00001a 0%, #001a0a 50%, #00001a 100%)" }}
    >
      {/* Neon grid background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${accent}08 1px, transparent 1px), linear-gradient(90deg, ${accent}08 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Scanlines */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,255,224,0.03) 0px, rgba(0,255,224,0.03) 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* Corner decorations */}
      <div
        className="fixed top-0 right-0 w-48 h-48 pointer-events-none z-0 opacity-30"
        style={{ background: `radial-gradient(circle at top right, ${pink}30, transparent 70%)` }}
      />
      <div
        className="fixed bottom-0 left-0 w-48 h-48 pointer-events-none z-0 opacity-30"
        style={{ background: `radial-gradient(circle at bottom left, ${accent}20, transparent 70%)` }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header card */}
        <div
          className="mb-6 p-6 rounded-2xl border relative overflow-hidden"
          style={{
            background: "rgba(0,255,224,0.03)",
            borderColor: `${accent}30`,
            boxShadow: `0 0 30px ${accent}15, inset 0 0 30px ${accent}05`,
          }}
        >
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${accent}, ${pink}, transparent)` }} />

          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div
              className="relative flex-shrink-0"
              style={{ filter: `drop-shadow(0 0 12px ${accent}60)` }}
            >
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.username}
                  className="w-16 h-16 rounded-xl object-cover"
                  style={{ border: `2px solid ${accent}40` }}
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black"
                  style={{
                    background: `${accent}15`,
                    border: `2px solid ${accent}40`,
                    color: accent,
                  }}
                >
                  {profile.username?.[0]?.toUpperCase()}
                </div>
              )}
              {/* Glitch pulse */}
              <div
                className="absolute inset-0 rounded-xl animate-ping opacity-20"
                style={{ border: `1px solid ${accent}`, animationDuration: "3s" }}
              />
            </div>

            <div className="min-w-0">
              <p
                className={cn("text-sm uppercase tracking-widest mb-0.5", techMono.className)}
                style={{ color: `${accent}60` }}
              >
                ID_PROFILE
              </p>
              <h1
                className={cn("text-xl font-black truncate", inter.className)}
                style={{ color: accent, textShadow: `0 0 20px ${accent}60` }}
              >
                {profile.full_name || profile.username}
              </h1>
              <p className={cn("text-xs mt-0.5 truncate", techMono.className)} style={{ color: `${pink}80` }}>
                @{profile.username}
              </p>
            </div>
          </div>

          {(profile.bio || profile.description) && (
            <p
              className={cn("text-xs mt-4 leading-relaxed border-t pt-3", techMono.className)}
              style={{ color: `${accent}60`, borderColor: `${accent}15` }}
            >
              {profile.bio || profile.description}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-2">
          {links.map((link, i) => {
            const isLive =
              (liveTwitch && link.url?.toLowerCase().includes(`twitch.tv/${liveTwitch.platform_username?.toLowerCase()}`)) ||
              (liveYoutube && (link.url?.includes("youtube.com") || link.url?.includes("youtu.be")));

            return (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group relative flex items-center justify-between w-full px-5 py-4 rounded-xl overflow-hidden transition-all duration-200"
                style={{
                  background: `${accent}05`,
                  border: `1px solid ${accent}20`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${accent}50`;
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${accent}15`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${accent}20`;
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: accent }}
                />

                <div className="flex items-center gap-3 min-w-0">
                  {/* Index number */}
                  <span
                    className={cn("text-[11px] flex-shrink-0", techMono.className)}
                    style={{ color: `${accent}40` }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn("text-sm font-bold truncate", inter.className)}
                    style={{ color: accent }}
                  >
                    {link.title}
                  </span>
                  {isLive && <LiveBadge viewerCount={liveTwitch?.live_viewer_count ?? liveYoutube?.live_viewer_count} />}
                </div>

                <Share2
                  size={14}
                  className="flex-shrink-0 opacity-30 group-hover:opacity-80 transition-opacity ml-2"
                  style={{ color: accent }}
                />
              </motion.a>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className={cn("text-[10px] uppercase tracking-widest", techMono.className)} style={{ color: `${accent}25` }}>
            [ drixe.network ]
          </p>
        </div>
      </motion.div>
    </div>
  );
}
