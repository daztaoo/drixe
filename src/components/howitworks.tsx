"use client";

import React from "react";
import { motion } from "framer-motion";
import { Link, Settings, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Grenze_Gotisch,
  Inter_Tight,
  JetBrains_Mono,
  UnifrakturMaguntia,
  Cinzel_Decorative,
} from "next/font/google";

const goth = Grenze_Gotisch({ weight: ["400", "700"], subsets: ["latin"] });
const blackletter = UnifrakturMaguntia({ weight: ["400"], subsets: ["latin"] });
const cinzel = Cinzel_Decorative({ weight: ["400", "700"], subsets: ["latin"] });
const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

export function HowItWorks() {
  const steps = [
    {
      number: "I",
      icon: <Link size={18} strokeWidth={1.2} />,
      title: "Connect",
      desc: "Link Discord and Spotify to enable live reactions — or skip this step and use Drixe as a static page.",
    },
    {
      number: "II",
      icon: <Settings size={18} strokeWidth={1.2} />,
      title: "Shape",
      desc: "Choose your theme, layout, and links. Adjust the design to reflect your identity.",
    },
    {
      number: "III",
      icon: <Share2 size={18} strokeWidth={1.2} />,
      title: "Share",
      desc: "Publish your page and use your link anywhere — Twitch, YouTube, Instagram, or X.",
    },
  ];

  return (
    <section className="relative bg-white py-24 md:py-32 border-t border-black/5 overflow-hidden">

      {/* Architectural Lines */}
      <div className="absolute left-[40px] top-0 w-px h-full bg-black/[0.05] hidden md:block" />
      <div className="absolute right-[40px] top-0 w-px h-full bg-black/[0.05] hidden md:block" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">

        {/* Header */}
        <div className="mb-20 max-w-2xl">
          <h2
            className={cn(
              "text-6xl md:text-7xl leading-[0.85] tracking-tight mb-6",
              blackletter.className
            )}
          >
            How to <br />
            <span className="text-zinc-300">Setup.</span>
          </h2>

          <p
            className={cn(
              "text-lg text-zinc-600 border-l border-black pl-6 leading-relaxed",
              inter.className
            )}
          >
            Create your page in minutes. No required integrations. No complexity.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-14 border-t border-black pt-12">

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col"
            >
              {/* Roman Numeral */}
              <div
                className={cn(
                  "text-sm tracking-[0.4em] text-black/30 mb-6",
                  mono.className
                )}
              >
                {step.number}
              </div>

              {/* Title */}
              <div className="flex items-center gap-4 mb-4">
                <div className="text-black">
                  {step.icon}
                </div>

                <h3
                  className={cn(
                    "text-3xl tracking-tight",
                    cinzel.className
                  )}
                >
                  {step.title}
                </h3>
              </div>

              {/* Description */}
              <p
                className={cn(
                  "text-zinc-600 text-base leading-relaxed",
                  inter.className
                )}
              >
                {step.desc}
              </p>

              {/* Engraved Divider */}
              <div className="mt-8 h-px w-16 bg-black/20" />
            </motion.div>
          ))}
        </div>

        {/* Reassurance */}
        <div className="mt-20 pt-8 border-t border-black/5">
          <p
            className={cn(
              "text-sm text-zinc-500",
              inter.className
            )}
          >
            Discord is optional. Drixe works perfectly as a static link page.
          </p>
        </div>

      </div>
    </section>
  );
}
