"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ShimmerButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const ShimmerButton = ({ children, onClick, disabled, className = "" }: ShimmerButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-2xl 
        gradient-cta text-white font-semibold text-base
        transition-all duration-300 shadow-[0_0_0_0_rgba(255,77,109,0)]
        hover:shadow-[0_20px_40px_-10px_rgba(255,77,109,0.5)] 
        hover:scale-[1.02] active:scale-[0.98]
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none
        group ${className}
      `}
    >
      {/* 1. TEXT CONTENT */}
      <span className="relative z-20 flex items-center gap-2 tracking-wide">
        {children}
      </span>

      {/* 2. THE DYNAMIC SHIMMER (Framer Motion) */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          repeatDelay: 2.5,
          duration: 1.2,
          ease: "easeInOut",
        }}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0) 20%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 80%,
            transparent 100%
          )`,
          skewX: "-20deg",
        }}
      />

      {/* 3. HOVER RADIAL GLOW */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
      </div>

      {/* 4. EDGE HIGHLIGHT */}
      <div className="absolute inset-[1px] rounded-[15px] border border-white/20 pointer-events-none z-10" />
    </button>
  );
};

export default ShimmerButton;