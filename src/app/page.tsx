"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

// IMPORTS
import { DesktopNavbar } from "@/components/DesktopNavbar";
import { MobileNavbar } from "@/components/MobileNavbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/howitworks";
import { PrivacySection } from "@/components/privacy";
import { Pricing } from "@/components/pricing";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/Footer";
 
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={cn("min-h-screen bg-white text-black selection:bg-black selection:text-white overflow-hidden", inter.className)}>
      
      {/* BACKGROUND TEXTURE (ASH) */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }}></div>
      
      {/* DECORATIVE ELEMENTS */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-gray-100 to-transparent blur-3xl opacity-60 z-0 pointer-events-none"></div>

      {/* NAVIGATION */}
      <DesktopNavbar />
      <MobileNavbar />

      {/* SECTIONS */}
      <Hero />
      <Features />
      <HowItWorks />
      <PrivacySection />
      <Pricing />
      <FAQ />
      <Footer />

    </main>
  );
}