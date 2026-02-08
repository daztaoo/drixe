"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight, Activity, Plus, Sword, Skull } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Grenze_Gotisch,
  Inter_Tight,
  JetBrains_Mono,
  UnifrakturMaguntia,
} from "next/font/google";
import { TiltWrapper } from "@/components/TiltWrapper";
import { DemoCard } from "@/components/DemoCard";

const goth = Grenze_Gotisch({ weight: ["400", "700", "900"], subsets: ["latin"] });
const blackletter = UnifrakturMaguntia({ weight: ["400"], subsets: ["latin"] });
const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "600", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

export function Hero() {
  const { scrollY } = useScroll();

  const yMain = useTransform(scrollY, [0, 800], [0, -120]);
  const ySword = useTransform(scrollY, [0, 1000], [0, -150]);
  const ySkull = useTransform(scrollY, [0, 1000], [0, -200]);

  return (
    <section className="relative min-h-[85vh] pt-28 md:pt-32 flex items-center overflow-hidden bg-white px-6 md:px-10">

      {/* ===== ARCHITECTURAL BACKGROUND ===== */}
      <div className="absolute inset-0 pointer-events-none select-none">

        {/* Radial light source */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.06),transparent_60%)]" />

        

        {/* Vertical frame lines */}
        <div className="absolute left-[40px] top-0 w-px h-full bg-black/[0.06]" />
        <div className="absolute right-[40px] top-0 w-px h-full bg-black/[0.06]" />

        {/* Floating Elements (Controlled) */}
        <motion.div
          style={{ y: ySword }}
          className="absolute top-[18%] right-[10%] text-black/[0.025] hidden xl:block"
        >
          <Sword size={240} strokeWidth={0.4} />
        </motion.div>

        <motion.div
          style={{ y: ySkull }}
          className="absolute bottom-[12%] left-[8%] text-black/[0.025] hidden xl:block"
        >
          <Skull size={180} strokeWidth={0.4} />
        </motion.div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="max-w-[1300px] mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative z-20">

        {/* LEFT */}
        <div className="flex flex-col">

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <Activity size={14} className="animate-pulse" />
            <span
              className={cn(
                "text-[10px] font-black tracking-[0.5em] uppercase",
                mono.className
              )}
            >
              LIVE PRESENCE
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={cn(
              "text-5xl sm:text-6xl md:text-7xl lg:text-[88px] leading-[0.85]",
              blackletter.className
            )}
          >
            Not a Bio.
            <span className="block text-zinc-300 pt-2">
              A Signal.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={cn(
              "mt-5 text-base md:text-lg text-zinc-600 max-w-md",
              inter.className
            )}
          >
            Real-time identity powered by Spotify, Discord, and live activity.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 space-y-6"
          >
            <div className="w-full max-w-sm">
              <div className="flex items-center border-b-2 border-black pb-2">
                <span className={cn("text-zinc-300 text-lg", goth.className)}>
                  drixe.lol/
                </span>
                <input
                  type="text"
                  placeholder="username"
                  className={cn(
                    "w-full px-2 outline-none bg-transparent text-2xl placeholder:text-zinc-200",
                    goth.className
                  )}
                />
                <button className="hover:scale-110 transition">
                  <ChevronRight size={30} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-8 flex-wrap">
              <button
                className={cn(
                  "text-[11px] font-black tracking-[0.4em] hover:opacity-60 transition flex items-center gap-2",
                  mono.className
                )}
              >
                <Plus size={14} /> SIGN UP FREE
              </button>

              <button
                className={cn(
                  "text-[11px] font-black tracking-[0.4em] text-zinc-400 hover:text-black transition",
                  mono.className
                )}
              >
                VIEW PRICING
              </button>
            </div>
          </motion.div>
        </div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex justify-center lg:justify-end mt-12 lg:mt-0 relative"
        >
          <div className="relative w-full max-w-[300px] md:max-w-[340px]">

            {/* Decorative rings */}
            <div className="absolute -inset-10 border border-black/[0.04] rounded-full hidden md:block" />
            <div className="absolute -inset-20 border border-black/[0.02] rounded-full hidden md:block" />

            <TiltWrapper>
              <DemoCard />
            </TiltWrapper>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
