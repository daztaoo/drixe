"use client";

import React, { Suspense, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Sphere,
  Stars,
  Sparkles,
  TorusKnot,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

/* =========================
   3D HELLO KITTY CORE
========================= */
function KittyScene({ isPlaying }: { isPlaying: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const ribbonRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.3;
      coreRef.current.position.y = Math.sin(t) * 0.1;
    }
    if (ribbonRef.current) {
      ribbonRef.current.rotation.z = Math.sin(t * 0.5) * 0.5;
      ribbonRef.current.rotation.x = t * 0.2;
    }
  });

  return (
    <>
      <Stars radius={100} depth={50} count={isPlaying ? 4000 : 1000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={60} scale={10} size={3} speed={0.4} color="#ffb6c1" />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ff77aa" />

      <Float speed={3} rotationIntensity={1.5} floatIntensity={2}>
        {/* The Core */}
        <Sphere ref={coreRef} args={[1, 64, 64]} scale={1.1}>
          <MeshDistortMaterial
            color={isPlaying ? "#ffb6c1" : "#111"}
            distort={0.4}
            speed={4}
            roughness={0}
            metalness={1}
            emissive={isPlaying ? "#ff0077" : "#000"}
            emissiveIntensity={0.6}
          />
        </Sphere>

        {/* The "Bow" Symbol (TorusKnot stylized) */}
        <TorusKnot ref={ribbonRef} args={[0.9, 0.15, 200, 32, 2, 3]} position={[0, 0, 0]}>
          <meshPhysicalMaterial
            color="#ff0044"
            emissive="#ff0044"
            emissiveIntensity={isPlaying ? 1.5 : 0.2}
            clearcoat={1}
          />
        </TorusKnot>
      </Float>

      <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
      <Environment preset="night" />
    </>
  );
}

/* =========================
   MAIN PAGE
========================= */
export default function BellaFinalPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // FIXED TOGGLE: Uses pointerDown to prevent the double-trigger glitch
  const handleToggle = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.log("Play blocked", err));
    }
  };

  return (
    <main className="fixed inset-0 bg-[#050505] overflow-hidden overscroll-none touch-none select-none">
      {/* Background Noise for that High-End Look */}
      <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <KittyScene isPlaying={isPlaying} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-20 h-full w-full flex flex-col justify-between p-8 md:p-12 pointer-events-none">
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between items-start pointer-events-auto">
          <div className="font-mono text-[10px] tracking-[0.4em] text-pink-500/60 uppercase">
            Bella.System.Active
          </div>
          <div className="text-white/20 text-[10px] font-mono tracking-widest uppercase">
            {isPlaying ? "Audio: Lossless" : "Audio: Idle"}
          </div>
        </motion.div>

        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-7xl md:text-[150px] font-black text-white leading-none tracking-tighter mb-4">
              CITY OF <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-pink-400 to-pink-700 drop-shadow-[0_0_30px_rgba(255,0,119,0.4)]">
                STARS
              </span>
            </h1>
          </motion.div>

          <button
            onPointerDown={handleToggle}
            className="mt-12 pointer-events-auto group relative flex items-center gap-6 px-12 py-5 bg-white/5 border border-white/10 rounded-full backdrop-blur-3xl transition-all active:scale-90"
          >
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-pink-500 animate-ping' : 'bg-white/40'}`} />
            <span className="text-[10px] tracking-[0.5em] uppercase text-white font-bold">
              {isPlaying ? "STOP THE MAGIC" : "PLAY HER VOICE"}
            </span>
            {/* Visualizer bars */}
            <div className="flex gap-1 items-end h-3">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: isPlaying ? [4, 12, 6, 10] : 4 }}
                  transition={{ repeat: Infinity, duration: 0.5 + (i * 0.1) }}
                  className="w-[1px] bg-pink-500"
                />
              ))}
            </div>
          </button>
        </div>

        <div className="flex justify-between items-end">
          <div className="max-w-[150px] font-mono text-[8px] text-pink-500/40 uppercase tracking-widest leading-loose">
            Designed for the girl with the stars in her voice.
          </div>
          
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-auto bg-pink-500 text-white px-5 py-2 rounded-full shadow-[0_0_20px_rgba(255,0,119,0.5)]"
              >
                <span className="text-[9px] font-black uppercase tracking-widest">
                  "Shining just for me"
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <audio 
        ref={audioRef} 
        loop 
        playsInline 
        preload="auto" 
        src="/city-of-stars.mp3" 
      />
    </main>
  );
}