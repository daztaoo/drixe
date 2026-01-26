"use client";
import React, { Suspense, useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Stars, Sparkles, Float as DreiFloat } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// 3D Scene with Mouse Parallax
function HeroScene({ isPlaying }: { isPlaying: boolean }) {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      // Subtle mouse tracking
      const x = (state.mouse.x * 0.5);
      const y = (state.mouse.y * 0.5);
      sphereRef.current.position.x = THREE.MathUtils.lerp(sphereRef.current.position.x, x, 0.1);
      sphereRef.current.position.y = THREE.MathUtils.lerp(sphereRef.current.position.y, y, 0.1);
    }
  });

  return (
    <>
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={100} scale={10} size={2} speed={0.5} color="#ffb6c1" />
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ff007f" />
      
      <DreiFloat speed={isPlaying ? 6 : 2} rotationIntensity={2} floatIntensity={2}>
        <Sphere ref={sphereRef} args={[1, 128, 128]} scale={1.8}>
          <MeshDistortMaterial
            color="#ff4d94"
            attach="material"
            distort={isPlaying ? 0.5 : 0.2} 
            speed={isPlaying ? 4 : 1}
            roughness={0.1}
            metalness={0.8}
            emissive="#ff007f"
            emissiveIntensity={0.2}
          />
        </Sphere>
      </DreiFloat>
    </>
  );
}

export default function BellaUltraPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <main className="relative h-screen w-screen bg-[#050103] overflow-hidden selection:bg-pink-500/30">
      {/* High-End Noise Overlay */}
      <div className="absolute inset-0 z-[10] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Deep Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-900/20 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[150px] rounded-full" />

      {/* 3D Engine */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Suspense fallback={null}>
            <HeroScene isPlaying={isPlaying} />
          </Suspense>
        </Canvas>
      </div>

      {/* Interface */}
      <div className="relative z-20 h-full w-full flex flex-col justify-between p-10 md:p-20">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="text-[10px] tracking-[0.4em] text-pink-500 font-bold uppercase">Personal Archive</span>
            <span className="text-pink-100/50 text-xs">2026 // 001</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="text-right"
          >
            <span className="text-[10px] tracking-[0.4em] text-pink-100 font-light uppercase">For Bella</span>
          </motion.div>
        </div>

        {/* Centerpiece */}
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-[120px] font-extralight text-white leading-none tracking-tighter italic">
              City of <br />
              <span className="font-bold text-pink-400 drop-shadow-[0_0_40px_rgba(255,77,148,0.4)]">Stars</span>
            </h1>
            
            <div className="mt-12 flex flex-col items-center gap-6">
               <motion.button
                onClick={toggleAudio}
                whileHover={{ scale: 1.05 }}
                className="group relative flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-full overflow-hidden transition-all backdrop-blur-xl"
              >
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-pink-500 animate-ping' : 'bg-white/40'}`} />
                <span className="text-[10px] tracking-[0.3em] uppercase text-white font-medium">
                  {isPlaying ? "Stop the stars" : "Begin Experience"}
                </span>
                {/* Visualizer bars */}
                <div className="flex gap-1 h-3 items-end">
                    {[1,2,3].map((i) => (
                        <motion.div 
                            key={i}
                            animate={{ height: isPlaying ? [4, 12, 6, 10] : 4 }}
                            transition={{ repeat: Infinity, duration: 0.5 + (i * 0.1) }}
                            className="w-[1px] bg-pink-400"
                        />
                    ))}
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end">
          <div className="max-w-[200px]">
            <p className="text-[10px] leading-relaxed text-pink-100/30 uppercase tracking-widest">
              A tribute to a voice that sounds like home.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <AnimatePresence>
                {isPlaying && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-pink-400 text-xs italic"
                    >
                        "Are you shining just for me?"
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <audio ref={audioRef} loop src="/city-of-stars.mp3" />
    </main>
  );
}