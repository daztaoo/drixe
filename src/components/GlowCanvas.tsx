"use client";
import { useEffect, useRef } from "react";

export default function GlowCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = ref.current!.getContext("2d")!;
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    ctx.fillRect(0, 0, 500, 500);
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 opacity-40"
    />
  );
}
