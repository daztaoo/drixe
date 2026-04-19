"use client";

import { motion } from "framer-motion";
import { Inter_Tight, DM_Mono } from "next/font/google";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LiveBadge } from "@/components/ui/LiveBadge";

const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"] });

export default function MinimalLayout({
  profile,
  links,
  integrations = [],
}: {
  profile: any;
  links: any[];
  integrations?: any[];
}) {
  const liveTwitch = integrations.find((i) => i.platform === "twitch" && i.is_live);
  const liveYoutube = integrations.find((i) => i.platform === "youtube" && i.is_live);

  return (
    <div className="min-h-screen w-full bg-[#f9f9f9] flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        {/* Profile header */}
        <div className="text-center mb-8">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.username}
              className="w-18 h-18 rounded-2xl object-cover mx-auto mb-4 border border-black/10"
              style={{ width: 72, height: 72 }}
            />
          ) : (
            <div
              className="w-18 h-18 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl font-black text-white"
              style={{
                width: 72,
                height: 72,
                background: `linear-gradient(135deg, ${profile.accent_color || "#171717"}, #555)`,
              }}
            >
              {profile.username?.[0]?.toUpperCase()}
            </div>
          )}

          <h1 className={cn("text-xl font-bold text-[#171717]", inter.className)}>
            {profile.full_name || profile.username}
          </h1>
          <p className={cn("text-xs text-black/40 mt-0.5", mono.className)}>
            @{profile.username}
          </p>
          {(profile.bio || profile.description) && (
            <p className={cn("text-sm text-black/60 mt-3 leading-relaxed", inter.className)}>
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
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="group flex items-center justify-between w-full px-5 py-4 bg-white border border-black/10 rounded-2xl hover:border-black/30 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={cn("text-sm font-medium text-[#171717] truncate", inter.className)}>
                    {link.title}
                  </span>
                  {isLive && <LiveBadge viewerCount={liveTwitch?.live_viewer_count ?? liveYoutube?.live_viewer_count} />}
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-black/20 group-hover:text-black/60 flex-shrink-0 ml-2 transition-colors"
                />
              </motion.a>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <a
            href="/"
            className={cn("text-[10px] text-black/25 hover:text-black/50 transition-colors", mono.className)}
          >
            made with drixe
          </a>
        </div>
      </motion.div>
    </div>
  );
}
