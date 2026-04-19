"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { TrendingUp, Eye, MousePointerClick, Clock, ExternalLink, Loader2 } from "lucide-react";

const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "600", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

type Period = "24h" | "7d" | "30d";

type Bucket = { label: string; count: number };
type LinkStat = { title: string; url: string; clicks: number };

const PERIODS: { key: Period; label: string; hours: number }[] = [
  { key: "24h", label: "24h", hours: 24 },
  { key: "7d", label: "7 days", hours: 168 },
  { key: "30d", label: "30 days", hours: 720 },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("7d");
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");

  const [totalViews, setTotalViews] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [linkStats, setLinkStats] = useState<LinkStat[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("id", user.id)
        .single();
      if (profile) {
        setProfileId(profile.id);
        setUsername(profile.username || "");
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!profileId) return;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId, period]);

  const loadData = async () => {
    if (!profileId) return;
    setLoading(true);

    const periodConfig = PERIODS.find((p) => p.key === period)!;
    const since = new Date(Date.now() - periodConfig.hours * 3600 * 1000).toISOString();
    const bucketCount = period === "24h" ? 24 : period === "7d" ? 7 : 30;
    const bucketHours = periodConfig.hours / bucketCount;

    // Fetch views
    const { data: viewRows } = await supabase
      .from("analytics")
      .select("created_at")
      .eq("profile_id", profileId)
      .eq("event_type", "view")
      .gte("created_at", since);

    // Fetch clicks
    const { data: clickRows } = await supabase
      .from("analytics")
      .select("created_at, link_url")
      .eq("profile_id", profileId)
      .eq("event_type", "click")
      .gte("created_at", since);

    // Fetch all links for titles
    const { data: links } = await supabase
      .from("links")
      .select("title, url")
      .eq("profile_id", profileId);

    setTotalViews(viewRows?.length ?? 0);
    setTotalClicks(clickRows?.length ?? 0);

    // Build time buckets from views
    const newBuckets: Bucket[] = Array.from({ length: bucketCount }, (_, i) => {
      const bucketStart = Date.now() - (bucketCount - i) * bucketHours * 3600 * 1000;
      const bucketEnd = bucketStart + bucketHours * 3600 * 1000;
      const count = (viewRows || []).filter((v) => {
        const t = new Date(v.created_at).getTime();
        return t >= bucketStart && t < bucketEnd;
      }).length;

      let label = "";
      const d = new Date(bucketStart);
      if (period === "24h") {
        label = `${d.getHours()}:00`;
      } else {
        label = `${d.toLocaleString("default", { month: "short" })} ${d.getDate()}`;
      }
      return { label, count };
    });
    setBuckets(newBuckets);

    // Per-link click stats
    const statMap: Record<string, number> = {};
    (clickRows || []).forEach((c) => {
      if (c.link_url) statMap[c.link_url] = (statMap[c.link_url] || 0) + 1;
    });
    const stats: LinkStat[] = (links || [])
      .map((l) => ({ title: l.title, url: l.url, clicks: statMap[l.url] || 0 }))
      .sort((a, b) => b.clicks - a.clicks);
    setLinkStats(stats);

    setLoading(false);
  };

  const maxBucket = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className={cn("text-2xl font-bold text-white", inter.className)}>Analytics</h2>
          <p className="text-white/40 text-sm mt-0.5">Your profile performance at a glance.</p>
        </div>
        {username && (
          <a
            href={`/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-xs text-white/50 hover:text-white hover:border-white/20 transition-all self-start"
          >
            <ExternalLink size={13} /> View Profile
          </a>
        )}
      </div>

      {/* Period Toggle */}
      <div className="flex gap-1 p-1 bg-white/5 border border-white/10 rounded-xl w-fit">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all",
              period === p.key
                ? "bg-white text-black shadow-sm"
                : "text-white/40 hover:text-white"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Eye, label: "Profile Views", value: totalViews, color: "text-purple-400", bg: "bg-purple-500/10" },
          { icon: MousePointerClick, label: "Link Clicks", value: totalClicks, color: "text-blue-400", bg: "bg-blue-500/10" },
          {
            icon: TrendingUp,
            label: "Click-Through Rate",
            value: totalViews > 0 ? `${((totalClicks / totalViews) * 100).toFixed(1)}%` : "—",
            color: "text-green-400",
            bg: "bg-green-500/10",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex items-center gap-4"
          >
            <div className={cn("p-3 rounded-xl", card.bg)}>
              <card.icon size={18} className={card.color} />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{card.label}</p>
              <p className={cn("text-2xl font-black text-white mt-0.5", mono.className)}>
                {loading ? <span className="animate-pulse text-white/20">—</span> : card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Views Chart */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className={cn("text-sm font-bold text-white", inter.className)}>Profile Views</p>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5 flex items-center gap-1">
              <Clock size={10} /> {PERIODS.find((p) => p.key === period)?.label}
            </p>
          </div>
          {totalViews === 0 && !loading && (
            <p className="text-xs text-white/20">Share your profile to get views</p>
          )}
        </div>

        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <Loader2 size={20} className="animate-spin text-white/20" />
          </div>
        ) : (
          <div className="flex items-end gap-[2px] sm:gap-1 h-32">
            {buckets.map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1 group min-w-0">
                <div className="relative w-full" style={{ height: "96px" }}>
                  {/* Tooltip */}
                  {b.count > 0 && (
                    <span
                      className={cn(
                        "absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-white/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap",
                        mono.className
                      )}
                    >
                      {b.count}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center">
                    <div
                      className="w-full bg-purple-600/50 group-hover:bg-purple-500 transition-all duration-200 rounded-t min-h-[2px]"
                      style={{ height: `${Math.max((b.count / maxBucket) * 96, b.count > 0 ? 4 : 2)}px` }}
                    />
                  </div>
                </div>
                {/* Only show every Nth label to avoid crowding */}
                {(buckets.length <= 7 || i % Math.ceil(buckets.length / 7) === 0) && (
                  <span className={cn("text-[7px] sm:text-[9px] text-white/20 truncate", mono.className)}>
                    {b.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Per-link click breakdown */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className={cn("text-sm font-bold text-white", inter.className)}>Link Clicks</p>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">Breakdown by link</p>
          </div>
        </div>

        {loading ? (
          <div className="h-24 flex items-center justify-center">
            <Loader2 size={20} className="animate-spin text-white/20" />
          </div>
        ) : linkStats.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/20 text-sm">No links found — add links to see breakdown</p>
            <a href="/dashboard/links" className="text-xs text-purple-400 hover:underline mt-1 inline-block">
              Add Links →
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {linkStats.map((stat, i) => {
              const maxClicks = Math.max(...linkStats.map((s) => s.clicks), 1);
              const pct = Math.round((stat.clicks / maxClicks) * 100);
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={cn("text-[10px] text-white/20 flex-shrink-0", mono.className)}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-white font-medium truncate">{stat.title}</span>
                    </div>
                    <span className={cn("text-xs font-bold text-white/60 flex-shrink-0", mono.className)}>
                      {stat.clicks} clicks
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500/60 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
        <p className="text-xs text-white/30 leading-relaxed">
          💡 Link clicks are tracked when visitors click links on your public profile. Make sure you have added links in{" "}
          <a href="/dashboard/links" className="text-white/50 hover:underline">Links Manager →</a>
        </p>
      </div>
    </div>
  );
}
