"use client";

import { useEffect, useRef, useState } from "react";
import BackgroundEffects from "@/components/BackgroundEffects";
import { Volume2, VolumeX, Heart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { DiscordPresence } from "@/components/integrations/DiscordPresence";
import { SpotifyNowPlaying } from "@/components/integrations/SpotifyNowPlaying";
import { LiveBadge } from "@/components/ui/LiveBadge";
import { IntegrationErrorBoundary } from "@/components/integrations/IntegrationErrorBoundary";
import { CustomCursor } from "@/components/CustomCursor";

export default function ProfileWrapper({
  profile,
  children,
  integrations = [],
}: {
  profile: any;
  children: React.ReactNode;
  integrations?: any[];
}) {

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasTracked = useRef(false);
  const [mounted, setMounted] = useState(false);

  // --- STATS STATE ---
  const [likes, setLikes] = useState<number>(profile.likes_count || 0);
  const [views, setViews] = useState<number>(profile.views_count || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // 1. CHECK LOCAL STORAGE
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const localLike = localStorage.getItem(`drixe_liked_${profile.id}`);
      if (localLike) setHasLiked(true);
    }
  }, [profile.id]);

  // 2. ANALYTICS
  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;
    
    if (profile?.id) {
      setViews(v => v + 1); 
      fetch("/api/track", {
        method: "POST",
        body: JSON.stringify({
          profile_id: profile.id,
          event_type: "view",
          referrer: document.referrer || "Direct",
        }),
      });
    }
  }, [profile]);

  // 3. AUDIO PLAYER
  useEffect(() => {
    if (profile.audio_url && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [profile.audio_url]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); } 
    else { audioRef.current.play(); setIsPlaying(true); }
  };

  // 4. HANDLE LIKE
  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (hasLiked || isLiking) return; 
    setIsLiking(true);

    setLikes((prev) => prev + 1);
    setHasLiked(true);
    localStorage.setItem(`drixe_liked_${profile.id}`, "true");

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        body: JSON.stringify({ profile_id: profile.id }),
      });
      if (!res.ok && res.status !== 429) {
          setLikes((prev) => prev - 1);
          setHasLiked(false);
          localStorage.removeItem(`drixe_liked_${profile.id}`);
      }
    } catch (error) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
      localStorage.removeItem(`drixe_liked_${profile.id}`);
    }
    setIsLiking(false);
  };

  // 5. GLOBAL CLICK TRACKER
  const handleGlobalClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest("a");

    if (link && link.href) {
      const storageKey = `drixe_clicked_${profile.id}_${link.href}`;
      const alreadyClicked = localStorage.getItem(storageKey);

      if (alreadyClicked) return;

      console.log("Global Tracker: Unique Click", link.href);
      localStorage.setItem(storageKey, "true");

      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile_id: profile.id,
          event_type: "click",
          link_url: link.href,
        }),
        keepalive: true, 
      });
    }
  };

  if (!mounted) return null; 

  return (
    <div 
      onClick={handleGlobalClick}
      className="min-h-screen text-white relative selection:bg-red-500/30 overflow-x-hidden"
    >
      
      {/* LAYER 1: BACKGROUND */}
      {profile.background_url ? (
        <div className="fixed inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${profile.background_url})` }} />
      ) : (
        <div className="fixed inset-0 z-0 bg-[#050505]" />
      )}
      
      {/* LAYER 2: EFFECTS */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <BackgroundEffects type={profile.effect_type || "none"} />
      </div>

      {/* LAYER 3: AUDIO CONTROLS */}
      {profile.audio_url && (
        <>
          <audio ref={audioRef} src={profile.audio_url} loop />
          <button 
            onClick={(e) => { e.stopPropagation(); toggleAudio(); }} 
            className="fixed top-6 right-6 z-[9999] w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center hover:scale-105 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
          >
            {isPlaying ? (
               <div className="flex gap-1 items-end h-4">
                 <div className="w-1 bg-white h-full animate-[music-bar_1s_ease-in-out_infinite]" />
                 <div className="w-1 bg-white h-2/3 animate-[music-bar_1.2s_ease-in-out_infinite_0.1s]" />
                 <div className="w-1 bg-white h-1/2 animate-[music-bar_0.8s_ease-in-out_infinite_0.2s]" />
              </div>
            ) : (
              <VolumeX size={20} className="text-white/50 group-hover:text-white transition-colors" />
            )}
          </button>
        </>
      )}

      {/* LAYER 4: CURSOR (Premium) */}
      <CustomCursor cursorId={profile.cursor_id || null} />

      {/* LAYER 5: MAIN CONTENT */}
      <div className="relative z-20 min-h-[100dvh] pb-28">
        {children}

        {/* INTEGRATION WIDGETS — rendered at bottom of profile */}
        {(() => {
          const discord = integrations.find(
            (i) => i.platform === 'discord' && i.platform_user_id && i.show_on_profile
          );
          const spotify = integrations.find(
            (i) => i.platform === 'spotify' && i.show_on_profile
          );
          if (!discord && !spotify) return null;
          return (
            <div className="max-w-md mx-auto px-6 pb-8 space-y-3">
              {discord && (
                <IntegrationErrorBoundary fallbackLabel="Discord Presence">
                  <DiscordPresence
                    discordId={discord.platform_user_id}
                    accentColor={profile.accent_color}
                  />
                </IntegrationErrorBoundary>
              )}
              {spotify && (
                <IntegrationErrorBoundary fallbackLabel="Spotify">
                  <SpotifyNowPlaying username={profile.username} />
                </IntegrationErrorBoundary>
              )}
            </div>
          );
        })()}
      </div>

      {/* --- LAYER 6: FLOATING DOCK (Red Like) --- */}
      <div 
        style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2147483647,
            width: 'max-content',
            pointerEvents: 'auto',
        }}
      >
        <div className="flex items-center gap-0 p-1.5 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_-10px_rgba(0,0,0,0.8)] ring-1 ring-white/5 overflow-hidden">
          
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50 pointer-events-none" />

          {/* View Counter (Kept Blue/Neutral) */}
          <div className="flex flex-col items-center justify-center px-6 py-2 min-w-[90px] border-r border-white/10 select-none relative z-10">
             <div className="flex items-center gap-2 text-white/40 mb-1">
                <Eye size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Views</span>
             </div>
             <span className="text-xl font-mono font-bold text-white tabular-nums leading-none drop-shadow-md">
               {views.toLocaleString()}
             </span>
          </div>

          {/* Like Button (Updated to RED) */}
          <button
            onClick={handleLike}
            disabled={hasLiked}
            className={cn(
              "flex flex-col items-center justify-center px-6 py-2 min-w-[90px] rounded-xl transition-all duration-300 relative overflow-hidden group outline-none z-10",
              hasLiked 
                ? "bg-red-500/10 cursor-default" 
                : "hover:bg-red-500/10 active:scale-95 cursor-pointer"
            )}
          >
            {/* Glow Animation */}
            {!hasLiked && <div className="absolute inset-0 bg-red-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />}
            
            <div className="flex items-center gap-2 mb-1 relative z-10">
               <Heart 
                 size={14} 
                 className={cn(
                   "transition-all duration-500", 
                   hasLiked 
                     ? "fill-red-500 text-red-500 scale-110 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" 
                     : "text-white/40 group-hover:text-red-400"
                 )} 
               />
               <span className={cn(
                 "text-[10px] font-bold uppercase tracking-wider transition-colors font-sans",
                 hasLiked ? "text-red-500/80" : "text-white/40 group-hover:text-red-400"
               )}>Likes</span>
            </div>
            
            <span className={cn(
              "text-xl font-mono font-bold tabular-nums leading-none relative z-10 transition-colors drop-shadow-md",
              hasLiked ? "text-red-500" : "text-white"
            )}>
              {likes.toLocaleString()}
            </span>
          </button>

        </div>
      </div>

    </div>
  );
}