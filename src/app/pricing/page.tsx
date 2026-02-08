"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Crown, Shield, Coins, ChevronRight, Star, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Grenze_Gotisch, 
  Inter_Tight, 
  UnifrakturMaguntia, 
  JetBrains_Mono,
  Cinzel_Decorative 
} from "next/font/google";
import { DesktopNavbar } from "@/components/DesktopNavbar";
import { Footer } from "@/components/Footer";

const goth = Grenze_Gotisch({ weight: ["400", "700", "900"], subsets: ["latin"] });
const blackletter = UnifrakturMaguntia({ weight: ["400"], subsets: ["latin"] });
const cinzel = Cinzel_Decorative({ weight: ["400", "700"], subsets: ["latin"] });
const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "600", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

type Currency = "USD" | "EUR" | "INR" | "GBP";

export default function PricingPage() {
  const [currency, setCurrency] = useState<Currency>("USD");

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
      desc: "For the wandering soul seeking a place in the void.",
      features: ["Standard Gothic Theme", "Discord Presence Sync", "Drixe.lol Subdomain", "Basic Support"],
      cta: "BEGIN JOURNEY",
      featured: false,
    },
    {
      name: "Eternal",
      price: pricingMap[currency].eternal,
      period: "Lifetime Access",
      desc: "A single sacrifice for an everlasting digital presence.",
      features: [
        "All Premium Archive Themes",
        "Spotify Reactive Atmosphere",
        "Advanced 3D Tilt Physics",
        "Priority Signal Rendering",
        "Zero Drixe Branding",
      ],
      cta: "CLAIM IMMORTALITY",
      featured: true,
    },
    {
      name: "Sovereign",
      price: pricingMap[currency].sovereign,
      period: "Bespoke",
      desc: "For those who wish to architect their own reality.",
      features: ["Custom Domain Mapping", "White-label Studio Mode", "Direct Architect Access", "Beta API Integration"],
      cta: "CONTACT ARCHITECT",
      featured: false,
    }
  ];

  return (
    <main className="bg-white min-h-screen selection:bg-black selection:text-white">
      <DesktopNavbar />

      {/* --- ARCHITECTURAL FRAMEWORK --- */}
      <div className="fixed inset-0 pointer-events-none z-50 flex justify-between px-6 md:px-12 opacity-5">
        <div className="w-px h-full bg-black" />
        <div className="w-px h-full bg-black" />
      </div>

      <section className="relative pt-48 pb-32 md:pt-64 md:pb-48 px-6">
        
        {/* --- HEADER --- */}
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center mb-24 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="text-2xl">†</div>
            <span className={cn("text-[10px] font-black tracking-[0.6em] text-black uppercase", cinzel.className)}>
              Exchange Protocol
            </span>
            <div className="text-2xl">†</div>
          </motion.div>

          <h1 className={cn("text-7xl md:text-[140px] text-black leading-[0.8] tracking-tighter mb-12", blackletter.className)}>
            Sacrifice for <br/> <span className="text-zinc-200">Immortality.</span>
          </h1>

          {/* CURRENCY SELECTOR */}
          <div className="inline-flex bg-zinc-50 border border-black/5 p-1 rounded-sm shadow-inner relative z-10">
            {(["USD", "EUR", "INR", "GBP"] as Currency[]).map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={cn(
                  "px-6 py-2 text-[11px] font-bold tracking-widest transition-all duration-500",
                  mono.className,
                  currency === curr ? "bg-black text-white shadow-xl" : "text-zinc-300 hover:text-black"
                )}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* --- PRICING MONOLITHS --- */}
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10 items-end">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -15 }}
              className={cn(
                "relative flex flex-col p-12 transition-all duration-700 border",
                tier.featured 
                  ? "bg-black text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] z-20 min-h-[700px] border-black" 
                  : "bg-white border-black/5 hover:border-black/20 text-black min-h-[550px]"
              )}
              style={tier.featured ? { clipPath: "polygon(0% 10%, 50% 0%, 100% 10%, 100% 100%, 0% 100%)" } : {}}
            >
              {/* TOP LABELS */}
              <div className="flex justify-between items-center mb-16">
                <span className={cn("text-[10px] font-black tracking-[0.5em] opacity-30", mono.className)}>
                  {tier.name.toUpperCase()}
                </span>
                {tier.featured && (
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 5 }}>
                    <Crown size={22} strokeWidth={1} className="text-zinc-500" />
                  </motion.div>
                )}
              </div>

              {/* PRICE BLOCK */}
              <div className="mb-12">
                <h3 className={cn("text-7xl md:text-8xl font-bold tracking-tighter leading-none", cinzel.className)}>
                  {tier.price}
                </h3>
                <div className={cn("text-[11px] tracking-[0.6em] uppercase opacity-30 mt-6 font-black flex items-center gap-3", mono.className)}>
                   <div className="h-px w-8 bg-current" /> {tier.period}
                </div>
              </div>

              <p className={cn("text-lg mb-14 opacity-50 italic leading-snug font-medium max-w-[240px]", inter.className)}>
                {tier.desc}
              </p>

              {/* FEATURES RITUAL */}
              <div className="flex-1 space-y-6 mb-16">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-center gap-5 group/item">
                    <Star size={12} className={cn("transition-transform duration-700 group-hover/item:rotate-[180deg]", tier.featured ? "text-zinc-800" : "text-zinc-200")} />
                    <span className={cn("text-xs font-semibold tracking-wide uppercase", inter.className)}>
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA BUTTON */}
              <button className={cn(
                "w-full py-6 font-black tracking-[0.5em] text-[11px] transition-all duration-500 group/btn border relative overflow-hidden",
                tier.featured 
                  ? "bg-white text-black border-white hover:bg-black hover:text-white" 
                  : "bg-black text-white border-black hover:bg-white hover:text-black"
              )}>
                <span className="relative z-10 flex items-center justify-center gap-2 uppercase">
                  {tier.cta} <ChevronRight size={16} strokeWidth={3} className="group-hover/btn:translate-x-2 transition-transform" />
                </span>
              </button>

              {/* FINAL CHISEL MARK */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-10 select-none">
                <span className="text-4xl">†</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- REASSURANCE --- */}
        <div className="mt-32 flex flex-col items-center gap-8 opacity-20">
          <div className="flex items-center gap-8">
             <Shield size={24} strokeWidth={1} />
             <div className="h-px w-48 bg-black" />
             <Coins size={24} strokeWidth={1} />
          </div>
          <p className={cn("text-[11px] font-black tracking-[0.8em] uppercase text-center", mono.className)}>
            Existence is eternal. Access is singular.
          </p>
        </div>

      </section>

      <Footer />
    </main>
  );
}