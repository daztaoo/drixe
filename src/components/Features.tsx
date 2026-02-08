"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity, Music, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Grenze_Gotisch,
  Inter_Tight,
  Cinzel_Decorative,
  UnifrakturMaguntia,
  JetBrains_Mono
} from "next/font/google";

const goth = Grenze_Gotisch({ weight: ["400", "700", "900"], subsets: ["latin"] });
const blackletter = UnifrakturMaguntia({ weight: ["400"], subsets: ["latin"] });
const cinzel = Cinzel_Decorative({ weight: ["400", "700"], subsets: ["latin"] });
const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "500"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

export function Features() {
  const features = [
    {
      index: "I",
      icon: <Activity size={18} strokeWidth={1.4} />,
      title: "Living Presence",
      desc: "Your profile updates automatically when you listen, game, or go live — reflecting your activity in real time.",
    },
    {
      index: "II",
      icon: <Music size={18} strokeWidth={1.4} />,
      title: "Atmospheric Audio",
      desc: "When music plays, your page transforms. Backgrounds shift and visuals respond to your current track.",
    },
    {
      index: "III",
      icon: <EyeOff size={18} strokeWidth={1.4} />,
      title: "Quiet Control",
      desc: "Hide your activity instantly. You decide when to appear — and when to disappear.",
    },
  ];

  return (
    <section className="relative bg-white py-20 md:py-28 border-t border-black/5 overflow-hidden">

      {/* Vertical architectural rules */}
      <div className="absolute left-[40px] top-0 w-px h-full bg-black/[0.05] hidden md:block" />
      <div className="absolute right-[40px] top-0 w-px h-full bg-black/[0.05] hidden md:block" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">

        {/* Header */}
        <div className="mb-16 md:mb-20 max-w-2xl">
          <h2
            className={cn(
              "text-5xl md:text-6xl leading-[0.85] tracking-tight mb-4",
              blackletter.className
            )}
          >
            The Form
            <br />
            <span className="text-zinc-300">of Presence.</span>
          </h2>

          <p
            className={cn(
              "text-base md:text-lg text-zinc-600 border-l border-black pl-6 leading-relaxed",
              inter.className
            )}
          >
            Drixe responds to what you’re doing — shaping your profile into a living reflection of your activity.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-14 border-t border-black pt-12">

          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="group flex flex-col"
            >
              {/* Roman numeral — now architectural, not decorative */}
              <div
                className={cn(
                  "text-xs tracking-[0.5em] text-black/30 mb-6",
                  mono.className
                )}
              >
                {f.index}
              </div>

              {/* Icon */}
              <div className="mb-4 text-black group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>

              {/* Title — ornamental gothic */}
              <h3
                className={cn(
                  "text-2xl tracking-tight mb-3",
                  goth.className
                )}
              >
                {f.title}
              </h3>

              {/* Description — clean readable contrast */}
              <p
                className={cn(
                  "text-sm text-zinc-600 leading-relaxed",
                  inter.className
                )}
              >
                {f.desc}
              </p>

              {/* Structured underline */}
              <div className="mt-6 h-px w-16 bg-black/20 group-hover:w-24 transition-all duration-300" />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
