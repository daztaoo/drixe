"use client";

import { Inter_Tight } from "next/font/google";
import { cn } from "@/lib/utils";
import { Check, Lock, Zap, Crown, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { FaDiscord, FaSpotify, FaTwitch, FaYoutube } from "react-icons/fa";

const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "600", "800"] });

const FREE_FEATURES = [
  "5 profile themes (Glass, Gothic, Retro, Minimal)",
  "Up to 10 links",
  "Discord presence widget",
  "Spotify now-playing widget",
  "Twitch + YouTube LIVE auto-priority",
  "Public analytics dashboard",
  "Custom bio + display name",
  "drixe.com/@yourname",
];

const PREMIUM_FEATURES = [
  { label: "Cyberpunk theme (exclusive)", hot: true },
  { label: "Unlimited links (no 10-link cap)", hot: false },
  { label: "Custom background image / GIF", hot: false },
  { label: "Profile audio track (ambient music)", hot: false },
  { label: "Custom cursor", hot: false },
  { label: "Premium badge on profile", hot: false },
  { label: "Priority support", hot: false },
  { label: "Early access to new themes", hot: true },
];

const INTEGRATIONS = [
  { icon: FaSpotify, color: "#1DB954", label: "Spotify" },
  { icon: FaDiscord, color: "#5865F2", label: "Discord" },
  { icon: FaTwitch, color: "#9147FF", label: "Twitch" },
  { icon: FaYoutube, color: "#FF0000", label: "YouTube" },
];

export default function PremiumPage() {
  return (
    <div className="space-y-10 pb-24 animate-in fade-in duration-500">

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-4">
          <Crown size={11} /> Premium
        </div>
        <h2 className={cn("text-3xl font-black text-white", inter.className)}>
          Make your profile unforgettable.
        </h2>
        <p className="text-white/40 text-sm mt-2 max-w-md mx-auto">
          Drixe is free forever. Premium unlocks the extras that make you stand out.
        </p>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">

        {/* Free */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col">
          <div className="mb-6">
            <p className={cn("text-xs font-bold text-white/50 uppercase tracking-widest mb-3", inter.className)}>Free</p>
            <div className="flex items-end gap-1">
              <span className={cn("text-4xl font-black text-white", inter.className)}>$0</span>
              <span className="text-white/30 text-sm mb-1">/ forever</span>
            </div>
            <p className="text-xs text-white/30 mt-2">Everything you need to get started.</p>
          </div>

          <ul className="space-y-2.5 flex-1">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check size={13} className="text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-white/60">{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <a
              href="/dashboard"
              className="block w-full py-3 text-center border border-white/10 text-white/50 text-xs font-bold uppercase tracking-widest rounded-xl hover:border-white/20 hover:text-white transition-all"
            >
              Current Plan
            </a>
          </div>
        </div>

        {/* Premium */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative bg-gradient-to-b from-amber-900/20 to-[#0a0a0a] border border-amber-500/30 rounded-2xl p-6 flex flex-col overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className={cn("text-xs font-bold text-amber-400 uppercase tracking-widest", inter.className)}>Premium</p>
              <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded-full text-[9px] font-bold text-amber-400 uppercase tracking-wide">
                Most Popular
              </span>
            </div>
            <div className="flex items-end gap-1">
              <span className={cn("text-4xl font-black text-white", inter.className)}>$6.99</span>
              <span className="text-white/30 text-sm mb-1">/ month</span>
            </div>
            <p className="text-xs text-white/30 mt-2">Or $59/year — save 30%.</p>
          </div>

          <ul className="space-y-2.5 flex-1 relative">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f.label} className="flex items-start gap-2.5">
                <Check size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-white/70 flex-1">{f.label}</span>
                {f.hot && (
                  <span className="px-1.5 py-0.5 bg-amber-500/20 rounded text-[8px] font-bold text-amber-400 uppercase flex-shrink-0">New</span>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-6 relative">
            <button
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
              onClick={() => alert("Payment integration coming soon! Contact ariha@drixe.com to get early access.")}
            >
              <Zap size={13} /> Upgrade to Premium
            </button>
            <p className="text-center text-[10px] text-white/20 mt-2">Coming soon. Join the waitlist.</p>
          </div>
        </motion.div>
      </div>

      {/* Integration badges */}
      <div className="max-w-2xl mx-auto">
        <p className="text-[10px] text-white/20 uppercase tracking-widest text-center mb-4">Included on all plans</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {INTEGRATIONS.map((intg) => (
            <div
              key={intg.label}
              className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/[0.07] rounded-xl"
            >
              <intg.icon size={14} style={{ color: intg.color }} />
              <span className="text-xs text-white/50 font-medium">{intg.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto space-y-3">
        <p className={cn("text-sm font-bold text-white/50 uppercase tracking-widest mb-4", inter.className)}>FAQ</p>
        {[
          { q: "Is the free plan really free forever?", a: "Yes. No trial, no expiry. The core Drixe experience — live profile, 10 links, all 4 integrations — is completely free." },
          { q: "What payment methods will you accept?", a: "Stripe (card + Apple Pay + Google Pay). Payment integration is coming very soon — join the waitlist to be first." },
          { q: "Can I cancel anytime?", a: "Yes, cancellation is instant. Your profile reverts to the free plan with no data loss." },
          { q: "Do I need a credit card for free?", a: "No. Sign up with email or OAuth (Google/Discord). Zero card required." },
        ].map((item) => (
          <div key={item.q} className="bg-[#0a0a0a] border border-white/[0.07] rounded-xl p-5">
            <p className={cn("text-sm font-bold text-white mb-2", inter.className)}>{item.q}</p>
            <p className="text-xs text-white/40 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
