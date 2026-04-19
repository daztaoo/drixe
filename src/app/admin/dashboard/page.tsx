"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Users, BarChart3, Award, Crown, Search, LogOut, Check,
  X, ChevronDown, ChevronUp, Loader2, RefreshCw, Eye, Trash2,
  ShieldCheck, ShieldOff, Activity
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

const ALL_BADGES = [
  { id: "og", label: "OG", color: "#f59e0b" },
  { id: "premium", label: "Premium", color: "#a855f7" },
  { id: "verified", label: "Verified", color: "#3b82f6" },
  { id: "bug_hunter", label: "Bug Hunter", color: "#ef4444" },
  { id: "staff", label: "Staff", color: "#22c55e" },
  { id: "donor", label: "Donor", color: "#06b6d4" },
];

interface AdminUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  is_premium: boolean;
  plan: string;
  views_count: number;
  likes_count: number;
  created_at: string;
  badges: string[];
}

// ── Auth guard: check session cookie ──
async function checkAuth() {
  const res = await fetch("/api/admin/verify");
  return res.ok;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filtered, setFiltered] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, premium: 0, views: 0, links: 0 });
  const [saving, setSaving] = useState<string | null>(null);

  // Auth gate
  useEffect(() => {
    checkAuth().then((ok) => {
      if (!ok) { router.push("/admin"); return; }
      setAuthed(true);
      loadData();
    });
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch all profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, email, full_name, is_premium, plan, views_count, likes_count, created_at")
        .order("created_at", { ascending: false });

      // Fetch all badges
      const { data: badgeRows } = await supabase
        .from("user_badges")
        .select("user_id, badge_id");

      // Fetch link count
      const { count: linkCount } = await supabase
        .from("links")
        .select("id", { count: "exact", head: true });

      const badgeMap: Record<string, string[]> = {};
      (badgeRows || []).forEach((b: any) => {
        if (!badgeMap[b.user_id]) badgeMap[b.user_id] = [];
        badgeMap[b.user_id].push(b.badge_id);
      });

      const enriched: AdminUser[] = (profiles || []).map((p: any) => ({
        ...p,
        badges: badgeMap[p.id] || [],
      }));

      setUsers(enriched);
      setFiltered(enriched);
      setStats({
        total: enriched.length,
        premium: enriched.filter((u) => u.is_premium).length,
        views: enriched.reduce((acc, u) => acc + (u.views_count || 0), 0),
        links: linkCount || 0,
      });
    } catch (e) {
      toast.error("Failed to load data");
    }
    setLoading(false);
  };

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter((u) =>
      u.username?.includes(q) || u.email?.includes(q) || u.full_name?.toLowerCase().includes(q)
    ));
  }, [search, users]);

  const togglePremium = async (userId: string, current: boolean) => {
    setSaving(userId);
    const { error } = await supabase
      .from("profiles")
      .update({ is_premium: !current, plan: !current ? "premium" : "free" })
      .eq("id", userId);

    if (error) { toast.error("Failed to update premium"); }
    else {
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, is_premium: !current, plan: !current ? "premium" : "free" } : u));
      toast.success(current ? "Premium revoked" : "Premium granted");
    }
    setSaving(null);
  };

  const toggleBadge = async (userId: string, badgeId: string, hasBadge: boolean) => {
    setSaving(`${userId}-${badgeId}`);
    if (hasBadge) {
      const { error } = await supabase.from("user_badges").delete().eq("user_id", userId).eq("badge_id", badgeId);
      if (!error) setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, badges: u.badges.filter((b) => b !== badgeId) } : u));
    } else {
      const { error } = await supabase.from("user_badges").insert({ user_id: userId, badge_id: badgeId });
      if (!error) setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, badges: [...u.badges, badgeId] } : u));
    }
    setSaving(null);
  };

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin");
  };

  if (authed === null || loading) return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
        <p className="text-white/30 text-xs">Loading admin panel...</p>
      </div>
    </div>
  );

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)", backgroundSize: "50px 50px" }}
      />
      <div className="fixed top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />

      {/* Top Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-[#030303]/90 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 bg-red-500/20 border border-red-500/30 rounded-lg">
            <ShieldCheck size={14} className="text-red-400" />
          </div>
          <span className={cn("text-sm font-black text-white uppercase tracking-widest", inter.className)}>Drixe Admin</span>
          <span className="px-2 py-0.5 text-[9px] text-red-400/70 border border-red-500/20 rounded uppercase tracking-widest">Internal</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="p-2 text-white/30 hover:text-white transition-colors">
            <RefreshCw size={14} />
          </button>
          <button onClick={logout} className="flex items-center gap-2 px-3 py-1.5 text-white/40 hover:text-white border border-white/10 hover:border-white/20 rounded-lg text-xs transition-all">
            <LogOut size={12} /> Logout
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: stats.total, icon: Users, color: "#6366f1" },
            { label: "Premium", value: stats.premium, icon: Crown, color: "#a855f7" },
            { label: "Total Views", value: stats.views.toLocaleString(), icon: Eye, color: "#22c55e" },
            { label: "Total Links", value: stats.links, icon: Activity, color: "#f59e0b" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative bg-[#0a0a0a] border border-white/[0.07] rounded-2xl p-5 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 blur-3xl rounded-full opacity-20 pointer-events-none"
                style={{ background: s.color }} />
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] text-white/40 uppercase tracking-widest">{s.label}</p>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: s.color + "20" }}>
                  <s.icon size={13} style={{ color: s.color }} />
                </div>
              </div>
              <p className={cn("text-3xl font-black text-white", mono.className)}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* USER TABLE */}
        <div className="bg-[#0a0a0a] border border-white/[0.07] rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Users size={14} className="text-white/40" />
              <p className={cn("text-sm font-bold text-white", inter.className)}>Users</p>
              <span className="text-[10px] text-white/30 ml-1">({filtered.length})</span>
            </div>
            <div className="flex items-center gap-2 bg-[#111] border border-white/10 rounded-xl px-3 py-2">
              <Search size={12} className="text-white/30" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="bg-transparent text-xs text-white placeholder:text-white/20 outline-none w-40"
              />
            </div>
          </div>

          {/* Column labels */}
          <div className="grid grid-cols-12 px-5 py-2.5 border-b border-white/[0.04] text-[9px] text-white/25 uppercase tracking-widest">
            <div className="col-span-3">User</div>
            <div className="col-span-2">Plan</div>
            <div className="col-span-2">Stats</div>
            <div className="col-span-3">Badges</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/[0.04] max-h-[600px] overflow-y-auto">
            {filtered.map((user) => (
              <div key={user.id}>
                {/* Row */}
                <div
                  className="grid grid-cols-12 items-center px-5 py-4 hover:bg-white/[0.015] cursor-pointer transition-colors"
                  onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                >
                  {/* User info */}
                  <div className="col-span-3 flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-xs font-black text-white/60">
                      {user.username?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">@{user.username}</p>
                      <p className="text-[9px] text-white/30 truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Plan */}
                  <div className="col-span-2">
                    <span className={cn("px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-lg",
                      user.is_premium ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-white/5 text-white/30 border border-white/5"
                    )}>
                      {user.plan || "free"}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="col-span-2">
                    <p className={cn("text-xs text-white/50", mono.className)}>
                      {user.views_count || 0}v · {user.likes_count || 0}♥
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="col-span-3 flex gap-1 flex-wrap">
                    {user.badges.length === 0 && <span className="text-[9px] text-white/20">None</span>}
                    {user.badges.map((b) => {
                      const badge = ALL_BADGES.find((ab) => ab.id === b);
                      return badge ? (
                        <span key={b} className="px-1.5 py-0.5 text-[8px] font-bold rounded" style={{ color: badge.color, background: badge.color + "20", border: `1px solid ${badge.color}30` }}>
                          {badge.label}
                        </span>
                      ) : null;
                    })}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); togglePremium(user.id, user.is_premium); }}
                      disabled={saving === user.id}
                      className={cn("p-1.5 rounded-lg transition-all",
                        user.is_premium ? "text-purple-400 hover:bg-purple-500/10" : "text-white/20 hover:text-white hover:bg-white/5"
                      )}
                      title={user.is_premium ? "Revoke premium" : "Grant premium"}
                    >
                      {saving === user.id ? <Loader2 size={12} className="animate-spin" /> : <Crown size={13} />}
                    </button>
                    <a
                      href={`/${user.username}`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                      title="View profile"
                    >
                      <Eye size={13} />
                    </a>
                    {expandedUser === user.id ? <ChevronUp size={13} className="text-white/30" /> : <ChevronDown size={13} className="text-white/20" />}
                  </div>
                </div>

                {/* Expanded badge manager */}
                {expandedUser === user.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/[0.02] border-t border-white/[0.05] px-5 py-4"
                  >
                    <p className="text-[9px] text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Award size={11} /> Badge Management — {user.full_name || user.username}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {ALL_BADGES.map((badge) => {
                        const has = user.badges.includes(badge.id);
                        const savingThis = saving === `${user.id}-${badge.id}`;
                        return (
                          <button
                            key={badge.id}
                            onClick={() => toggleBadge(user.id, badge.id, has)}
                            disabled={savingThis}
                            className={cn("flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all",
                              has ? "text-white" : "text-white/30 border-white/10 hover:border-white/20"
                            )}
                            style={has ? { color: badge.color, background: badge.color + "15", borderColor: badge.color + "40" } : undefined}
                          >
                            {savingThis ? <Loader2 size={10} className="animate-spin" /> : has ? <Check size={10} /> : <X size={10} />}
                            {badge.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-white/[0.05]">
                      <p className="text-[9px] text-white/20 flex-1">
                        Member since {new Date(user.created_at).toLocaleDateString()} · ID: {user.id.slice(0, 8)}...
                      </p>
                      <button
                        onClick={() => togglePremium(user.id, user.is_premium)}
                        className={cn("flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-all",
                          user.is_premium
                            ? "text-purple-300 bg-purple-500/10 border-purple-500/30 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/30"
                            : "text-white/50 bg-white/5 border-white/10 hover:bg-purple-500/15 hover:text-purple-300 hover:border-purple-500/30"
                        )}
                      >
                        {user.is_premium ? <><ShieldOff size={10} /> Revoke Premium</> : <><Crown size={10} /> Grant Premium</>}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="py-16 text-center text-white/20 text-sm">No users found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
