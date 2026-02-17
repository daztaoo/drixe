"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Zen_Old_Mincho, Montserrat, Cormorant_Garamond } from "next/font/google";
import clsx from "clsx";

// --- FONTS ---
const zen = Zen_Old_Mincho({ subsets: ["latin"], weight: ["400", "700", "900"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "600"], style: ["italic", "normal"] });

type Phase = 'locked' | 'idle' | 'charging' | 'imploding' | 'aftermath';

export default function LuaBirthdayPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>('locked');
  const controls = useAnimation(); 

  // --- PHYSICS ENGINE ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // --- PETALS ---
    const petalCount = width < 768 ? 400 : 800;
    const petals: { x: number; y: number; z: number; rotation: number; size: number }[] = [];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * width,
        rotation: Math.random() * 360,
        size: Math.random() * 3 + 2
      });
    }

    let animationId: number;
    let speed = 0.5;
    
    const render = () => {
      // Clear Logic
      ctx.fillStyle = (phase === 'charging') ? "rgba(20, 5, 10, 0.2)" : (phase === 'aftermath' ? "rgba(255, 240, 245, 0.2)" : "rgba(5, 5, 10, 1)");
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Speed Logic
      if (phase === 'charging') speed += (80 - speed) * 0.05;
      else if (phase === 'imploding') speed = -40; 
      else if (phase === 'aftermath') speed = 2;
      else if (phase === 'locked') speed = 0.2;
      else speed += (0.5 - speed) * 0.1;

      // Draw Petals
      petals.forEach((p) => {
        p.z -= speed;
        p.rotation += 2;

        if (p.z <= 0) { p.z = width; p.x = Math.random() * width - width / 2; p.y = Math.random() * height - height / 2; }
        else if (p.z > width) { p.z = 0; p.x = Math.random() * width - width / 2; p.y = Math.random() * height - height / 2; }

        const k = 128.0 / p.z;
        const px = p.x * k + cx;
        const py = p.y * k + cy;

        if (px >= -50 && px <= width + 50 && py >= -50 && py <= height + 50) {
           const scale = (1 - p.z / width);
           ctx.save();
           ctx.translate(px, py);
           ctx.rotate((p.rotation * Math.PI) / 180);
           
           if (phase === 'charging') ctx.scale(4, 0.1); // Warp

           ctx.beginPath();
           ctx.ellipse(0, 0, p.size * scale * 3, p.size * scale * 2, 0, 0, Math.PI * 2);
           
           if (phase === 'aftermath') ctx.fillStyle = `rgba(255, 105, 180, ${scale})`;
           else if (phase === 'charging') ctx.fillStyle = Math.random() > 0.5 ? "cyan" : "red";
           else ctx.fillStyle = `rgba(255, 192, 203, ${scale * 0.5})`;
           
           ctx.fill();
           ctx.restore();
        }
      });

      animationId = requestAnimationFrame(render);
    };
    render();

    return () => { cancelAnimationFrame(animationId); window.removeEventListener("resize", resize); };
  }, [phase]);

  // --- SHAKE CONTROLS ---
  useEffect(() => {
    if (phase === 'charging') {
      controls.start({
        x: [0, -10, 10, -5, 5, 0],
        y: [0, -10, 10, -5, 5, 0],
        rotate: [0, -2, 2, -1, 1, 0],
        filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"],
        transition: { duration: 0.1, repeat: Infinity }
      });
    } else {
      controls.stop();
      controls.set({ x: 0, y: 0, rotate: 0, filter: "hue-rotate(0deg)" });
    }
  }, [phase, controls]);

  // --- INTERACTIONS ---
  const handleTap = () => {
      if (phase === 'locked') setPhase('idle');
  };

  const startCharging = () => { if(phase === 'idle') setPhase('charging'); }
  const release = async () => {
      if(phase !== 'charging') return;
      setPhase('imploding');
      await new Promise(r => setTimeout(r, 800)); // Suck in duration
      setPhase('aftermath');
  }

  return (
    <motion.main 
      animate={controls}
      className={clsx(
        "relative h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center text-white touch-none select-none",
        phase === 'aftermath' ? "bg-[#fff0f5]" : "bg-[#050202]"
      )}
      onMouseDown={startCharging}
      onMouseUp={release}
      onTouchStart={startCharging}
      onTouchEnd={release}
    >
      
      {/* BACKGROUND CANVAS */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none pb-20 md:pb-0">
        
        {/* --- MOON --- */}
        <motion.div
           animate={{
             scale: phase === 'charging' ? 0.8 : phase === 'imploding' ? 0 : phase === 'aftermath' ? 6 : 1,
             background: phase === 'aftermath' 
                ? "radial-gradient(circle, #fff, #ffc0cb 20%, #ff69b4 60%, #8b0000 100%)" // Pink Supermoon
                : "radial-gradient(circle at 30% 30%, #fff, #e2e8f0 15%, #64748b 50%, #0f172a 100%)", // Normal Moon
             filter: phase === 'charging' ? "blur(5px) brightness(2) drop-shadow(0 0 20px cyan)" : "blur(0px)",
             opacity: phase === 'locked' ? 0.2 : 1
           }}
           transition={{ duration: phase === 'aftermath' ? 3 : 0.5 }}
           className="relative w-48 h-48 md:w-80 md:h-80 rounded-full mb-8 z-0"
        />

        {/* --- TORII GATE SILHOUETTE (Visible after unlock) --- */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: (phase !== 'locked' && phase !== 'aftermath') ? 1 : 0, y: 0 }}
            transition={{ duration: 1 }}
            className="absolute bottom-0 w-[80%] max-w-[600px] h-[50vh] z-10 flex items-end justify-center opacity-80"
        >
            {/* SVG Torii for clean lines */}
            <svg viewBox="0 0 300 250" className="w-full h-full drop-shadow-2xl">
                <path fill="#080404" d="M40,240 h20 v-160 h-20 z M240,240 h20 v-160 h-20 z" /> {/* Pillars */}
                <path fill="#080404" d="M20,60 q130,30 260,0 v20 q-130,30 -260,0 z" /> {/* Top Bar */}
                <path fill="#080404" d="M50,90 h200 v15 h-200 z" /> {/* Lower Bar */}
                <path fill="#080404" d="M145,90 h10 v40 h-10 z" /> {/* Plaque */}
            </svg>
        </motion.div>

        {/* --- MESSAGES --- */}
        <div className="z-20 text-center px-6">
            <AnimatePresence mode="wait">
                {phase === 'locked' && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                        <p className={`${montserrat.className} text-xs text-white/50 tracking-[0.4em] uppercase`}>The Sanctuary</p>
                    </motion.div>
                )}

                {phase === 'idle' && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                        <p className={`${montserrat.className} text-xs tracking-[0.3em] text-cyan-100/70 uppercase animate-pulse`}>
                            Hold to Make a Wish
                        </p>
                    </motion.div>
                )}

                {phase === 'charging' && (
                    <motion.h1 
                        initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                        className={`${zen.className} text-6xl md:text-9xl font-black text-red-500 mix-blend-screen`}
                    >
                        願 願 願
                    </motion.h1>
                )}

                {phase === 'aftermath' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 1, duration: 1.5 }}
                        className="mix-blend-multiply text-red-900"
                    >
                        <p className={`${zen.className} text-3xl font-black opacity-40 mb-2`}>お誕生日おめでとう</p>
                        <h2 className={`${montserrat.className} text-sm uppercase tracking-[0.5em] font-bold text-pink-700 mb-2`}>Feliz Aniversário</h2>
                        <h1 className={`${cormorant.className} text-8xl md:text-[10rem] leading-none font-bold text-transparent bg-clip-text bg-gradient-to-b from-red-600 to-pink-900`}>LUA</h1>
                        <motion.div initial={{width:0}} animate={{width:100}} transition={{delay:2, duration:1}} className="h-1 bg-red-500 mx-auto my-6" />
                        <p className={`${cormorant.className} text-2xl md:text-4xl font-medium italic`}>"You are the brightest and the best moon. May All your wishes and dreams come true"</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

      </div>

      {/* --- DOORS (The Opener) --- */}
      <div className="absolute inset-0 pointer-events-none z-30 flex">
          <motion.div 
             animate={{ x: phase === 'locked' ? 0 : "-100%" }}
             transition={{ duration: 1.5, ease: "easeInOut" }}
             className="w-1/2 h-full bg-[#1a1515] border-r-4 border-[#000] flex items-center justify-end relative shadow-2xl"
          >
             <div className="absolute inset-0 border-[10px] border-[#000] opacity-50" /> {/* Frame */}
             <div className="w-full h-full flex flex-col justify-evenly opacity-30"><div className="w-full h-2 bg-black"/><div className="w-full h-2 bg-black"/><div className="w-full h-2 bg-black"/></div>
          </motion.div>

          <motion.div 
             animate={{ x: phase === 'locked' ? 0 : "100%" }}
             transition={{ duration: 1.5, ease: "easeInOut" }}
             className="w-1/2 h-full bg-[#1a1515] border-l-4 border-[#000] flex items-center justify-start relative shadow-2xl"
          >
             <div className="absolute inset-0 border-[10px] border-[#000] opacity-50" /> {/* Frame */}
             <div className="w-full h-full flex flex-col justify-evenly opacity-30"><div className="w-full h-2 bg-black"/><div className="w-full h-2 bg-black"/><div className="w-full h-2 bg-black"/></div>
          </motion.div>
      </div>

      {/* --- BUTTONS --- */}
      <div className="absolute bottom-12 z-40 pointer-events-auto cursor-pointer">
         {phase === 'locked' ? (
             <motion.button 
                onClick={handleTap}
                whileTap={{ scale: 0.9 }}
                className="px-8 py-4 bg-[#8a1c1c] text-white font-bold tracking-widest uppercase text-xs rounded-full border-2 border-[#5c1010] shadow-[0_0_30px_rgba(138,28,28,0.6)]"
             >
                Open Gates
             </motion.button>
         ) : (phase !== 'aftermath' && phase !== 'imploding') && (
             <motion.button
                animate={{ scale: phase === 'charging' ? [1, 1.1, 1] : 1 }}
                transition={{ repeat: Infinity, duration: 0.2 }}
                className={clsx(
                    "px-8 py-4 rounded-full border backdrop-blur-md text-xs font-bold uppercase tracking-widest transition-all duration-300",
                    phase === 'charging' ? "bg-red-500/80 border-red-500 text-white shadow-[0_0_50px_red]" : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                )}
             >
                {phase === 'charging' ? "DON'T LET GO" : "HOLD TO WISH"}
             </motion.button>
         )}
      </div>

      {/* --- FLASHBANG --- */}
      <AnimatePresence>
        {phase === 'aftermath' && (
           <motion.div 
             initial={{ opacity: 1 }}
             animate={{ opacity: 0 }}
             transition={{ duration: 3 }}
             className="absolute inset-0 bg-[#ff69b4] z-50 pointer-events-none mix-blend-overlay"
           />
        )}
      </AnimatePresence>

    </motion.main>
  );
}