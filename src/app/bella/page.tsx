"use client";
import React, { Suspense, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Stars, Sparkles, TorusKnot, Environment } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// 3D Scene: The "Floating Ribbon" and Core
function HeroScene({ isPlaying }: { isPlaying: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const bowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.2;
      meshRef.current.position.y = Math.sin(t) * 0.1;
    }
    if (bowRef.current) {
      bowRef.current.rotation.z = Math.sin(t * 0.5) * 0.2;
      bowRef.current.rotation.x = t * 0.1;
    }
  });

  return (
    <>
      <Stars radius={100} depth={50} count={isPlaying ? 4000 : 1000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={80} scale={10} size={4} speed={0.4} color="#ffb6c1" />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ff77aa" />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#ffffff" />

      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        {/* The Central Glow */}
        <Sphere ref={meshRef} args={[1, 100, 100]} scale={1.2}>
          <MeshDistortMaterial
            color={isPlaying ? "#ffb6c1" : "#444"}
            distort={0.4}
            speed={3}
            roughness={0}
            metalness={0.9}
            emissive={isPlaying ? "#ff77aa" : "#000"}
            emissiveIntensity={0.5}
          />
        </Sphere>

        {/* The "Ribbon/Bow" Symbolism - TorusKnot looks like a stylized bow */}
        <TorusKnot 
          ref={bowRef} 
          args={[0.8, 0.2, 200, 32, 2, 3]} 
          position={[0, 0, 0]} 
          rotation={[0, 0, Math.PI / 4]}
        >
          <meshPhysicalMaterial 
            color="#ff0044" 
            clearcoat={1} 
            clearcoatRoughness={0.1} 
            reflectivity={1}
            emissive="#ff0044"
            emissiveIntensity={isPlaying ? 0.8 : 0.1}
          />
        </TorusKnot>
      </Float>
      
      <Environment preset="city" />
    </>
  );
}

export default function BellaHelloKittyPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Mobile fix: force reload and play
        audioRef.current.load();
        audioRef.current.play().catch((e) => console.log("Play blocked", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <main className="relative h-screen w-screen bg-[#0a0a0a] overflow-hidden">
      {/* Aesthetic Overlays */}
      <div className={`absolute inset-0 transition-colors duration-1000 z-10 pointer-events-none ${isPlaying ? 'bg-pink-500/10' : 'bg-transparent'}`} />
      <div className="absolute inset-0 z-20 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <HeroScene isPlaying={isPlaying} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Elements */}
      <div className="relative z-30 h-full w-full flex flex-col justify-between p-8 md:p-12">
        
        {/* Header */}
        <div className="flex justify-between items-start font-mono">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/40 text-[9px] tracking-[0.5em] uppercase">
            System.Aesthetic / 2026
          </motion.div>
          <div className="bg-pink-500/20 border border-pink-500/30 px-3 py-1 rounded-full backdrop-blur-md">
            <span className="text-pink-300 text-[10px] font-bold tracking-widest uppercase">Hello Bella</span>
          </div>
        </div>

        {/* Main Title */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "circOut" }}
          >
            <h2 className="text-pink-200/50 text-xs tracking-[1em] uppercase mb-4 font-light">
              Dreaming of
            </h2>
            <h1 className="text-7xl md:text-[140px] font-black text-white leading-[0.8] tracking-tighter">
              CITY <br /> 
              <span className="text-pink-500 drop-shadow-[0_0_30px_rgba(255,0,68,0.5)]">STARS</span>
            </h1>
          </motion.div>

          <motion.button
            onClick={toggleAudio}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-12 group relative flex items-center gap-6 px-10 py-5 bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-2xl transition-all"
          >
            <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-pink-500 animate-pulse' : 'bg-white/20'}`} />
            <span className="text-xs tracking-[0.4em] uppercase text-white font-bold">
              {isPlaying ? "DONT STOP IT" : "Tap to play"}
            </span>
            {/* Minimal Audio Visualizer */}
            <div className="flex gap-1 items-end h-4">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: isPlaying ? [4, 16, 8, 14] : 4 }}
                  transition={{ repeat: Infinity, duration: 0.4 + i * 0.1 }}
                  className="w-[2px] bg-pink-500"
                />
              ))}
            </div>
          </motion.button>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-end">
          <div className="text-white/20 text-[10px] flex flex-col gap-1 uppercase tracking-tighter">
            <span>Location: CITY OF STARS</span>
            <span>Frequency: 432Hz</span>
          </div>

          <AnimatePresence>
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white px-6 py-2 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                <span className="text-black text-[10px] font-bold uppercase tracking-[0.2em]">
                  "Shining just for me"
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <audio ref={audioRef} loop playsInline preload="auto" src="/city-of-stars.mp3" />

      {/* Retro Pink Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-gradient-to-b from-transparent via-pink-500/[0.02] to-transparent bg-[length:100%_4px] opacity-20" />
    </main>
  );
}