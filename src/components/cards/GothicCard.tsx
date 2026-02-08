"use client";

import React from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Music, Gamepad2, Skull, 
  Github, Twitter, Link2, Globe, Sword,
  Youtube, Radio
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UnifrakturMaguntia, Cinzel_Decorative, JetBrains_Mono } from "next/font/google";

// --- FONTS ---
const blackletter = UnifrakturMaguntia({ weight: ["400"], subsets: ["latin"] });
const cinzel = Cinzel_Decorative({ weight: ["400", "700", "900"], subsets: ["latin"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

type CardState = "idle" | "spotify" | "gaming" | "streaming" | "youtube";

export function GothicCard({ activeState }: { activeState: CardState }) {
  
  // --- 3D TILT LOGIC ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  // --- CONTENT MAPPING ---
  const stateConfig = {
    idle: {
      label: "Dormant",
      title: "AWAITING SUMMONS",
      subtitle: "",
      icon: <Skull size={20} />,
      color: "text-zinc-600 border-zinc-700",
      glow: "shadow-[0_0_20px_rgba(255,255,255,0.05)]",
      bg: ""
    },
    spotify: {
      label: "Ritual",
      title: "BAND4BAND",
      subtitle: "Central Cee",
      icon: <Music size={16} />,
      color: "text-emerald-500 border-emerald-900/50",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]",
      bg: "https://images.genius.com/086111f930e16374f1b5394142f99580.1000x1000x1"
    },
    gaming: {
      label: "Conflict",
      title: "Valorant",
      subtitle: "Ranked • 24m",
      icon: <Gamepad2 size={16} />,
      color: "text-rose-500 border-rose-900/50",
      glow: "shadow-[0_0_20px_rgba(244,63,94,0.2)]",
      bg: "https://wallpapers.com/images/hd/valorant-poster-art-wdh21s1h2042w131.jpg"
    },
    streaming: {
      label: "Manifest",
      title: "Live on Twitch",
      subtitle: "Coding & Chaos",
      icon: <Radio size={16} />,
      color: "text-purple-500 border-purple-900/50",
      glow: "shadow-[0_0_20px_rgba(168,85,247,0.2)]",
      bg: "https://img.freepik.com/premium-photo/dark-purple-background-with-black-vignette-purple-neon-light_1130634-11883.jpg"
    },
    youtube: {
      label: "Observer",
      title: "One Piece 1116",
      subtitle: "Watching Now",
      icon: <Youtube size={16} />,
      color: "text-red-500 border-red-900/50",
      glow: "shadow-[0_0_20px_rgba(239,68,68,0.2)]",
      bg: "https://i.ytimg.com/vi/W_6DkU5H-lU/maxresdefault.jpg"
    }
  };

  const current = stateConfig[activeState];

  return (
    <motion.div 
      className="relative w-full aspect-[9/16] perspective-1000"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full h-full bg-[#050505] rounded-t-[100px] rounded-b-[20px] shadow-2xl border border-white/10 group"
      >
        
        {/* --- 1. BASE TEXTURE --- */}
        <div className="absolute inset-0 rounded-t-[100px] rounded-b-[20px] overflow-hidden pointer-events-none">
           <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(50,50,50,0.1),rgba(0,0,0,1))]"></div>
        </div>

        {/* --- 2. DECORATIVE ARCH --- */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-20" style={{ transform: "translateZ(20px)" }}>
           <path d="M 10,100 L 10,50 Q 50% 0 95%,50 L 95%,100" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
           <path d="M 10,95 L 20,95 M 80,95 L 90,95" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        </svg>

        {/* --- 3. DYNAMIC BACKGROUND --- */}
        <div className="absolute inset-4 rounded-t-[90px] rounded-b-[10px] overflow-hidden z-10 border border-white/5 bg-black/50">
           <AnimatePresence mode="wait">
             <motion.div 
               key={activeState}
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0"
             >
                {current.bg && <img src={current.bg} className="w-full h-full object-cover opacity-40 grayscale" alt="" />}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/80"></div>
             </motion.div>
           </AnimatePresence>
        </div>

        {/* --- 4. FLOATING CONTENT --- */}
        <div className="relative z-30 h-full flex flex-col pt-16 pb-6 px-6 text-zinc-300" style={{ transform: "translateZ(40px)" }}>
          
          {/* HEADER */}
          <div className="flex flex-col items-center">
             <motion.div 
               className={cn(
                 "p-3 rounded-full border bg-black/80 shadow-2xl backdrop-blur-sm transition-all duration-500",
                 current.color,
                 current.glow
               )}
               animate={activeState !== 'idle' ? { y: [0, -5, 0] } : {}}
               transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
             >
                <Skull size={20} />
             </motion.div>
             <div className={cn("mt-3 text-[10px] uppercase tracking-[0.4em] text-zinc-500", cinzel.className)}>
                {current.label}
             </div>
          </div>

          {/* AVATAR CAGE */}
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
             <div className="relative w-32 h-32 group/avatar">
                <div className="absolute inset-0 border-2 border-dashed border-zinc-700 rounded-full animate-[spin_30s_linear_infinite]"></div>
                <div className="absolute -inset-2 border border-zinc-800 rounded-full"></div>
                <img 
                  src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" 
                  className="w-full h-full rounded-full bg-black border-4 border-zinc-900 grayscale contrast-125 relative z-10 transition-all duration-500 group-hover/avatar:grayscale-0"
                />
             </div>
             
             <div className="text-center">
                <h2 className={cn("text-6xl text-white drop-shadow-lg", blackletter.className)}>arihant</h2>
                <div className="flex items-center justify-center gap-2 text-zinc-600 mt-1">
                   <div className="h-[1px] w-8 bg-zinc-800"></div>
                   <Sword size={10} className="rotate-45" />
                   <div className="h-[1px] w-8 bg-zinc-800"></div>
                </div>
             </div>
          </div>

          {/* WIDGETS */}
          <div className="space-y-4" style={{ transform: "translateZ(20px)" }}>
             
             <div className="relative h-14 bg-zinc-900/80 border border-white/5 rounded-sm flex items-center px-4 gap-4 overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)] animate-[shine_3s_infinite]"></div>
                
                <AnimatePresence mode="wait">
                   <motion.div 
                     key={activeState}
                     initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                     className="flex items-center gap-4 w-full"
                   >
                     {activeState !== 'idle' ? (
                       <>
                        <div className={cn("p-2 rounded-sm bg-black/50 border border-white/5", current.color)}>
                           {current.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className={cn("text-lg leading-none text-zinc-200 truncate", blackletter.className)}>
                              {current.title}
                           </div>
                           <div className={cn("text-[9px] text-zinc-500 uppercase tracking-widest truncate", mono.className)}>
                              {current.subtitle}
                           </div>
                        </div>
                       </>
                     ) : (
                       <div className="w-full text-center text-xs text-zinc-600 tracking-[0.2em] font-bold">
                          {current.title}
                       </div>
                     )}
                   </motion.div>
                </AnimatePresence>
             </div>

             {/* Links */}
             <div className="grid grid-cols-4 gap-2">
                {[<Github key="g"/>, <Twitter key="t"/>, <Globe key="w"/>, <Link2 key="l"/>].map((icon, i) => (
                   <div key={i} className="aspect-square bg-zinc-900/50 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer">
                      {React.cloneElement(icon as any, { size: 16 })}
                   </div>
                ))}
             </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}