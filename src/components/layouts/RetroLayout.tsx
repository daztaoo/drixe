"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VT323, Press_Start_2P } from "next/font/google";
import { cn } from "@/lib/utils";
import { Minimize, Maximize, X, Terminal, Cpu, Disc, Monitor, Wifi, Battery, Folder } from "lucide-react";

// --- RETRO FONTS ---
const vt323 = VT323({ weight: ["400"], subsets: ["latin"] });
const pixel = Press_Start_2P({ weight: ["400"], subsets: ["latin"] });

export default function System95Layout({ profile, links }: { profile: any, links: any[] }) {
  const [bootSequence, setBootSequence] = useState(true);
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState("");

  // --- BOOT SEQUENCE LOGIC ---
  useEffect(() => {
    const logs = [
      "BIOS DATE 01/14/95 14:23:11 VER 1.02",
      "CPU: INTEL 486DX2-66",
      "640K RAM SYSTEM... OK",
      "LOADING DRIXE_OS...",
      "MOUNTING USER_DATA...",
      "DETECTING PERIPHERALS...",
      "BOOT COMPLETE."
    ];

    let delay = 0;
    logs.forEach((log, i) => {
      delay += Math.random() * 500 + 200;
      setTimeout(() => {
        setBootLog(prev => [...prev, log]);
        if (i === logs.length - 1) {
          setTimeout(() => setBootSequence(false), 800);
        }
      }, delay);
    });

    // Clock
    const timer = setInterval(() => {
      const date = new Date();
      setCurrentTime(`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (bootSequence) {
    return (
      <div className={cn("min-h-screen bg-black text-[#00FF41] p-8 font-mono text-xl", vt323.className)}>
        <div className="max-w-2xl mx-auto space-y-2">
           <div className="mb-8 border-b-2 border-[#00FF41] pb-2 flex justify-between">
              <span>AWARD MODULAR BIOS v4.51PG</span>
              <span>ENERGY STAR ALLY</span>
           </div>
           {bootLog.map((log, i) => (
             <div key={i}>{log}</div>
           ))}
           <div className="animate-pulse mt-4">_</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-[#008080] overflow-hidden relative flex flex-col font-sans selection:bg-[#000080] selection:text-white", vt323.className)}>
      
      {/* 1. CRT SCANLINES OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.15] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      
      {/* 2. DESKTOP ICONS */}
      <div className="absolute top-4 left-4 space-y-6 z-0">
         {['My Computer', 'Recycle Bin', 'Network', 'Briefcase'].map((icon, i) => (
            <div key={i} className="flex flex-col items-center gap-1 group cursor-pointer w-24">
               <div className="w-10 h-10 border-2 border-transparent group-hover:bg-[#000080]/20 group-hover:border-dotted group-hover:border-white/50 flex items-center justify-center">
                  <Folder size={32} className="text-[#FFCC00] fill-[#FFCC00]" />
               </div>
               <span className="text-white text-lg bg-[#008080] group-hover:bg-[#000080] px-1 text-center leading-tight shadow-sm">
                 {icon}
               </span>
            </div>
         ))}
      </div>

      {/* 3. MAIN WINDOW (Centered) */}
      <div className="flex-1 flex items-center justify-center p-4 z-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-[#C0C0C0] p-1 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.5)]"
        >
          {/* Title Bar */}
          <div className="bg-[#000080] px-2 py-1 flex items-center justify-between mb-1">
             <div className="flex items-center gap-2 text-white font-bold tracking-wider">
                <Monitor size={16} />
                <span>C:\{profile.username.toUpperCase()}.EXE</span>
             </div>
             <div className="flex gap-1">
                <Button95 icon={<Minimize size={10} />} />
                <Button95 icon={<Maximize size={10} />} />
                <Button95 icon={<X size={10} />} isClose />
             </div>
          </div>

          {/* Menu Bar */}
          <div className="flex gap-4 px-2 mb-2 text-black text-lg border-b border-gray-400 pb-1">
             <span className="underline decoration-1 cursor-pointer">F</span>ile
             <span className="underline decoration-1 cursor-pointer">E</span>dit
             <span className="underline decoration-1 cursor-pointer">V</span>iew
             <span className="underline decoration-1 cursor-pointer">H</span>elp
          </div>

          {/* Window Content */}
          <div className="bg-white border-2 border-inset border-gray-400 p-4 h-[500px] overflow-y-auto custom-scrollbar relative">
             
             {/* Profile Header */}
             <div className="flex gap-4 mb-6 border-b-2 border-black pb-4">
                <div className="w-24 h-24 border-2 border-black shadow-[4px_4px_0px_#C0C0C0] p-1 bg-[#C0C0C0]">
                   {profile.avatar_url ? (
                      <img src={profile.avatar_url} className="w-full h-full object-cover grayscale contrast-125" />
                   ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white text-4xl">?</div>
                   )}
                </div>
                <div className="flex-1">
                   <h1 className={cn("text-2xl mb-1", pixel.className)}>{profile.username}</h1>
                   <div className="bg-[#000080] text-white px-2 py-1 inline-block text-lg mb-2">
                      LVL. {Math.floor(Math.random() * 99)} ADMIN
                   </div>
                   <p className="text-xl leading-tight font-bold text-gray-600">
                     {profile.description || "System user description missing..."}
                   </p>
                </div>
             </div>

             {/* Stats Row */}
             <div className="grid grid-cols-2 gap-2 mb-6 text-xl">
                <div className="bg-black text-[#00FF41] p-2 font-mono border-2 border-gray-400 inset-shadow">
                   RAM: 64MB<br/>
                   DISK: 42%
                </div>
                <div className="bg-black text-[#00FF41] p-2 font-mono border-2 border-gray-400 inset-shadow">
                   UPTIME:<br/>
                   999:59:59
                </div>
             </div>

             {/* Links (Buttons) */}
             <div className="space-y-3">
                {links.map((link, i) => (
                   <a 
                     key={link.id} 
                     href={link.url} 
                     target="_blank"
                     className="block w-full bg-[#C0C0C0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black p-2 active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:bg-gray-400 hover:bg-gray-300 transition-colors flex items-center gap-3 group"
                   >
                      <div className="w-8 h-8 bg-white border border-gray-500 flex items-center justify-center">
                         <img 
                           src={`https://www.google.com/s2/favicons?domain=${link.url}&sz=32`} 
                           alt="icon" 
                           className="w-5 h-5 grayscale group-hover:grayscale-0"
                           onError={(e) => (e.currentTarget.style.display = 'none')}
                         />
                      </div>
                      <span className="text-xl font-bold text-black group-hover:underline">{link.title}</span>
                   </a>
                ))}
             </div>

          </div>

          {/* Status Bar */}
          <div className="mt-1 border-t border-gray-400 pt-1 flex justify-between text-lg text-gray-600 px-1">
             <span>{links.length} object(s)</span>
             <span>14KB</span>
          </div>

        </motion.div>
      </div>

      {/* 4. TASKBAR */}
      <div className="h-10 bg-[#C0C0C0] border-t-2 border-white flex items-center px-1 py-1 gap-2 z-50 relative shadow-lg">
         <button className="h-full px-4 flex items-center gap-2 bg-[#C0C0C0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black font-bold active:border-t-black active:border-l-black">
            <img src="https://win98icons.alexmeub.com/icons/png/windows-0.png" className="w-5 h-5" />
            Start
         </button>
         
         <div className="w-[2px] h-6 bg-gray-400 mx-1" />
         
         <div className="flex-1" />

         <div className="h-full px-3 bg-[#C0C0C0] border-t-2 border-l-2 border-gray-500 border-b-2 border-r-2 border-white flex items-center gap-3 text-lg inset-shadow">
            <div className="flex gap-2">
               <Wifi size={14} />
               <Battery size={14} />
            </div>
            <span>{currentTime}</span>
         </div>
      </div>

    </div>
  );
}

// Helper: Classic Button
const Button95 = ({ icon, isClose }: any) => (
  <button className={cn(
    "w-5 h-5 flex items-center justify-center bg-[#C0C0C0] border-t border-l border-white border-b border-r border-black active:border-t-black active:border-l-black",
    isClose && "text-red-600"
  )}>
    {icon}
  </button>
);