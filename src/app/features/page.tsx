"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Music,
  EyeOff,
  Zap,
  ShieldCheck,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Grenze_Gotisch,
  Inter_Tight,
  UnifrakturMaguntia,
  Cinzel_Decorative
} from "next/font/google";
import { DesktopNavbar } from "@/components/DesktopNavbar";
import { Footer } from "@/components/Footer";

const goth = Grenze_Gotisch({ weight: ["400", "700", "900"], subsets: ["latin"] });
const blackletter = UnifrakturMaguntia({ weight: ["400"], subsets: ["latin"] });
const cinzel = Cinzel_Decorative({ weight: ["400", "700"], subsets: ["latin"] });
const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "600", "800"] });

export default function FeaturesPage() {

  const specs = [
    {
      id: "01",
      title: "Real-Time Presence",
      description:
        "Your profile updates automatically when you stream, game, or go live.",
      technical: [
        "WebSocket live updates",
        "Low-latency rendering",
        "Activity prioritization engine"
      ],
      icon: <Activity size={28} strokeWidth={1.2} />
    },
    {
      id: "02",
      title: "Spotify Reactive Mode",
      description:
        "When music plays, your page responds. Visuals adapt to mood, tempo, and album color.",
      technical: [
        "BPM mapping",
        "Album palette extraction",
        "Dynamic theme transitions"
      ],
      icon: <Music size={28} strokeWidth={1.2} />
    },
    {
      id: "03",
      title: "Private by Design",
      description:
        "We only read public presence. No message storage. No history logging.",
      technical: [
        "Zero log architecture",
        "Instant disconnect",
        "Encrypted account linking"
      ],
      icon: <EyeOff size={28} strokeWidth={1.2} />
    }
  ];

  return (
    <main className="bg-white min-h-screen selection:bg-black selection:text-white">

      <DesktopNavbar />

      {/* SIDE STRUCTURE LINES */}
      <div className="fixed inset-0 pointer-events-none z-40 flex justify-between px-6 md:px-12 opacity-[0.04]">
        <div className="w-px h-full bg-black" />
        <div className="w-px h-full bg-black" />
      </div>

      {/* HERO */}
      <section className="pt-36 md:pt-48 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">

          <span
            className={cn(
              "text-[11px] tracking-[0.4em] text-zinc-400 uppercase",
              cinzel.className
            )}
          >
            Product Overview
          </span>

          <h1
            className={cn(
              "mt-6 text-5xl md:text-8xl leading-[0.9] tracking-tight",
              blackletter.className
            )}
          >
            Built to React.
            <br />
            <span className="text-zinc-300">Designed to Endure.</span>
          </h1>

          <p
            className={cn(
              "mt-8 text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed",
              inter.className
            )}
          >
            Drixe turns your live activity into a dynamic identity page.
            Spotify, Discord, streaming — reflected instantly.
          </p>

        </div>
      </section>

      {/* CORE FEATURES */}
      <section className="py-24 px-6 border-t border-black/5">
        <div className="max-w-6xl mx-auto space-y-28">

          {specs.map((spec, i) => (
            <div
              key={spec.id}
              className={cn(
                "grid md:grid-cols-2 gap-16 items-center",
                i % 2 !== 0 && "md:grid-flow-dense"
              )}
            >

              {/* TEXT SIDE */}
              <div className={cn(i % 2 !== 0 && "md:col-start-2")}>

                <div className="flex items-center gap-4 mb-6">
                  <span
                    className={cn(
                      "text-4xl text-black/10",
                      goth.className
                    )}
                  >
                    {spec.id}
                  </span>
                  <div className="h-px flex-1 bg-black/10" />
                </div>

                <h2
                  className={cn(
                    "text-4xl md:text-6xl leading-tight mb-6",
                    blackletter.className
                  )}
                >
                  {spec.title}
                </h2>

                <p
                  className={cn(
                    "text-base md:text-lg text-zinc-600 leading-relaxed border-l border-black pl-6",
                    inter.className
                  )}
                >
                  {spec.description}
                </p>

              </div>

              {/* TECH BOX */}
              <div className="bg-zinc-50 border border-black/5 p-8 md:p-10 relative">

                <div className="absolute top-6 right-6 text-black/10">
                  {spec.icon}
                </div>

                <h4
                  className={cn(
                    "text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-6",
                    cinzel.className
                  )}
                >
                  Technical Details
                </h4>

                <div className="space-y-4">
                  {spec.technical.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <Plus size={12} />
                      <span
                        className={cn(
                          "text-sm text-black font-medium",
                          inter.className
                        )}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          ))}

        </div>
      </section>

      {/* INFRASTRUCTURE STRIP */}
      <section className="py-24 px-6 bg-zinc-50 border-t border-black/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">

          <div>
            <h4 className={cn("text-sm uppercase tracking-[0.3em] mb-4", cinzel.className)}>
              Performance
            </h4>
            <p className={cn("text-zinc-600", inter.className)}>
              Edge-optimized delivery with hardware accelerated rendering.
            </p>
          </div>

          <div>
            <h4 className={cn("text-sm uppercase tracking-[0.3em] mb-4", cinzel.className)}>
              Integrations
            </h4>
            <p className={cn("text-zinc-600", inter.className)}>
              Discord, Spotify, Steam and more.
            </p>
          </div>

          <div>
            <h4 className={cn("text-sm uppercase tracking-[0.3em] mb-4", cinzel.className)}>
              Privacy
            </h4>
            <p className={cn("text-zinc-600", inter.className)}>
              Zero log infrastructure. Public presence only.
            </p>
          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-28 px-6 text-center border-t border-black/5">
        <div className="max-w-2xl mx-auto">

          <h2
            className={cn(
              "text-5xl md:text-7xl mb-6",
              blackletter.className
            )}
          >
            Claim Your Drixe.
          </h2>

          <p
            className={cn(
              "text-lg text-zinc-600 mb-10",
              inter.className
            )}
          >
            Create your living profile in under two minutes.
          </p>

          <button className="bg-black text-white px-10 py-4 text-sm tracking-[0.3em] uppercase font-bold hover:bg-zinc-800 transition-all">
            Create Your Page
          </button>

        </div>
      </section>

      <Footer />

    </main>
  );
}
