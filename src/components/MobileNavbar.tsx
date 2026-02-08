"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Cinzel_Decorative,
  Inter_Tight
} from "next/font/google";

const cinzel = Cinzel_Decorative({ weight: ["400", "700"], subsets: ["latin"] });
const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "600"] });

export function MobileNavbar() {
  const [open, setOpen] = useState(false);

  const links = ["Discord", "Features", "Pricing", "FAQ"];

  return (
    <>
      {/* TOP BAR */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-[200] bg-white/90 backdrop-blur-md border-b border-black/[0.05]">
        <div className="h-20 px-6 flex items-center justify-between">

          <img
            src="/my-logo.png"
            alt="Drixe"
            className="h-10 w-auto object-contain grayscale brightness-0"
          />

          <button
            onClick={() => setOpen(!open)}
            className="text-black"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </nav>

      {/* OVERLAY MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-[150] bg-white pt-24 px-8"
          >

            <div className="flex flex-col gap-8">

              {links.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-3xl tracking-[0.2em] text-black",
                    cinzel.className
                  )}
                >
                  {item.toUpperCase()}
                </a>
              ))}

              <div className="mt-12 flex flex-col gap-6">

                <a
                  href="#"
                  className={cn(
                    "text-sm uppercase tracking-[0.3em] text-zinc-500",
                    inter.className
                  )}
                >
                  Login
                </a>

                <button
                  className={cn(
                    "border border-black py-3 text-sm uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all",
                    inter.className
                  )}
                >
                  Join Beta
                </button>

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
