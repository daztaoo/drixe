"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  BarChart2, Heart, Users, MousePointer, 
  Globe, Smartphone, Lock, ArrowUpRight, Link as LinkIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";

const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "600", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false); 
  const [timeRange, setTimeRange] = useState(3);
  
  // Data State
  const [stats, setStats] = useState({
    totalViews: 0,
    totalClicks: 0,
    totalLikes: 0, // Replaces CTR
    chartData: [] as number[],
    topCountries: [] as any[],
    topReferrers: [] as any[],
    topLinks: [] as any[], // New: Track specific link clicks
    devices: [] as any[],
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Calculate Date Range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeRange);

    // 2. Fetch Data (Parallel for speed)
    const [analyticsRes, profileRes] = await Promise.all([
      // A. Fetch Tracking History
      supabase
        .from("analytics")
        .select("*")
        .eq("profile_id", user.id)
        .gte("created_at", startDate.toISOString()),
      
      // B. Fetch Current Like Count (from Profile Table)
      supabase
        .from("profiles")
        .select("likes_count")
        .eq("id", user.id)
        .single()
    ]);

    const data = analyticsRes.data || [];
    const profile = profileRes.data;

    // 3. Process Data
    const views = data.filter((e: any) => e.event_type === 'view');
    const clicks = data.filter((e: any) => e.event_type === 'click');

    // Chart Buckets
    const chartBuckets = new Array(timeRange).fill(0);
    views.forEach((v: any) => {
      const dayDiff = Math.floor((new Date().getTime() - new Date(v.created_at).getTime()) / (1000 * 3600 * 24));
      if (dayDiff < timeRange) chartBuckets[timeRange - 1 - dayDiff]++;
    });

    // Top Countries
    const countryMap: any = {};
    views.forEach((v: any) => countryMap[v.country] = (countryMap[v.country] || 0) + 1);
    const sortedCountries = Object.entries(countryMap).sort((a:any,b:any) => b[1] - a[1]).slice(0, 5);

    // Top Referrers
    const refMap: any = {};
    views.forEach((v: any) => {
      const ref = v.referrer?.replace('https://', '').replace('http://', '').split('/')[0] || 'Direct';
      refMap[ref] = (refMap[ref] || 0) + 1;
    });
    const sortedRefs = Object.entries(refMap).sort((a:any,b:any) => b[1] - a[1]).slice(0, 5);

    // Top Clicked Links (New Logic)
    const linkMap: any = {};
    clicks.forEach((c: any) => {
      // Use full URL as key
      const url = c.link_url || "Unknown";
      linkMap[url] = (linkMap[url] || 0) + 1;
    });
    const sortedLinks = Object.entries(linkMap).sort((a:any,b:any) => b[1] - a[1]).slice(0, 5);

    // Devices
    const devMap: any = {};
    views.forEach((v: any) => devMap[v.device_type] = (devMap[v.device_type] || 0) + 1);
    const sortedDevs = Object.entries(devMap).sort((a:any,b:any) => b[1] - a[1]);

    setStats({
      totalViews: views.length,
      totalClicks: clicks.length,
      totalLikes: profile?.likes_count || 0, // Use the profile count
      chartData: chartBuckets,
      topCountries: sortedCountries,
      topReferrers: sortedRefs,
      topLinks: sortedLinks,
      devices: sortedDevs
    });

    setLoading(false);
  };

  const handleRangeChange = (days: number) => {
    if (days > 3 && !isPremium) return; 
    setTimeRange(days);
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-12">
      
      {/* Header & Time Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className={cn("text-3xl font-bold", inter.className)}>Analytics</h2>
          <p className="text-white/40 mt-1">Real-time data insights.</p>
        </div>

        {/* Time Selector */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-lg p-1 flex gap-1">
          {[3, 7, 14, 30].map((day) => (
            <button
              key={day}
              onClick={() => handleRangeChange(day)}
              className={cn(
                "px-3 py-1.5 rounded text-xs font-bold transition-all relative",
                timeRange === day ? "bg-white text-black" : "text-white/40 hover:text-white"
              )}
            >
              {day} Days
              {day > 3 && !isPremium && (
                <Lock size={10} className="absolute -top-1 -right-1 text-purple-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Total Views", v: stats.totalViews, i: Users, c: "text-purple-400", bg: "bg-purple-500/10" },
          { l: "Link Clicks", v: stats.totalClicks, i: MousePointer, c: "text-blue-400", bg: "bg-blue-500/10" },
          // Replaced CTR with Total Likes
          { l: "Total Likes", v: stats.totalLikes, i: Heart, c: "text-red-400", bg: "bg-red-500/10" },
          { l: "Avg. Daily", v: Math.round(stats.totalViews / timeRange), i: BarChart2, c: "text-pink-400", bg: "bg-pink-500/10" },
        ].map((s) => (
          <div key={s.l} className="p-5 bg-[#0A0A0A] border border-white/5 rounded-xl flex items-center justify-between group hover:border-white/10 transition-all">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{s.l}</p>
              <p className={cn("text-2xl font-black text-white mt-1", mono.className)}>
                {loading ? "..." : s.v.toLocaleString()}
              </p>
            </div>
            <div className={cn("p-2 rounded-lg transition-transform group-hover:scale-110", s.bg, s.c)}>
              <s.i size={20} className={s.l === "Total Likes" ? "fill-current" : ""} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="w-full h-80 bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
           <div className="flex items-center gap-2">
             <BarChart2 size={16} className="text-white/40" />
             <p className={cn("text-sm font-bold text-white/60", inter.className)}>Activity Trend</p>
           </div>
           {timeRange > 3 && !isPremium && (
             <span className="text-xs text-purple-400 font-bold flex items-center gap-2 px-3 py-1 bg-purple-500/10 rounded-full">
               <Lock size={12}/> Premium Data Locked
             </span>
           )}
        </div>
        
        <div className="flex-1 flex items-end gap-2">
           {stats.chartData.length > 0 ? stats.chartData.map((val, i) => {
             const max = Math.max(...stats.chartData) || 1;
             const height = (val / max) * 100;
             return (
               <div key={i} className="flex-1 h-full flex flex-col justify-end group">
                  <div 
                    className="w-full bg-white/5 rounded-t-sm group-hover:bg-purple-500 transition-all duration-500 relative"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {val} Views
                    </div>
                  </div>
               </div>
             )
           }) : (
             <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">No data recorded yet</div>
           )}
        </div>
        <div className="h-px bg-white/5 w-full mt-1" />
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* 1. Top Links (NEW) */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white/80 mb-4 flex items-center gap-2">
            <LinkIcon size={16} /> Top Clicked Links
          </h3>
          <div className="space-y-3">
            {stats.topLinks.length > 0 ? stats.topLinks.map(([url, count]: any) => (
              <div key={url} className="flex items-center justify-between group">
                <div className="flex items-center gap-2 overflow-hidden">
                   {/* Try to show favicon */}
                   <img 
                     src={`https://www.google.com/s2/favicons?domain=${url}&sz=32`}
                     className="w-4 h-4 rounded-sm opacity-50 grayscale group-hover:grayscale-0"
                     onError={(e) => (e.currentTarget.style.display = 'none')}
                   />
                   <span className="text-xs text-white/50 truncate max-w-[120px]" title={url}>
                     {url.replace(/^https?:\/\/(www\.)?/, '')}
                   </span>
                </div>
                <span className="text-xs font-bold text-white bg-white/5 px-2 py-0.5 rounded">{count}</span>
              </div>
            )) : <p className="text-xs text-white/20 italic">No clicks yet.</p>}
          </div>
        </div>

        {/* 2. Top Countries */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white/80 mb-4 flex items-center gap-2">
            <Globe size={16} /> Top Locations
          </h3>
          <div className="space-y-3">
            {stats.topCountries.length > 0 ? stats.topCountries.map(([country, count]: any) => (
              <div key={country} className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <img 
                    src={`https://flagcdn.com/24x18/${country.toLowerCase()}.png`} 
                    alt={country} 
                    className="w-4 h-3 rounded-sm opacity-70 grayscale group-hover:grayscale-0 transition-all"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                  <span className="text-xs text-white/50">{country === "Unknown" ? "Hidden IP" : country}</span>
                </div>
                <span className="text-xs font-bold text-white">{count}</span>
              </div>
            )) : <p className="text-xs text-white/20 italic">No location data yet.</p>}
          </div>
        </div>

        {/* 3. Top Referrers */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white/80 mb-4 flex items-center gap-2">
            <ArrowUpRight size={16} /> Traffic Sources
          </h3>
          <div className="space-y-3">
            {stats.topReferrers.length > 0 ? stats.topReferrers.map(([ref, count]: any) => (
              <div key={ref} className="flex items-center justify-between">
                <span className="text-xs text-white/50 truncate max-w-[150px]">{ref}</span>
                <span className="text-xs font-bold text-white bg-white/5 px-2 py-0.5 rounded">{count}</span>
              </div>
            )) : <p className="text-xs text-white/20 italic">No referral data yet.</p>}
          </div>
        </div>

         {/* 4. Visitor Devices */}
         <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white/80 mb-4 flex items-center gap-2">
            <Smartphone size={16} /> Devices
          </h3>
          <div className="space-y-3">
            {stats.devices.length > 0 ? stats.devices.map(([dev, count]: any) => (
              <div key={dev} className="flex items-center justify-between">
                <span className="text-xs text-white/50 capitalize">{dev}</span>
                <div className="flex items-center gap-3 w-1/2 justify-end">
                  <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(count / stats.totalViews) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold">{count}</span>
                </div>
              </div>
            )) : <p className="text-xs text-white/20 italic">No device data yet.</p>}
          </div>
        </div>

      </div>

    </div>
  );
}