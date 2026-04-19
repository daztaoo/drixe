"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { FaSpotify, FaDiscord, FaTwitch, FaYoutube } from "react-icons/fa";
import { Zap, Layout, Share2, Lock } from "lucide-react";

const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

const INTEGRATION_FEATURES = [
  {
    icon: FaSpotify,
    color: "#1DB954",
    title: "Spotify",
    tag: "Now Playing",
    desc: "Show your current track live on your profile. Album art, progress bar, and artist — updated every 30 seconds.",
  },
  {
    icon: FaDiscord,
    color: "#5865F2",
    title: "Discord",
    tag: "Presence",
    desc: "Display your real-time status — online, gaming, listening — directly on your public profile via Lanyard.",
  },
  {
    icon: FaTwitch,
    color: "#9147FF",
    title: "Twitch",
    tag: "Live → Top",
    desc: "When you go live, your Twitch link auto-promotes itself to the top of your profile with a LIVE badge.",
  },
  {
    icon: FaYoutube,
    color: "#FF0000",
    title: "YouTube",
    tag: "Live → Top",
    desc: "Same as Twitch — YouTube livestreams surface instantly, so your audience never misses you.",
  },
];

const PLATFORM_FEATURES = [
  {
    icon: Layout,
    color: "#a855f7",
    title: "5 Themes",
    desc: "Glass, Gothic, Retro, Minimal, Cyberpunk. Switch with one click. Your content stays, only the look changes.",
  },
  {
    icon: Share2,
    color: "#3b82f6",
    title: "Smart Links",
    desc: "Add up to 10 links. Drag to reorder. Live integrations automatically pin the most relevant link to the top.",
  },
  {
    icon: Zap,
    color: "#f59e0b",
    title: "Instant Profile",
    desc: "Go from signup to live public profile in under 2 minutes. No design skills required.",
  },
  {
    icon: Lock,
    color: "#10b981",
    title: "Always Private",
    desc: "You control what's visible. Toggle any integration, hide any link, or go fully dark — one click.",
  },
];

function IntegrationCard({ item, i }: { item: typeof INTEGRATION_FEATURES[0]; i: number }) {
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08 }}
      className="group relative bg-black/5 border border-black/[0.06] rounded-2xl p-5 hover:border-black/15 transition-all hover:shadow-sm"
    >
      {/* Live dot */}
      <div
        className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest"
        style={{ background: item.color + "15", color: item.color, border: `1px solid ${item.color}20` }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: item.color, boxShadow: `0 0 4px ${item.color}` }}
        />
        {item.tag}
      </div>

      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ background: item.color + "15", border: `1px solid ${item.color}25` }}
      >
        <Icon size={20} style={{ color: item.color }} />
      </div>

      <h3 className={cn("text-base font-bold text-black mb-1.5", inter.className)}>
        {item.title}
      </h3>
      <p className="text-sm text-black/50 leading-relaxed">{item.desc}</p>
    </motion.div>
  );
}

export function Features() {
  return (
    <section className="relative bg-white py-20 md:py-32 border-t border-black/5 overflow-hidden">
      {/* Architectural vertical rules */}
      <div className="absolute left-[40px] top-0 w-px h-full bg-black/[0.05] hidden md:block" />
      <div className="absolute right-[40px] top-0 w-px h-full bg-black/[0.05] hidden md:block" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        {/* Section header */}
        <div className="mb-14">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className={cn("text-[11px] uppercase tracking-[0.25em] text-black/30 mb-3", mono.className)}
          >
            Live Identity System
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn("text-4xl sm:text-5xl font-black text-black leading-tight", inter.className)}
          >
            Your profile is{" "}
            <span className="relative inline-block">
              alive.
              <span className="absolute bottom-1 left-0 right-0 h-[3px] bg-black/10 rounded" />
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={cn("text-base text-black/50 mt-4 max-w-lg", inter.className)}
          >
            Connect your platforms and watch your profile update in real time — no refreshes, no manual edits.
          </motion.p>
        </div>

        {/* Integration cards — 4 platform cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {INTEGRATION_FEATURES.map((item, i) => (
            <IntegrationCard key={item.title} item={item} i={i} />
          ))}
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-black/5" />

        {/* Platform features — 4 general features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLATFORM_FEATURES.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex flex-col gap-3 p-5 rounded-2xl bg-black/[0.03] border border-black/[0.05] hover:border-black/10 transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: item.color + "15" }}
                >
                  <Icon size={16} style={{ color: item.color }} />
                </div>
                <div>
                  <p className={cn("text-sm font-bold text-black", inter.className)}>{item.title}</p>
                  <p className="text-xs text-black/40 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
