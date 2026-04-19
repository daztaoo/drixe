"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import {
  User, Hash, Eye, Edit2, Upload, Type, Link as LinkIcon,
  Settings, Zap, Share2, AlertCircle, ArrowUpRight, Crown, Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type HourlyBucket = { label: string; count: number };

const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

const StatCard = ({
  label, value, sub, icon: Icon, color, delay = 0, href,
}: {
  label: string; value: string | number; sub?: string;
  icon: any; color: string; delay?: number; href?: string;
}) => {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="group relative p-5 bg-[#0a0a0a] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-white/15 transition-all duration-300"
    >
      {/* Corner glow blob */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-25 transition-opacity group-hover:opacity-40 pointer-events-none"
        style={{ background: color }} />
      {/* Bottom tint */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at 80% 20%, ${color}08, transparent 60%)` }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <p className={cn("text-[9px] uppercase tracking-[0.35em] text-white/35 font-bold", inter.className)}>{label}</p>
          <div className="w-7 h-7 rounded-xl flex items-center justify-center border border-white/[0.06] group-hover:border-opacity-30 transition-all"
            style={{ background: color + "18" }}>
            <Icon size={13} style={{ color }} />
          </div>
        </div>
        <p className={cn("text-3xl font-black text-white leading-none", mono.className)}>{value}</p>
        {sub && <p className="text-[10px] text-white/25 mt-2">{sub}</p>}
      </div>

      {href && (
        <ArrowUpRight size={12} className="absolute bottom-4 right-4 text-white/10 group-hover:text-white/40 transition-colors" />
      )}
    </motion.div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
};

export default function DashboardOverview() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [viewCount, setViewCount] = useState(0);
  const [linksCount, setLinksCount] = useState(0);
  const [completion, setCompletion] = useState(0);
  const [hourlyViews, setHourlyViews] = useState<HourlyBucket[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, viewRes, linksRes, analyticsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("analytics").select("*", { count: "exact", head: true }).eq("profile_id", user.id).eq("event_type", "view"),
        supabase.from("links").select("*", { count: "exact", head: true }).eq("profile_id", user.id),
        supabase.from("analytics").select("created_at").eq("profile_id", user.id).eq("event_type", "view").gte("created_at", new Date(Date.now() - 12 * 3600 * 1000).toISOString()),
      ]);

      const p = profileRes.data;
      setProfile(p);
      setViewCount(viewRes.count || 0);
      setLinksCount(linksRes.count || 0);

      let score = 0;
      if (p?.username) score += 25;
      if (p?.full_name) score += 25;
      if (p?.avatar_url) score += 25;
      if (p?.bio || p?.description) score += 25;
      setCompletion(score);

      const buckets: HourlyBucket[] = Array.from({ length: 12 }, (_, i) => {
        const hour = new Date(Date.now() - (11 - i) * 3_600_000).getHours();
        return {
          label: `${hour}h`,
          count: (analyticsRes.data || []).filter((v) => new Date(v.created_at).getHours() === hour).length,
        };
      });
      setHourlyViews(buckets);
      setLoading(false);
    };
    load();
  }, []);

  if (loading || !profile) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-white/[0.04] rounded-2xl" />)}
      </div>
      <div className="h-64 bg-white/[0.04] rounded-2xl" />
    </div>
  );

  const maxViews = Math.max(...hourlyViews.map((h) => h.count), 1);

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h2 className={cn("text-xl font-black text-white", inter.className)}>
            {profile.full_name ? `Hey, ${profile.full_name.split(" ")[0]} 👋` : "Dashboard"}
          </h2>
          <p className={cn("text-xs text-white/30 mt-0.5", inter.className)}>
            @{profile.username} · {profile.is_premium ? "✦ Premium" : "Free plan"}
          </p>
        </div>
        <Link
          href={`/${profile.username}`}
          target="_blank"
          className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white text-xs font-bold rounded-xl transition-all"
        >
          <Eye size={13} />
          View Profile
          <ArrowUpRight size={11} className="text-white/30" />
        </Link>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Profile Views"  value={viewCount}         sub="All time"            icon={Eye}      color="#a855f7" delay={0}    />
        <StatCard label="Links"          value={linksCount}        sub="Active links"         icon={LinkIcon} color="#3b82f6" delay={0.05} href="/dashboard/links" />
        <StatCard label="Join Number"    value={`#${profile.uid_serial || "—"}`} sub="Early member"    icon={Hash}     color="#f59e0b" delay={0.1}  />
        <StatCard label="Plan"           value={profile.is_premium ? "Premium" : "Free"} sub={profile.is_premium ? "Full access" : "Upgrade →"} icon={Crown} color={profile.is_premium ? "#a855f7" : "#444"} delay={0.15} href="/dashboard/premium" />
      </div>

      {/* Middle: Completion + Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Completion widget (2/3 width) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-[#0a0a0a] border border-white/[0.07] rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-transparent pointer-events-none" />

          <div className="flex items-center justify-between mb-5 relative z-10">
            <div>
              <h3 className={cn("text-sm font-bold text-white", inter.className)}>Profile Completion</h3>
              <p className="text-[10px] text-white/30 mt-0.5">Complete your profile to stand out</p>
            </div>
            <span className={cn("text-2xl font-black", mono.className, completion === 100 ? "text-green-400" : "text-purple-400")}>
              {completion}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full bg-white/[0.06] rounded-full mb-6 overflow-hidden relative z-10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completion}%` }}
              transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: completion === 100 ? "#22c55e" : "linear-gradient(90deg,#7c3aed,#a855f7,#6366f1)" }}
            />
          </div>

          {/* Checklist + CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 relative z-10">
            {[
              { label: "Upload Avatar", done: !!profile.avatar_url, href: "/dashboard/customize", icon: Upload },
              { label: "Set Display Name", done: !!profile.full_name, href: "/dashboard/customize", icon: User },
              { label: "Write a Bio", done: !!(profile.bio || profile.description), href: "/dashboard/customize", icon: Type },
              { label: "Add Links", done: linksCount > 0, href: "/dashboard/links", icon: LinkIcon },
            ].map(({ label, done, href, icon: Icon }) => (
              <Link key={label} href={href}
                className="flex items-center gap-3 p-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/10 rounded-xl transition-all group"
              >
                <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                  done ? "bg-green-500/20 text-green-400" : "bg-white/5 text-white/30"
                )}>
                  {done ? <span className="text-[10px] font-black">✓</span> : <Icon size={11} />}
                </div>
                <span className={cn("text-xs font-medium", done ? "text-white/40 line-through" : "text-white/70")}>{label}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Quick actions ( 1/3) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#0a0a0a] border border-white/[0.07] rounded-2xl p-5 flex flex-col gap-2"
        >
          <p className={cn("text-[9px] uppercase tracking-[0.35em] text-white/25 mb-2", inter.className)}>Quick Actions</p>

          {[
            { label: "Customize Profile", href: "/dashboard/customize", icon: Edit2, color: "#a855f7" },
            { label: "Manage Links", href: "/dashboard/links", icon: LinkIcon, color: "#3b82f6" },
            { label: "Integrations", href: "/dashboard/integrations", icon: Activity, color: "#22c55e" },
            { label: "Templates", href: "/dashboard/templates", icon: Settings, color: "#f59e0b" },
            { label: "Settings", href: "/dashboard/settings", icon: Settings, color: "#6b7280" },
          ].map(({ label, href, icon: Icon, color }) => (
            <Link key={label} href={href}
              className="flex items-center gap-3 p-3 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] hover:border-white/10 rounded-xl transition-all group"
            >
              <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + "18" }}>
                <Icon size={11} style={{ color }} />
              </div>
              <span className={cn("text-xs font-medium text-white/60 group-hover:text-white/90 transition-colors flex-1", inter.className)}>
                {label}
              </span>
              <ArrowUpRight size={10} className="text-white/10 group-hover:text-white/40 transition-colors" />
            </Link>
          ))}

          {/* Premium upsell */}
          {!profile.is_premium && (
            <Link href="/dashboard/premium"
              className="mt-2 flex items-center gap-3 p-3 bg-gradient-to-r from-purple-900/30 to-indigo-900/20 border border-purple-500/20 hover:border-purple-500/40 rounded-xl transition-all group"
            >
              <Crown size={13} className="text-purple-400 flex-shrink-0" />
              <span className={cn("text-xs font-bold text-purple-300 group-hover:text-purple-200 transition-colors", inter.className)}>
                Upgrade to Premium
              </span>
              <Zap size={10} className="text-yellow-400 ml-auto" />
            </Link>
          )}
        </motion.div>
      </div>

      {/* Views chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#0a0a0a] border border-white/[0.07] rounded-2xl p-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/5 to-transparent pointer-events-none" />
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div>
            <h3 className={cn("text-sm font-bold text-white", inter.className)}>View Activity</h3>
            <p className="text-[10px] text-white/30">Last 12 hours — {viewCount} total</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            <span className={cn("text-[9px] text-white/25 uppercase tracking-widest", mono.className)}>Live</span>
          </div>
        </div>

        <div className="flex items-end gap-1 h-28 relative z-10">
          {hourlyViews.map((bucket, i) => {
            const heightPct = Math.max((bucket.count / maxViews) * 100, 3);
            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1 group">
                <div className="relative w-full flex items-end justify-center" style={{ height: "96px" }}>
                  {bucket.count > 0 && (
                    <span className="absolute -top-5 text-[8px] text-white/50 font-mono opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      {bucket.count}
                    </span>
                  )}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ delay: 0.35 + i * 0.03, duration: 0.5, ease: "easeOut" }}
                    className="w-full rounded-t-sm transition-all duration-300"
                    style={{
                      background: bucket.count > 0
                        ? `linear-gradient(to top, #7c3aed, #a855f7)`
                        : "rgba(255,255,255,0.04)",
                    }}
                  />
                </div>
                <span className={cn("text-[7px] text-white/20", mono.className)}>{bucket.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}