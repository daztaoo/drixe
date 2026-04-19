"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard, LogIn, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const NAV_LINKS = [
  { text: "Features", href: "#features" },
  { text: "Pricing", href: "#pricing" },
  { text: "FAQ", href: "#faq" },
];

export function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Auth awareness
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        const { data } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();
        if (data?.username) setUsername(data.username);
      }
    };
    checkAuth();
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      {/* TOP BAR */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-[200] bg-white/95 backdrop-blur-md border-b border-black/[0.06]">
        <div className="h-16 px-5 flex items-center justify-between">
          <Link href="/" onClick={close}>
            <img
              src="/my-logo.png"
              alt="Drixe"
              className="h-8 w-auto object-contain grayscale brightness-0"
            />
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 flex items-center justify-center text-black hover:bg-black/5 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* BACKDROP */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="md:hidden fixed inset-0 z-[210] bg-black/20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* SLIDE-IN DRAWER (from right) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="md:hidden fixed top-0 right-0 bottom-0 z-[220] w-72 bg-white border-l border-black/[0.07] flex flex-col pt-16 pb-8 px-8 shadow-2xl"
          >
            {/* Close button inside drawer */}
            <button
              onClick={close}
              className="absolute top-4 right-5 text-black/40 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            {/* NAV LINKS */}
            <nav className="flex flex-col gap-1 mt-6">
              {NAV_LINKS.map((item, i) => (
                <motion.a
                  key={item.text}
                  href={item.href}
                  onClick={close}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                  className="py-3 text-xl tracking-[0.15em] uppercase text-black/70 hover:text-black transition-colors border-b border-black/[0.05] font-[var(--font-cinzel)]"
                >
                  {item.text}
                </motion.a>
              ))}
            </nav>

            {/* AUTH ACTIONS */}
            <div className="mt-auto flex flex-col gap-3">
              {isLoggedIn ? (
                <>
                  {username && (
                    <Link
                      href={`/${username}`}
                      target="_blank"
                      onClick={close}
                      className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 hover:text-black transition-colors text-center"
                    >
                      View My Profile ↗
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={close}
                    className="flex items-center justify-center gap-2 py-3 bg-black text-white text-[11px] uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all"
                  >
                    <LayoutDashboard size={13} />
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    onClick={close}
                    className="flex items-center justify-center gap-2 py-3 border border-black/20 text-[11px] uppercase tracking-[0.3em] text-zinc-600 hover:border-black hover:text-black transition-all"
                  >
                    <LogIn size={13} />
                    Login
                  </Link>
                  <Link
                    href="/auth?view=signup"
                    onClick={close}
                    className="flex items-center justify-center gap-2 py-3 bg-black text-white text-[11px] uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all"
                  >
                    <Zap size={13} />
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}



