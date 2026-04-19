"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { 
  User, PenTool, Link as LinkIcon, 
  Gem, LogOut, HelpCircle, LayoutTemplate,
  ChevronRight, ArrowUpRight, Plug2, BarChart2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Cinzel_Decorative, Inter_Tight } from "next/font/google";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cinzel = Cinzel_Decorative({ weight: ["700"], subsets: ["latin"] });
const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "600"] });

export default function DashboardSidebar({ user, onNavigate }: { user: any; onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  
  // State to toggle the account menu (default open)
  const [isAccountOpen, setIsAccountOpen] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 h-screen border-r border-white/10 bg-[#050505] flex flex-col fixed left-0 top-0 z-50">
      
      {/* --- BRAND --- */}
      <div className="p-8 pb-6 flex items-center justify-between">
        <h1 className={cn("text-2xl text-white tracking-widest", cinzel.className)}>Drixe</h1>
        <div className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold text-white/50 uppercase">Beta</div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar">
        
        {/* 1. Account Group (Collapsible) */}
        <div className="space-y-1">
          <button 
            onClick={() => setIsAccountOpen(!isAccountOpen)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
              pathname.startsWith("/dashboard/account") || pathname === "/dashboard" 
                ? "text-white bg-white/5" 
                : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            <div className="flex items-center gap-3">
              <User size={18} />
              <span className={cn("text-sm font-medium", inter.className)}>Account</span>
            </div>
            <ChevronRight 
              size={14} 
              className={cn("transition-transform duration-200", isAccountOpen ? "rotate-90" : "opacity-50")} 
            />
          </button>

          <AnimatePresence>
            {isAccountOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pl-4 space-y-1"
              >
                {[
                  { l: "Overview", h: "/dashboard" },
                  { l: "Analytics", h: "/dashboard/analytics" },
                  { l: "Badges", h: "/dashboard/account/badges" },
                  { l: "Settings", h: "/dashboard/settings" },
                ].map((item) => (
                  <Link
                    key={item.h}
                    href={item.h}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg text-xs transition-colors border-l-2",
                      isActive(item.h) 
                        ? "text-white border-purple-500 bg-white/5 font-bold" 
                        : "text-white/40 border-transparent hover:text-white hover:bg-white/5"
                    )}
                  >
                    {item.l}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. Main Tools */}
        <div className="space-y-1">
          <p className="px-4 text-[10px] uppercase tracking-widest text-white/20 font-bold mb-2">Tools</p>
          {[
            { label: "Customize", href: "/dashboard/customize", icon: PenTool },
            { label: "Templates", href: "/dashboard/templates", icon: LayoutTemplate },
            { label: "Links", href: "/dashboard/links", icon: LinkIcon },
            { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
            { label: "Integrations", href: "/dashboard/integrations", icon: Plug2 },
            { label: "Premium", href: "/dashboard/premium", icon: Gem },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive(item.href)
                  ? "bg-white text-black font-bold shadow-lg shadow-white/5" 
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} className={cn("transition-colors", isActive(item.href) ? "text-black" : "group-hover:text-white")} />
              <span className={cn("text-sm", inter.className)}>{item.label}</span>
            </Link>
          ))}
        </div>

      </nav>

      {/* --- BOTTOM SECTION --- */}
      <div className="p-4 space-y-2 bg-[#080808] border-t border-white/5">
        
        {/* Help Center Link */}
        <Link 
          href="/help" 
          target="_blank"
          className="flex items-center justify-between px-4 py-2 text-xs text-white/30 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <HelpCircle size={14} /> Help Center
          </div>
          <ArrowUpRight size={10} />
        </Link>

        {/* User Profile Snippet */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
          <div className="flex items-center gap-3 overflow-hidden">
            {user?.avatar_url ? (
               <img src={user.avatar_url} className="w-8 h-8 rounded-lg object-cover bg-black" />
            ) : (
               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-900 to-black flex items-center justify-center text-xs font-bold text-white border border-white/10">
                 {user?.username?.substring(0, 2).toUpperCase() || "??"}
               </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.username || "Ghost"}</p>
              <p className="text-[9px] text-white/30 truncate uppercase tracking-wide">
                {/* Logic to detect plan type later */}
                Free Plan
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

    </aside>
  );
}