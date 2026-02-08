"use client";

import React from "react";
import { Twitter, Github, MessageSquare, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Inter_Tight,
  Cinzel_Decorative
} from "next/font/google";

const cinzel = Cinzel_Decorative({ weight: ["400", "700"], subsets: ["latin"] });
const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600"] });

export function Footer() {
  const sections = [
    {
      title: "General",
      links: ["Login", "Sign Up", "Pricing"]
    },
    {
      title: "Resources",
      links: ["Help Center", "API Docs"]
    },
    {
      title: "Contact",
      links: ["Discord", "Support"]
    },
    {
      title: "Legal",
      links: ["Terms", "Privacy"]
    }
  ];

  return (
    <footer className="relative bg-white pt-24 pb-12 border-t border-black/10 overflow-hidden">

      {/* Architectural side lines */}
      <div className="absolute left-[40px] top-0 w-px h-full bg-black/[0.05] hidden md:block" />
      <div className="absolute right-[40px] top-0 w-px h-full bg-black/[0.05] hidden md:block" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-y-16 gap-x-8 mb-24">

          {/* Brand Block */}
          <div className="col-span-2 flex flex-col gap-10 lg:pr-12">

            <img
              src="/my-logo.png"
              alt="Drixe"
              className="h-16 w-auto object-contain grayscale brightness-0"
            />

            <p
              className={cn(
                "text-[11px] text-zinc-500 leading-relaxed uppercase tracking-[0.3em] max-w-[240px]",
                cinzel.className
              )}
            >
              A living layer for digital presence.
            </p>

            <div className="flex gap-6 text-black/30">
              <Twitter size={18} className="cursor-pointer hover:text-black transition-colors" />
              <Github size={18} className="cursor-pointer hover:text-black transition-colors" />
              <MessageSquare size={18} className="cursor-pointer hover:text-black transition-colors" />
            </div>
          </div>

          {/* Link Columns */}
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-6 border-l border-black/5 pl-6">
              <h4
                className={cn(
                  "text-[11px] tracking-[0.3em] uppercase text-black/40",
                  cinzel.className
                )}
              >
                {section.title}
              </h4>

              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className={cn(
                        "text-sm text-zinc-500 hover:text-black transition-colors flex items-center gap-1 group",
                        inter.className
                      )}
                    >
                      {link}
                      <ArrowUpRight
                        size={10}
                        className="opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-0.5"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-6">

          <p
            className={cn(
              "text-[10px] tracking-[0.3em] uppercase text-zinc-400",
              inter.className
            )}
          >
            © {new Date().getFullYear()} Drixe
          </p>

          {/* Minimal Center Mark */}
          <div className="flex items-center gap-6 text-black/10 select-none">
            <span className="text-xl">†</span>
            <div className="w-12 h-px bg-current" />
            <span className="text-xl">†</span>
          </div>

        </div>

      </div>
    </footer>
  );
}
