"use client";

import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Sphere,
  Stars,
  Sparkles,
  TorusKnot,
  Environment,
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

/* =========================
   3D HERO SCENE
========================= */
function HeroScene({ isPlaying }: { isPlaying: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const bowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) meshRef.current.rotation.y = t * 0.2;
    if (bowRef.current) bowRef.current.rotation.z = Math.sin(t * 0.5) * 0.2;
  });

  return (
    <>
      <Stars
        radius={100}
        depth={50}
        count={isPlaying ? 3000 : 800}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      <Sparkles
        count={50}
        scale={10}
        size={3}
        speed={0.4}
        color="#ffb6c1"
      />

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
          <meshPhysicalMaterial
            color="#ff0044"
            emissive="#ff0044"
            emissiveIntensity={isPlaying ? 0.8 : 0.1}
          />
        </TorusKnot>
      </Float>

      <Environment preset="city" />
    </>
  );
}

/* =========================
   MAIN PAGE
========================= */
export default function BellaMobileFixedPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* 🔓 iOS AUDIO UNLOCK */
  useEffect(() => {
    const unlockAudio = () => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.play()
        .then(() => audio.pause())
        .catch(() => {});

      window.removeEventListener("touchstart", unlockAudio);
    };

    window.addEventListener("touchstart", unlockAudio);
    return () => window.removeEventListener("touchstart", unlockAudio);
  }, []);

  /* ▶️ TOGGLE AUDIO (MOBILE SAFE) */
  const toggleAudio = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlaying) {
      audio.muted = false;
      audio.volume = 1;

      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Audio blocked:", err));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <main className="fixed inset-0 bg-[#0a0a0a] overflow-hidden overscroll-none">
      
      {/* ===== 3D CANVAS ===== */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{ touchAction: "none" }}
        >
          <Suspense fallback={null}>
            <HeroScene isPlaying={isPlaying} />
          </Suspense>
        </Canvas>
      </div>

      {/* ===== UI OVERLAY ===== */}
      <div className="relative z-50 h-full w-full flex flex-col justify-between p-8 pointer-events-none">

        <div className="pointer-events-auto text-white/40 text-[9px] tracking-[0.5em] uppercase font-mono">
          Bella // 2026
        </div>

        <div className="flex flex-col items-center text-center">
          <h1 className="text-6xl md:text-[120px] font-black text-white leading-[0.8] tracking-tighter">
            CITY <br />
            <span className="text-pink-500 drop-shadow-[0_0_20px_rgba(255,0,68,0.5)]">
              STARS
            </span>
          </h1>

          <button
            onClick={toggleAudio}
            onTouchStart={toggleAudio}
            className="mt-12 pointer-events-auto flex items-center gap-6 px-10 py-5 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-3xl active:scale-95"
          >
            <div
              className={`w-3 h-3 rounded-full ${
                isPlaying ? "bg-pink-500 animate-pulse" : "bg-white/20"
              }`}
            />
            <span className="text-xs tracking-[0.4em] uppercase text-white font-bold">
              {isPlaying ? "Pause" : "Play Her Song"}
            </span>
          </button>
        </div>

        <div className="flex justify-between items-end">
          <div className="text-white/20 text-[10px] uppercase font-mono">
            Status: {isPlaying ? "Streaming" : "Ready"}
          </div>

          <AnimatePresence>
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white px-4 py-1 rounded-full text-black text-[9px] font-bold uppercase"
              >
                "Shining for you"
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ===== AUDIO ===== */}
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
