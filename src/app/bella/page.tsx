"use client";
import React, { Suspense, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Stars, Sparkles, TorusKnot, Environment } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

function HeroScene({ isPlaying }: { isPlaying: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const bowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.2;
    }
    if (bowRef.current) {
      bowRef.current.rotation.z = Math.sin(t * 0.5) * 0.2;
    }
  });

  return (
    <>
      <Stars radius={100} depth={50} count={isPlaying ? 3000 : 800} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={50} scale={10} size={3} speed={0.4} color="#ffb6c1" />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ff77aa" />
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.2}>
          <MeshDistortMaterial
            color={isPlaying ? "#ffb6c1" : "#222"}
            distort={0.4}
            speed={3}
            roughness={0}
            metalness={0.9}
            emissive={isPlaying ? "#ff77aa" : "#000"}
            emissiveIntensity={0.5}
          />
        </Sphere>
        <TorusKnot ref={bowRef} args={[0.8, 0.2, 128, 32, 2, 3]}>
          <meshPhysicalMaterial color="#ff0044" emissive="#ff0044" emissiveIntensity={isPlaying ? 0.8 : 0.1} />
        </TorusKnot>
      </Float>
      <Environment preset="city" />
    </>
  );
}

export default function BellaMobileFixedPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to ensure the touch is handled only by our logic
    e.stopPropagation();
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // MOBILE CRITICAL: The play() call must be direct from the event
        audioRef.current.play().catch((err) => {
          console.error("Playback failed:", err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <main className="fixed inset-0 bg-[#0a0a0a] overflow-hidden overscroll-none touch-none">
      {/* 3D Canvas - Added touch-action none */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{ touchAction: 'none' }} 
        >
          <Suspense fallback={null}>
            <HeroScene isPlaying={isPlaying} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay - Using pointer-events-none on parent, auto on child */}
      <div className="relative z-50 h-full w-full flex flex-col justify-between p-8 pointer-events-none">
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="text-white/40 text-[9px] tracking-[0.5em] uppercase font-mono">
Bella // 2026
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <h1 className="text-6xl md:text-[120px] font-black text-white leading-[0.8] tracking-tighter pointer-events-none">
            CITY <br /> 
            <span className="text-pink-500 drop-shadow-[0_0_20px_rgba(255,0,68,0.5)]">STARS</span>
          </h1>

          <button
            onPointerDown={toggleAudio} // Using onPointerDown for faster mobile response
            className="mt-12 pointer-events-auto group relative flex items-center gap-6 px-10 py-5 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-3xl transition-transform active:scale-95"
          >
            <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-pink-500 animate-pulse' : 'bg-white/20'}`} />
            <span className="text-xs tracking-[0.4em] uppercase text-white font-bold">
              {isPlaying ? "Pause" : "Play Her Song"}
            </span>
          </button>
        </div>

        <div className="flex justify-between items-end pointer-events-none">
          <div className="text-white/20 text-[10px] uppercase tracking-tighter font-mono">
            Status: {isPlaying ? "Streaming" : "Ready"}
          </div>
          <AnimatePresence>
            {isPlaying && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-auto bg-white px-4 py-1 rounded-full text-black text-[9px] font-bold uppercase">
                "Shining for you"
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Audio with strict attributes */}
      <audio 
        ref={audioRef} 
        loop 
        playsInline 
        webkit-playsinline="true" 
        preload="auto" 
        src="/city-of-stars.mp3" 
      />
    </main>
  );
}