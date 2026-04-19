"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { router.push("/auth"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (!profile) { router.push("/onboarding"); return; }

      setUser(profile);
      setLoading(false);
    };
    checkUser();
  }, [router]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ── MOBILE TOPBAR ─────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] h-14 bg-[#080808] border-b border-white/5 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <span className="text-sm font-bold text-white tracking-widest" style={{ fontFamily: "var(--font-cinzel)" }}>
          DRIXE
        </span>
        {/* Avatar chip */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-900 to-black flex items-center justify-center text-xs font-bold text-white border border-white/10">
          {user?.username?.substring(0, 2).toUpperCase() || "??"}
        </div>
      </div>

      {/* ── MOBILE BACKDROP ───────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR (desktop: fixed, mobile: slide-in) ────────── */}
      {/* Desktop sidebar — always visible */}
      <div className="hidden lg:block">
        <DashboardSidebar user={user} />
      </div>

      {/* Mobile sidebar — slide from left */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="lg:hidden fixed top-0 left-0 bottom-0 z-[80] w-72"
          >
            {/* Close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-3 right-3 z-10 p-2 text-white/30 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
            <DashboardSidebar user={user} onNavigate={() => setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <main className="
        lg:ml-64
        pt-14 lg:pt-0
        min-h-screen
        overflow-x-hidden
      ">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-12 space-y-8">
          {children}
        </div>
      </main>

    </div>
  );
}

