"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { Users, Star, Zap } from "lucide-react";

const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "600", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

const QUOTES = [
  { text: "Finally a profile that actually shows what I'm doing right now.", handle: "@rylx_vx" },
  { text: "Discord presence + Spotify widget = insane combo. My friends love it.", handle: "@nachtcoder" },
  { text: "Switched from Linktree in 5 minutes. Never going back.", handle: "@sunrisedev" },
  { text: "The Cyberpunk theme + my Twitch link going live automatically is 🔥", handle: "@glitchwave" },
  { text: "My profile goes live when I stream. It feels like magic.", handle: "@spectral_kz" },
  { text: "The Retro theme took me back. Hits different.", handle: "@synthghost" },
];

export function SocialProof() {
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });
      if (count !== null) setUserCount(count);
    };
    fetchCount().catch(console.error);
  }, []);

  const displayCount = userCount
    ? userCount >= 1000
      ? `${(userCount / 1000).toFixed(1)}k+`
      : `${userCount}+`
    : "—";

  return (
    <section className="relative bg-black py-20 md:py-32 overflow-hidden border-t border-white/[0.04]">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        {/* Stat headline */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 mb-16 text-center">
          {[
            { icon: Users, value: displayCount, label: "Active profiles" },
            { icon: Star, value: "5 themes", label: "Free to use" },
            { icon: Zap, value: "4 integrations", label: "Spotify, Discord, Twitch, YouTube" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <stat.icon size={16} className="text-white/50" />
              </div>
              <p className={cn("text-3xl font-black text-white", mono.className)}>{stat.value}</p>
              <p className="text-xs text-white/30">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Section heading */}
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={cn("text-[11px] uppercase tracking-[0.25em] text-white/20 mb-3", mono.className)}
          >
            What people are saying
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn("text-3xl sm:text-4xl font-black text-white", inter.className)}
          >
            Built different.
          </motion.h2>
        </div>

        {/* Quote grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUOTES.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:border-white/15 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star key={si} size={10} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className={cn("text-sm text-white/70 leading-relaxed mb-4", inter.className)}>
                &ldquo;{q.text}&rdquo;
              </p>
              <p className={cn("text-[10px] text-white/30", mono.className)}>{q.handle}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA nudge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-14 text-center"
        >
          <a
            href="/auth?view=signup"
            className={cn(
              "inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-black text-sm rounded-2xl hover:bg-white/90 transition-all active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)]",
              inter.className
            )}
          >
            <Zap size={16} />
            Claim your profile — free
          </a>
          <p className="text-xs text-white/20 mt-3">No credit card. Ready in 2 minutes.</p>
        </motion.div>
      </div>
    </section>
  );
}
