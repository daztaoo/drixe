"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import {
  Lock, Award, Zap, Crown, Bug, DollarSign,
  Globe, ShieldCheck, PenTool, Check, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

// Badge definitions — id must match user_badges.badge_id in Supabase
const ALL_BADGES = [
  {
    id: "og",
    name: "OG",
    desc: "One of the first 100 on Drixe. Automatically awarded.",
    icon: Award,
    color: "text-amber-400",
    action: null,
    href: null,
    autoEarn: "Top 100 member",
  },
  {
    id: "premium",
    name: "Premium",
    desc: "Subscribed to Drixe Premium.",
    icon: Crown,
    color: "text-purple-400",
    action: "Upgrade",
    href: "/dashboard/premium",
    autoEarn: null,
  },
  {
    id: "linked",
    name: "Linked Up",
    desc: "Added 5 or more links to your profile.",
    icon: Globe,
    color: "text-blue-400",
    action: "Add Links",
    href: "/dashboard/links",
    autoEarn: "Add 5+ links",
  },
  {
    id: "connected",
    name: "Integrated",
    desc: "Connected at least one integration (Spotify, Discord, Twitch, or YouTube).",
    icon: Zap,
    color: "text-green-400",
    action: "Connect",
    href: "/dashboard/integrations",
    autoEarn: "Connect 1+ integration",
  },
  {
    id: "verified",
    name: "Verified",
    desc: "Identity confirmed by the Drixe team.",
    icon: ShieldCheck,
    color: "text-sky-400",
    action: null,
    href: null,
    autoEarn: null,
  },
  {
    id: "bug_hunter",
    name: "Bug Hunter",
    desc: "Reported a valid bug to the Drixe team.",
    icon: Bug,
    color: "text-rose-400",
    action: null,
    href: null,
    autoEarn: null,
  },
];

export default function BadgesPage() {
  const [loading, setLoading] = useState(true);
  const [myBadges, setMyBadges] = useState<string[]>([]);
  const [stats, setStats] = useState({ links: 0, integrations: 0, uidSerial: null as number | null });

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [
        { data: userBadgeRows },
        { count: linkCount },
        { count: intCount },
        { data: profile },
      ] = await Promise.all([
        supabase.from("user_badges").select("badge_id").eq("user_id", user.id),
        supabase.from("links").select("id", { count: "exact", head: true }).eq("profile_id", user.id),
        supabase.from("integrations").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("is_enabled", true),
        supabase.from("profiles").select("uid_serial").eq("id", user.id).single(),
      ]);

      const earned = new Set<string>((userBadgeRows || []).map((b: any) => b.badge_id));

      // Auto-compute from live data
      if (profile?.uid_serial && profile.uid_serial <= 100) earned.add("og");
      if ((linkCount ?? 0) >= 5) earned.add("linked");
      if ((intCount ?? 0) >= 1) earned.add("connected");

      setMyBadges([...earned]);
      setStats({ links: linkCount ?? 0, integrations: intCount ?? 0, uidSerial: profile?.uid_serial ?? null });
      setLoading(false);
    };
    load();
  }, []);

  const earnedBadges = ALL_BADGES.filter((b) => myBadges.includes(b.id));
  const lockedBadges = ALL_BADGES.filter((b) => !myBadges.includes(b.id));
  const pct = Math.round((earnedBadges.length / ALL_BADGES.length) * 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-24">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className={cn("text-2xl font-bold text-white", inter.className)}>Badges</h2>
          <p className="text-white/40 text-sm mt-1">{earnedBadges.length}/{ALL_BADGES.length} earned</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl self-start">
          <Shield size={13} className="text-white/40" />
          <span className={cn("text-xs text-white/40", mono.className)}>{pct}% complete</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: stats.links, label: "Links", tip: "5+ = Linked Up" },
          { value: stats.integrations, label: "Integrations", tip: "1+ = Integrated" },
          { value: stats.uidSerial ? `#${stats.uidSerial}` : "—", label: "Member #", tip: "Top 100 = OG" },
        ].map((s) => (
          <div key={s.label} className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-4 text-center">
            <p className={cn("text-xl font-black text-white", mono.className)}>{s.value}</p>
            <p className="text-[10px] text-white/30 mt-1">{s.label}</p>
            <p className="text-[9px] text-white/15 mt-0.5">{s.tip}</p>
          </div>
        ))}
      </div>

      {/* Earned */}
      {earnedBadges.length > 0 && (
        <div className="space-y-3">
          <p className={cn("text-xs font-bold text-white/50 uppercase tracking-widest", inter.className)}>Earned</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {earnedBadges.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="group relative border rounded-2xl p-5 flex items-center justify-between bg-white/5 border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/10">
                    <b.icon size={22} className={b.color} />
                  </div>
                  <div>
                    <h3 className={cn("text-sm font-bold text-white flex items-center gap-2", inter.className)}>
                      {b.name}
                      <Check size={12} className="text-green-400" />
                    </h3>
                    <p className="text-[11px] text-white/40 max-w-[220px] leading-tight mt-0.5">{b.desc}</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-green-500/10 text-green-400 text-[9px] font-bold uppercase tracking-wider rounded-lg border border-green-500/20 flex-shrink-0">
                  Owned
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      <div className="space-y-3">
        <p className={cn("text-xs font-bold text-white/25 uppercase tracking-widest", inter.className)}>Locked</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {lockedBadges.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="group relative border rounded-2xl p-5 bg-[#0A0A0A] border-white/5 opacity-60 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 grayscale group-hover:grayscale-0 transition-all">
                  <b.icon size={22} className="text-white/20 group-hover:text-white/50" />
                </div>
                <div>
                  <h3 className={cn("text-sm font-bold text-white/50", inter.className)}>{b.name}</h3>
                  <p className="text-[11px] text-white/30 max-w-[220px] leading-tight mt-0.5">{b.desc}</p>
                  {b.autoEarn && (
                    <p className={cn("text-[9px] text-white/20 mt-1", mono.className)}>→ {b.autoEarn}</p>
                  )}
                </div>
              </div>
              {b.action && b.href ? (
                <Link href={b.href}>
                  <button className="flex-shrink-0 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white/50 hover:text-white transition-all text-[10px] uppercase tracking-wide">
                    {b.action}
                  </button>
                </Link>
              ) : (
                <div className="flex-shrink-0 px-3 py-1 text-white/20 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Lock size={9} /> Locked
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {earnedBadges.length === 0 && (
        <div className="p-4 bg-purple-500/5 border border-purple-500/15 rounded-xl">
          <p className="text-xs text-white/40 leading-relaxed">
            💡 Add 5 links (
            <a href="/dashboard/links" className="text-purple-400 hover:underline">Links Manager</a>
            ) or connect an integration (
            <a href="/dashboard/integrations" className="text-purple-400 hover:underline">Integrations</a>
            ) to earn your first badges automatically.
          </p>
        </div>
      )}
    </div>
  );
}