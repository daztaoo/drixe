"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Link2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Grenze_Gotisch,
  Inter_Tight,
  UnifrakturMaguntia,
  JetBrains_Mono,
} from "next/font/google";

const goth = Grenze_Gotisch({ weight: ["400", "700", "900"], subsets: ["latin"] });
const blackletter = UnifrakturMaguntia({ weight: ["400"], subsets: ["latin"] });
const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

export function PrivacySection() {
  const points = [
    {
      index: "I",
      icon: <ShieldCheck size={20} strokeWidth={1.2} />,
      title: "No Activity Stored",
      desc: "Drixe does not store your Spotify history, Discord messages, or private data. Real-time updates are reflected live — not archived.",
    },
    {
      index: "II",
      icon: <Link2 size={20} strokeWidth={1.2} />,
      title: "Public Presence Only",
      desc: "We only read your public Discord presence to display what you're currently doing. Private conversations and personal data remain untouched.",
    },
    {
      index: "III",
      icon: <Lock size={20} strokeWidth={1.2} />,
      title: "Full Control",
      desc: "You can disconnect integrations or disable real-time features at any time from your settings.",
    },
  ];

  return (
    <section className="relative bg-white py-16 md:py-24 border-t border-black/5 overflow-hidden">

      {/* Vertical Rule Lines (kept as requested) */}
      <div className="absolute left-[40px] top-0 w-px h-full bg-black/[0.05] hidden md:block" />
      <div className="absolute right-[40px] top-0 w-px h-full bg-black/[0.05] hidden md:block" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">

        {/* Header */}
        <div className="mb-14 md:mb-20 max-w-2xl">

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <ShieldCheck size={14} />
            <span
              className={cn(
                "text-[10px] font-bold tracking-[0.4em] uppercase",
                mono.className
              )}
            >
              Privacy
            </span>
          </motion.div>

          <h2
            className={cn(
              "text-5xl md:text-6xl leading-[0.85] tracking-tight mb-6",
              blackletter.className
            )}
          >
            Your Data <br />
            <span className="text-zinc-300">Remains Yours.</span>
          </h2>

          <p
            className={cn(
              "text-base md:text-lg text-zinc-600 border-l border-black pl-6 leading-relaxed",
              inter.className
            )}
          >
            Real-time presence does not mean surveillance.
            Drixe reflects your activity — it does not collect or store it.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-12 border-t border-black pt-10">

          {points.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col"
            >
              {/* Index */}
              <div
                className={cn(
                  "text-xs tracking-[0.4em] text-black/30 mb-5",
                  mono.className
                )}
              >
                {p.index}
              </div>

              {/* Icon + Title */}
              <div className="flex items-center gap-4 mb-4">
                {p.icon}
                <h3
                  className={cn(
                    "text-2xl tracking-tight",
                    goth.className
                  )}
                >
                  {p.title}
                </h3>
              </div>

              {/* Description */}
              <p
                className={cn(
                  "text-zinc-600 text-sm leading-relaxed",
                  inter.className
                )}
              >
                {p.desc}
              </p>

              {/* Divider */}
              <div className="mt-6 h-px w-14 bg-black/20" />
            </motion.div>
          ))}
        </div>

        {/* Footer reassurance */}
        <div className="mt-16 pt-6 border-t border-black/5">
          <p
            className={cn(
              "text-sm text-zinc-500",
              inter.className
            )}
          >
            Drixe exists to enhance your presence — not to monitor it.
          </p>
        </div>

      </div>
    </section>
  );
}
