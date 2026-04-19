"use client";

import { motion } from "framer-motion";
import { 
  UnifrakturMaguntia, 
  Cinzel_Decorative, 
  Inter_Tight, 
  JetBrains_Mono 
} from "next/font/google";
import { ExternalLink, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

// --- IMPORT LAYOUTS ---
import ProfileWrapper from "@/components/layouts/ProfileWrapper";
import GothicLayout from "@/components/layouts/GothicLayout";
import RetroLayout from "@/components/layouts/RetroLayout";
import MinimalLayout from "@/components/layouts/MinimalLayout";
import CyberpunkLayout from "@/components/layouts/CyberpunkLayout";


// --- FONTS ---
const blackletter = UnifrakturMaguntia({ weight: ["400"], subsets: ["latin"] });
const cinzel = Cinzel_Decorative({ weight: ["700"], subsets: ["latin"] });
const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "600"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

// --- DEFAULT LAYOUT (Glassmorphism) ---
// This is your original design, now serving as the 'Modern' or 'Default' option.
const DefaultLayout = ({ profile, links, integrations = [] }: { profile: any; links: any[]; integrations?: any[] }) => {
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLinkClick = (url: string) => {
    fetch("/api/track", {
      method: "POST",
      body: JSON.stringify({
        profile_id: profile.id,
        event_type: "click",
        link_url: url,
      }),
    });
  };

  const accentColor = profile.accent_color || "#ffffff";
  const textColor = profile.text_color || "#ffffff";

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col p-6 relative z-20 justify-center">
      <div 
        className="rounded-3xl p-8 border transition-all duration-500 shadow-2xl"
        style={{
          backgroundColor: `rgba(0,0,0, ${profile.profile_opacity ? profile.profile_opacity / 100 : 0})`,
          backdropFilter: `blur(${profile.profile_blur || 0}px)`,
          borderColor: accentColor ? `${accentColor}33` : 'rgba(255,255,255,0.1)',
          boxShadow: `0 0 40px -10px ${accentColor}20`
        }}
      >
        {/* HEADER */}
        <header className="text-center space-y-6 mb-8">
          <div className="relative inline-block group">
             <div 
               className="absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-all duration-700" 
               style={{ backgroundColor: accentColor }}
             />
             <div className="w-28 h-28 rounded-full border-2 bg-black overflow-hidden relative z-10 mx-auto transition-colors duration-500"
                  style={{ borderColor: `${accentColor}40` }}>
               {profile.avatar_url ? (
                 <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white/20">
                   {profile.username[0].toUpperCase()}
                 </div>
               )}
             </div>
          </div>

          <div className="space-y-2">
            <h1 
              className={cn("text-4xl leading-tight drop-shadow-lg", blackletter.className)}
              style={{ color: textColor }}
            >
              {profile.full_name || profile.username}
            </h1>
            
            <div className="flex items-center justify-center gap-2">
              <span className={cn("text-sm uppercase tracking-widest opacity-60", mono.className)} style={{ color: textColor }}>
                @{profile.username}
              </span>
              <button onClick={copyUrl} className="opacity-40 hover:opacity-100 transition-opacity" style={{ color: textColor }}>
                {copied ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          {(profile.description || profile.bio) && (
            <p className={cn("text-sm max-w-xs mx-auto leading-relaxed opacity-80 whitespace-pre-wrap", inter.className)} style={{ color: textColor }}>
              {profile.description || profile.bio}
            </p>
          )}
        </header>

        {/* LINKS */}
        <main className="space-y-3">
          {links.length > 0 ? (
            links.map((link, i) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link.url)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="block group relative"
              >
                <div 
                  className="absolute inset-0 translate-y-1 translate-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" 
                  style={{ backgroundColor: accentColor }}
                />
                <div 
                  className="relative border p-4 flex items-center justify-between group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform duration-200 rounded-lg bg-black/40 backdrop-blur-sm"
                  style={{ borderColor: `${accentColor}40` }}
                >
                  <span className={cn("font-bold text-sm tracking-wide", inter.className)} style={{ color: textColor }}>
                    {link.title}
                  </span>
                  <ExternalLink size={16} style={{ color: accentColor }} />
                </div>
              </motion.a>
            ))
          ) : (
            <div className="text-center py-8 border border-dashed rounded-lg" style={{ borderColor: `${textColor}20` }}>
              <p className={cn("text-xs uppercase tracking-widest opacity-30", mono.className)} style={{ color: textColor }}>
                No signals detected
              </p>
            </div>
          )}
        </main>

        <footer className="mt-8 pt-6 border-t flex flex-col items-center gap-2 text-center" style={{ borderColor: `${textColor}10` }}>
          <a href="/" className={cn("text-xl hover:opacity-100 transition-opacity opacity-30", blackletter.className)} style={{ color: textColor }}>
            Drixe
          </a>
        </footer>
      </div>
    </div>
  );
};


// --- MAIN ROUTER COMPONENT ---
export default function PublicProfileView({
  profile,
  links,
  integrations = [],
}: {
  profile: any;
  links: any[];
  integrations?: any[];
}) {
  const isLive = integrations.some((i: any) => i.is_live && i.is_enabled);

  if (profile.layout_id === "gothic") {
    return (
      <ProfileWrapper profile={profile} integrations={integrations}>
        <GothicLayout profile={profile} links={links} integrations={integrations} isLive={isLive} />
      </ProfileWrapper>
    );
  }

  let ActiveLayout: any = DefaultLayout;
  if (profile.layout_id === "retro") ActiveLayout = RetroLayout;
  else if (profile.layout_id === "minimal") ActiveLayout = MinimalLayout;
  else if (profile.layout_id === "cyberpunk") ActiveLayout = CyberpunkLayout;

  return (
    <ProfileWrapper profile={profile} integrations={integrations}>
      <ActiveLayout profile={profile} links={links} integrations={integrations} />
    </ProfileWrapper>
  );
}