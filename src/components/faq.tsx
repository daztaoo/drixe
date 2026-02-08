"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Grenze_Gotisch,
  Inter_Tight,
  UnifrakturMaguntia,
  JetBrains_Mono,
} from "next/font/google";

const goth = Grenze_Gotisch({ weight: ["400", "700"], subsets: ["latin"] });
const blackletter = UnifrakturMaguntia({ weight: ["400"], subsets: ["latin"] });
const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "500"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does real-time sync work?",
      a: "Drixe reads your public Discord presence and Spotify status to update your page automatically. No manual updates are required.",
    },
    {
      q: "What does Lifetime access include?",
      a: "One payment. No subscriptions. You get all current premium features and future core updates.",
    },
    {
      q: "Do I need Discord to use Drixe?",
      a: "No. Real-time sync is optional. You can use Drixe as a static link page without connecting any accounts.",
    },
    {
      q: "Is my private data stored?",
      a: "No. We do not store Discord messages, Spotify history, or personal data. Only public presence is read.",
    },
    {
      q: "Can I change my username later?",
      a: "Yes. You can update your profile settings anytime, depending on availability.",
    },
  ];

  return (
    <section className="relative bg-white py-16 md:py-24 border-t border-black/5 overflow-hidden">

      {/* Vertical lines */}
      <div className="absolute left-[40px] top-0 w-px h-full bg-black/[0.05] hidden md:block" />
      <div className="absolute right-[40px] top-0 w-px h-full bg-black/[0.05] hidden md:block" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle size={14} />
            <span
              className={cn(
                "text-[10px] font-bold tracking-[0.4em] uppercase",
                mono.className
              )}
            >
              FAQ
            </span>
          </div>

          <h2
            className={cn(
              "text-4xl md:text-6xl leading-[0.9] tracking-tight",
              blackletter.className
            )}
          >
            Frequently Asked.
          </h2>
        </div>

        {/* Accordion */}
        <div className="divide-y divide-black/10">

          {faqs.map((faq, i) => (
            <div key={i} className="py-6">

              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-start justify-between gap-6 text-left"
              >
                <h3
                  className={cn(
                    "text-lg md:text-xl transition-colors",
                    goth.className,
                    openIndex === i ? "text-black" : "text-zinc-500"
                  )}
                >
                  {faq.q}
                </h3>

                <motion.span
                  animate={{ rotate: openIndex === i ? 45 : 0 }}
                  className="text-black text-lg"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden"
                  >
                    <p
                      className={cn(
                        "mt-4 text-sm md:text-base text-zinc-600 leading-relaxed",
                        inter.className
                      )}
                    >
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
