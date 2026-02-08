"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Inter_Tight,
  Cinzel_Decorative
} from "next/font/google";

const cinzel = Cinzel_Decorative({ weight: ["400", "700"], subsets: ["latin"] });
const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "600", "800"] });

const GothicLink = ({ text, href }: { text: string; href: string }) => {
  return (
    <a href={href} className="relative group px-4 py-2">
      <span
        className={cn(
          "block text-sm tracking-[0.2em] transition-all duration-500",
          "text-zinc-500 group-hover:text-black group-hover:tracking-[0.35em]",
          cinzel.className
        )}
      >
        {text}
      </span>

      {/* Subtle underline */}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-black transition-all duration-300 group-hover:w-3/4 opacity-10" />
    </a>
  );
};

export function DesktopNavbar() {
  return (
    <nav className="hidden md:block fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-black/[0.04]">

      {/* Architectural side lines */}
      <div className="absolute left-[40px] top-0 w-px h-full bg-black/[0.05]" />
      <div className="absolute right-[40px] top-0 w-px h-full bg-black/[0.05]" />

      <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between relative z-10">

        {/* LEFT — PNG LOGO ONLY */}
        <div className="w-60 flex items-center">
          <img
            src="/my-logo.png"
            alt="Drixe"
            className="h-12 w-auto object-contain grayscale brightness-0 hover:opacity-80 transition-opacity"
          />
        </div>

        {/* CENTER — LINKS */}
        <div className="flex items-center gap-4">
          {["Discord", "Features", "Pricing", "FAQ"].map((item) => (
            <GothicLink key={item} text={item.toUpperCase()} href={`#${item.toLowerCase()}`} />
          ))}
        </div>

     {/* RIGHT — ACTIONS */}
<div className="w-60 flex items-center justify-end gap-10">

  {/* Login — quiet but intentional */}
  <a
    href="#"
    className={cn(
      "relative text-[11px] tracking-[0.35em] uppercase text-zinc-500 hover:text-black transition-colors",
      inter.className
    )}
  >
    Login
    <span className="absolute left-0 -bottom-1 h-px w-0 bg-black transition-all duration-300 group-hover:w-full" />
  </a>

  {/* Join Beta — refined minimal button */}
  <button
    className={cn(
      "px-6 py-2 border border-black text-[11px] tracking-[0.35em] uppercase transition-all duration-300",
      "hover:bg-black hover:text-white",
      inter.className
    )}
  >
    Join Beta
  </button>

</div>


      </div>
    </nav>
  );
}
