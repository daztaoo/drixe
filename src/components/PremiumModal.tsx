"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Crown, X, Zap, ChevronRight } from "lucide-react";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";

const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

const PREMIUM_FEATURES = [
  "Custom themes & layouts",
  "Custom cursor effects",
  "Profile music / audio",
  "Custom domain",
  "Analytics dashboard",
  "Unlimited links",
  "Exclusive badges",
];

interface Props {
  open: boolean;
  onClose: () => void;
  featureName?: string;
}

export function PremiumModal({ open, onClose, featureName }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_80px_-20px_rgba(168,85,247,0.3)]">

              {/* Purple top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-600/20 blur-3xl rounded-full pointer-events-none" />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/30 hover:text-white transition-colors z-10"
              >
                <X size={16} />
              </button>

              <div className="p-7 pt-8 relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-purple-500/15 border border-purple-500/25 flex items-center justify-center">
                    <Crown size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className={cn("text-lg font-black text-white", inter.className)}>Premium Required</h2>
                      <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-purple-300 border border-purple-500/30 bg-purple-500/10 rounded-full">Pro</span>
                    </div>
                    {featureName && (
                      <p className="text-xs text-white/40 mt-0.5">
                        <span className="text-purple-400">{featureName}</span> is a premium-only feature
                      </p>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-1.5 mb-6">
                  {PREMIUM_FEATURES.map((f, i) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <div className="w-1 h-1 rounded-full bg-purple-400 flex-shrink-0" />
                      <span className={cn("text-xs text-white/50", inter.className)}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link href="/dashboard/premium" onClick={onClose}>
                  <button className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                    <Zap size={13} />
                    Upgrade to Premium
                    <ChevronRight size={13} />
                  </button>
                </Link>

                <p className="text-center text-[9px] text-white/20 mt-3">No commitment · Cancel anytime</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
