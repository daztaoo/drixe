"use client";

import { useEffect, useRef } from "react";

// Cursor names → CSS cursor values or custom image URLs
const CURSOR_DEFINITIONS: Record<string, { css?: string; emoji?: string }> = {
  default: { css: "default" },
  crosshair: { css: "crosshair" },
  pointer: { css: "pointer" },
  skull: { emoji: "💀" },
  fire: { emoji: "🔥" },
  ghost: { emoji: "👻" },
  sword: { emoji: "⚔️" },
  star: { emoji: "⭐" },
  moon: { emoji: "🌙" },
  crown: { emoji: "👑" },
};

export const CURSOR_OPTIONS = [
  { id: "default", label: "Default", preview: "↖" },
  { id: "crosshair", label: "Crosshair", preview: "✚" },
  { id: "skull", label: "Skull", preview: "💀" },
  { id: "fire", label: "Fire", preview: "🔥" },
  { id: "ghost", label: "Ghost", preview: "👻" },
  { id: "sword", label: "Sword", preview: "⚔️" },
  { id: "star", label: "Star", preview: "⭐" },
  { id: "moon", label: "Moon", preview: "🌙" },
  { id: "crown", label: "Crown", preview: "👑" },
];

interface Props {
  cursorId: string | null;
}

export function CustomCursor({ cursorId }: Props) {
  const followerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);

  const cursorDef = cursorId ? CURSOR_DEFINITIONS[cursorId] : null;
  const isEmoji = !!cursorDef?.emoji;

  useEffect(() => {
    if (!cursorId || cursorId === "default" || !isEmoji) {
      // Apply native CSS cursor to body
      if (cursorDef?.css && cursorDef.css !== "default") {
        document.body.style.cursor = cursorDef.css;
      }
      return () => { document.body.style.cursor = ""; };
    }

    // Emoji cursor — hide native cursor, show follower div
    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const animate = () => {
      if (followerRef.current) {
        followerRef.current.style.transform = `translate(${posRef.current.x + 4}px, ${posRef.current.y + 4}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.style.cursor = "";
    };
  }, [cursorId, isEmoji, cursorDef]);

  if (!cursorId || cursorId === "default" || !isEmoji) return null;

  return (
    <div
      ref={followerRef}
      className="fixed top-0 left-0 z-[99999] pointer-events-none select-none"
      style={{ willChange: "transform", fontSize: "22px", lineHeight: 1 }}
      aria-hidden
    >
      {cursorDef?.emoji}
    </div>
  );
}
