"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function BackgroundEffects({ type }: { type: string }) {
  if (type === "none") return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {type === "snow" && <SnowEffect />}
      {type === "rain" && <RainEffect />}
    </div>
  );
}

const SnowEffect = () => {
  // Create 50 snowflakes with random positions
  const flakes = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 3 + 2}s`,
    opacity: Math.random(),
  }));

  return (
    <>
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute top-[-10px] w-1 h-1 bg-white rounded-full animate-fall"
          style={{
            left: flake.left,
            animationDuration: flake.animationDuration,
            opacity: flake.opacity,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fall {
          to { transform: translateY(100vh); }
        }
        .animate-fall { animation: fall linear infinite; }
      `}</style>
    </>
  );
};

const RainEffect = () => {
  const drops = Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 0.5 + 0.5}s`,
    animationDelay: `${Math.random() * 2}s`
  }));

  return (
    <>
      {drops.map((drop) => (
        <div
          key={drop.id}
          className="absolute top-[-20px] w-[1px] h-10 bg-blue-400/50 animate-rain"
          style={{
            left: drop.left,
            animationDuration: drop.animationDuration,
            animationDelay: drop.animationDelay
          }}
        />
      ))}
      <style jsx>{`
        @keyframes rain {
          to { transform: translateY(105vh); }
        }
        .animate-rain { animation: rain linear infinite; }
      `}</style>
    </>
  );
};