"use client";

import React from "react";
import { Minimize, Maximize, X, Terminal, Disc, Cpu, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { VT323 } from "next/font/google";

const retro = VT323({ weight: ["400"], subsets: ["latin"] });

type RetroState = "idle" | "spotify" | "gaming" | "streaming" | "youtube";

export function RetroCard({ activeState }: { activeState: RetroState }) {
  return (
    <div className={cn(
      "relative aspect-[9/16] bg-[#E6D5AC] p-1 flex flex-col select-none overflow-hidden border-2 border-[#8B7D5B] shadow-[10px_10px_0px_#4A4232]",
      retro.className
    )}>
      
      {/* --- CRT SCANLINE OVERLAY --- */}
      <div className="absolute inset-0 pointer-events-none z-[100] opacity-[0.08] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      
      {/* --- AGED PLASTIC BEVEL --- */}
      <div className="absolute inset-0 border-t-[3px] border-l-[3px] border-[#FFF9E6] border-b-[3px] border-r-[3px] border-[#8B7D5B] pointer-events-none z-50"></div>

      {/* --- TITLE BAR (Classic IBM Blue) --- */}
      <div className="bg-[#0000AA] h-8 flex items-center justify-between px-2 mb-1 z-10 border-b-2 border-black">
         <div className="flex items-center gap-2 text-[#E6D5AC]">
            <Monitor size={16} fill="currentColor" />
            <span className="text-2xl tracking-[0.1em] pt-1">C:\ARIHANT\PROFILE.EXE</span>
         </div>
         <div className="flex gap-1">
            <div className="w-5 h-5 bg-[#E6D5AC] border border-black flex items-center justify-center shadow-[1px_1px_0px_black]"><Minimize size={12} className="text-black"/></div>
            <div className="w-5 h-5 bg-[#E6D5AC] border border-black flex items-center justify-center shadow-[1px_1px_0px_black]"><X size={12} className="text-black"/></div>
         </div>
      </div>

      {/* --- MAIN DISPLAY (The Green Screen) --- */}
      <div className="flex-1 bg-[#1A1A1A] border-[4px] border-[#8B7D5B] m-1 p-4 flex flex-col relative shadow-[inset_0_0_20px_black]">
        
        {/* AVATAR BOX (Low Res Feel) */}
        <div className="flex flex-col items-center mb-6">
           <div className="relative border-2 border-[#00FF41] p-1 bg-black group">
              <img 
                src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix" 
                className="w-24 h-24 grayscale brightness-125 contrast-150" 
              />
              <div className="absolute inset-0 bg-[#00FF41]/10 pointer-events-none"></div>
           </div>
           <h1 className="text-5xl text-[#00FF41] mt-2 tracking-tighter drop-shadow-[0_0_5px_rgba(0,255,65,0.5)]">
              ARIHANT_V1.0
           </h1>
           <div className="text-[#FFB800] text-xl uppercase tracking-widest"> SYSTEM ARCHITECT</div>
        </div>

        {/* TERMINAL OUTPUT AREA */}
        <div className="flex-1 font-mono text-[#00FF41] space-y-3 overflow-hidden text-lg">
           <div className="flex items-center gap-2 border-b border-[#00FF41]/20 pb-1">
              <Terminal size={14} />
              <span className="text-[#FFB800]">CURRENT_TASK:</span>
           </div>

           <div className="min-h-[100px] bg-black/40 p-2 border border-[#00FF41]/10">
              {activeState === 'idle' && (
                 <div className="animate-pulse">_IDLE_STATE: Awaiting command...</div>
              )}

              {activeState === 'spotify' && (
                 <div className="space-y-1">
                    <div className="text-[#00FF41] flex items-center gap-2">
                       <Disc className="animate-spin" size={14} />
                       PLAYING: BAND4BAND
                    </div>
                    <div className="text-zinc-500">ARTIST: CENTRAL CEE</div>
                    <div className="w-full bg-zinc-900 h-4 border border-[#00FF41]/30 mt-2 relative">
                       <div className="absolute top-0 left-0 h-full w-[75%] bg-[#00FF41]"></div>
                    </div>
                 </div>
              )}

              {activeState === 'gaming' && (
                 <div className="space-y-1">
                    <div className="text-rose-500 flex items-center gap-2">
                       <Cpu size={14} className="animate-pulse" />
                       WAR_MODE: VALORANT
                    </div>
                    <div className="text-zinc-500 italic">ALLOCATING RESOURCES...</div>
                    <div className="text-xs text-rose-800">TEMP: 72°C | GPU: 98%</div>
                 </div>
              )}

              {activeState === 'streaming' && (
                 <div className="space-y-1">
                    <div className="text-purple-400">BROADCASTING_LIVE</div>
                    <div className="flex gap-1">
                       {[1, 2, 3, 4, 5, 6].map(i => (
                          <div key={i} className="w-2 h-4 bg-purple-900 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                       ))}
                    </div>
                 </div>
              )}

              {activeState === 'youtube' && (
                 <div className="space-y-1">
                    <div className="text-red-500 italic"> STREAM_DECODING</div>
                    <div className="text-[#00FF41]">EPISODE: ONE_PIECE_1116</div>
                 </div>
              )}
           </div>
        </div>

        {/* SYSTEM BUTTONS (Industrial Style) */}
        <div className="grid grid-cols-2 gap-2 mt-4">
            {["INIT_GIT", "LINK_TWIT", "EXEC_MAIL", "OPEN_WEB"].map(btn => (
               <button 
                key={btn} 
                className="bg-[#8B7D5B] border-t-2 border-l-2 border-[#E6D5AC] border-b-2 border-r-2 border-black text-xl text-black hover:bg-[#E6D5AC] transition-colors py-1 active:shadow-inner"
               >
                  {btn}
               </button>
            ))}
        </div>

      </div>

      {/* --- FOOTER INFO --- */}
      <div className="px-2 py-1 flex justify-between items-center bg-[#E6D5AC] text-xs text-black font-bold uppercase">
         <span>RAM: 640KB OK</span>
         <span className="animate-pulse">● LIVE</span>
      </div>
    </div>
  );
}