"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Crown, Shield, Coins, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Grenze_Gotisch, 
  Inter_Tight, 
  UnifrakturMaguntia, 
  JetBrains_Mono,
  Cinzel_Decorative 
} from "next/font/google";

const goth = Grenze_Gotisch({ weight: ["400", "700", "900"], subsets: ["latin"] });
const blackletter = UnifrakturMaguntia({ weight: ["400"], subsets: ["latin"] });
const cinzel = Cinzel_Decorative({ weight: ["400", "700"], subsets: ["latin"] });
const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

type Currency = "USD" | "EUR" | "INR" | "GBP";

export function Pricing() {
  const [currency, setCurrency] = useState<Currency>("USD");

  // Logic: Pre-defined localized "Sharp" prices for a premium feel
  const pricingMap = {
    USD: { eternal: "$6.99", sovereign: "$49", symbol: "$" },
    EUR: { eternal: "€6.99", sovereign: "€45", symbol: "€" },
    INR: { eternal: "₹599", sovereign: "₹3,999", symbol: "₹" },
    GBP: { eternal: "£5.99", sovereign: "£39", symbol: "£" },
  };

  const tiers = [
    {
      name: "Dormant",
      price: "FREE",
      period: "Forever",
      desc: "For the wandering soul.",
      features: ["Standard Gothic Theme", "Discord Presence Sync", "Drixe.lol Subdomain", "Basic Support"],
      cta: "BEGIN JOURNEY",
      featured: false,
    },
    {
      name: "Eternal",
      price: pricingMap[currency].eternal,
      period: "Lifetime Access",
      desc: "One sacrifice. Endless presence.",
      features: [
        "All Premium Themes",
        "Spotify Reactive Backgrounds",
        "Advanced 3D Tilt Physics",
        "Priority Signal Rendering",
        "Remove Drixe Branding",
      ],
      cta: "CLAIM IMMORTALITY",
      featured: true,
    },
    {
      name: "Sovereign",
      price: pricingMap[currency].sovereign,
      period: "Bespoke",
      desc: "Architect your own void.",
      features: ["Custom Domain Mapping", "White-label Studio Mode", "Direct Architect Access", "Beta API Integration"],
      cta: "CONTACT US",
      featured: false,
    }
  ];

  return (
    <section className="relative bg-white py-20 md:py-32 overflow-hidden border-t border-black/5">
      
      {/* --- ARCHITECTURAL LINES --- */}
      <div className="absolute inset-0 pointer-events-none flex justify-between px-6 md:px-12 opacity-10">
        <div className="w-px h-full bg-black" />
        <div className="w-px h-full bg-black" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* --- HEADER --- */}
        <div className="flex flex-col items-center text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="text-xl">†</div>
            <span className={cn("text-[10px] font-black tracking-[0.6em] text-black uppercase", mono.className)}>
              Financial Ritual
            </span>
            <div className="text-xl">†</div>
          </motion.div>

          <h2 className={cn("text-6xl md:text-8xl text-black leading-none mb-10 tracking-tighter", blackletter.className)}>
            The Price of <span className="text-zinc-300">Identity.</span>
          </h2>

          {/* CURRENCY SWITCHER */}
          <div className="flex bg-zinc-50 border border-black/5 p-1 rounded-sm shadow-inner">
            {(["USD", "EUR", "INR", "GBP"] as Currency[]).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={cn(
                  "px-5 py-2 text-[10px] font-bold tracking-widest transition-all duration-300",
                  mono.className,
                  currency === curr ? "bg-black text-white shadow-lg" : "text-zinc-400 hover:text-black"
                )}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* --- PRICING GRID --- */}
        <div className="grid lg:grid-cols-3 gap-8 items-end">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              whileHover={{ y: -12 }} // Deep 3D lift
              className={cn(
                "relative group flex flex-col p-10 transition-all duration-500 border",
                tier.featured 
                  ? "bg-black text-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.4)] z-20 min-h-[640px] border-black" 
                  : "bg-white border-black/5 hover:border-black/20 text-black min-h-[520px]"
              )}
              style={tier.featured ? { clipPath: "polygon(0% 8%, 50% 0%, 100% 8%, 100% 100%, 0% 100%)" } : {}}
            >
              {/* CARD DECOR */}
              <div className="flex justify-between items-start mb-12">
                <span className={cn("text-[10px] font-black tracking-[0.4em] opacity-30", mono.className)}>
                  {tier.name.toUpperCase()}
                </span>
                {tier.featured && <Crown size={20} className="text-zinc-600 animate-pulse" />}
              </div>

              {/* PRICE AREA */}
              <div className="mb-10">
                <div className="flex items-baseline">
                  <span className={cn("text-6xl md:text-7xl font-bold tracking-tighter", cinzel.className)}>
                    {tier.price}
                  </span>
                </div>
                <div className={cn("text-[10px] tracking-[0.5em] uppercase opacity-40 mt-4 font-bold flex items-center gap-2", mono.className)}>
                   <div className="h-px w-6 bg-current" /> {tier.period}
                </div>
              </div>

              <p className={cn("text-base mb-12 opacity-50 italic leading-relaxed", inter.className)}>
                {tier.desc}
              </p>

              {/* FEATURES */}
              <div className="flex-1 space-y-5 mb-14">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-center gap-4 group/item">
                    <Star size={10} className={cn("transition-transform group-hover/item:rotate-90", tier.featured ? "text-zinc-700" : "text-zinc-200")} />
                    <span className={cn("text-xs font-semibold tracking-wide", inter.className)}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA BUTTON */}
              <button className={cn(
                "w-full py-5 font-black tracking-[0.4em] text-[10px] transition-all relative overflow-hidden group/btn border",
                tier.featured 
                  ? "bg-white text-black border-white hover:bg-transparent hover:text-white" 
                  : "bg-black text-white border-black hover:bg-transparent hover:text-black shadow-lg"
              )}>
                <span className="relative z-10 flex items-center justify-center gap-2 uppercase">
                  {tier.cta} <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </span>
              </button>

              {/* CHISELED MARKER */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-10 select-none">
                <span className="text-3xl">†</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- REASSURANCE --- */}
        <div className="mt-24 flex flex-col items-center gap-6 opacity-30">
          <div className="flex items-center gap-6">
             <Shield size={22} strokeWidth={1} />
             <div className="h-px w-32 bg-black" />
             <Coins size={22} strokeWidth={1} />
          </div>
          <p className={cn("text-[10px] font-black tracking-[0.6em] uppercase text-center", mono.className)}>
            A Single Sacrifice. A Lifetime of Presence.
          </p>
        </div>

      </div>
    </section>
  );
}