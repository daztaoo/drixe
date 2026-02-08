"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { GothicCard } from "./cards/GothicCard";
import { RetroCard } from "./cards/RetroCard";

// Define the available modes for the showcase
const states = ["streaming", "idle", "youtube", "spotify"] as const;
type ActiveState = (typeof states)[number];

export function DemoCard() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [theme, setTheme] = useState<"gothic" | "retro">("gothic"); 
  
  // This derives the current mode from the index
  const activeState: ActiveState = states[currentIndex];

  // Manual Controls
  const nextState = () => setCurrentIndex((prev) => (prev + 1) % states.length);
  const prevState = () => setCurrentIndex((prev) => (prev - 1 + states.length) % states.length);

  // Auto Cycle every 4 seconds
  useEffect(() => {
    const interval = setInterval(nextState, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[300px] mx-auto relative z-10">
       
       {/* --- THEME TOGGLE --- */}
       <div className="mb-8 flex gap-0 bg-black border border-white/20 p-1 rounded-full z-20 shadow-2xl">
          <button 
            onClick={() => setTheme("gothic")}
            className={cn(
              "px-6 py-2 text-[10px] font-bold tracking-[0.2em] transition-all rounded-full",
              theme === "gothic" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
            )}
          >
            GOTHIC
          </button>
          <button 
            onClick={() => setTheme("retro")}
            className={cn(
              "px-6 py-2 text-[10px] font-bold tracking-[0.2em] transition-all rounded-full font-mono",
              theme === "retro" ? "bg-[#008080] text-white shadow-inner border border-white/20" : "text-white/40 hover:text-white"
            )}
          >
            RETRO
          </button>
       </div>

       {/* --- CARD WRAPPER WITH ARROWS --- */}
       <div className="relative w-full">
         
         {/* LEFT ARROW */}
         <button 
            onClick={(e) => { e.stopPropagation(); prevState(); }} 
            className="absolute top-1/2 -left-5 md:-left-16 -translate-y-1/2 z-30 p-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-sm text-white/70 hover:text-white hover:scale-110 hover:bg-black transition-all"
         >
           <ChevronLeft size={24} />
         </button>

         {/* RIGHT ARROW */}
         <button 
            onClick={(e) => { e.stopPropagation(); nextState(); }} 
            className="absolute top-1/2 -right-5 md:-right-16 -translate-y-1/2 z-30 p-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-sm text-white/70 hover:text-white hover:scale-110 hover:bg-black transition-all"
         >
           <ChevronRight size={24} />
         </button>

         {/* --- THE CARD --- */}
         <div className="w-full transition-all duration-500">
            {theme === "gothic" ? (
                // Passing the auto-cycling activeState
                <GothicCard activeState={activeState} />
            ) : (
                // Passing the same state to Retro theme
                <RetroCard activeState={activeState} />
            )}
         </div>

         {/* MODE INDICATOR (Optional - helps people see what mode it is) */}
         <div className="mt-4 text-[9px] uppercase tracking-[0.3em] text-white/20 text-center font-mono">
            Current Mode: {activeState}
         </div>

       </div>
    </div>
  );
}