"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { LayoutDashboard, LogIn, Zap } from "lucide-react";

const NAV_LINKS = [
  { text: "Features", href: "#features" },
  { text: "Pricing", href: "#pricing" },
  { text: "FAQ", href: "#faq" },
];

export function DesktopNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auth awareness
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        // Fetch username for the "Open Profile" link
        const { data } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();
        if (data?.username) setUsername(data.username);
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setIsLoggedIn(!!session)
    );
    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav
      className={cn(
        "hidden md:block fixed top-0 left-0 right-0 z-[100] transition-all duration-300",
        scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-black/[0.08] shadow-sm"
          : "bg-transparent border-b border-transparent"
      )}
    >
      {/* Architectural side lines */}
      <div className="absolute left-[40px] top-0 w-px h-full bg-black/[0.05]" />
      <div className="absolute right-[40px] top-0 w-px h-full bg-black/[0.05]" />

      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between relative z-10">

        {/* LEFT — Logo */}
        <div className="w-48 flex items-center">
          <Link href="/">
            <img
              src="/my-logo.png"
              alt="Drixe"
              className="h-10 w-auto object-contain grayscale brightness-0 hover:opacity-70 transition-opacity"
            />
          </Link>
        </div>

        {/* CENTER — Links */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((item) => (
            <a
              key={item.text}
              href={item.href}
              className="relative group px-4 py-2"
            >
              <span className="block text-[11px] tracking-[0.25em] uppercase transition-all duration-300 text-zinc-500 group-hover:text-black font-[var(--font-cinzel)]">
                {item.text}
              </span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-black transition-all duration-300 group-hover:w-1/2 opacity-20" />
            </a>
          ))}
        </div>

        {/* RIGHT — Auth CTA */}
        <div className="w-48 flex items-center justify-end gap-4">
          {isLoggedIn ? (
            <>
              {username && (
                <Link
                  href={`/${username}`}
                  target="_blank"
                  className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-black transition-colors"
                >
                  My Page
                </Link>
              )}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-5 py-2 bg-black text-white text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all"
              >
                <LayoutDashboard size={12} />
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-zinc-500 hover:text-black transition-colors"
              >
                <LogIn size={13} />
                Login
              </Link>
              <Link
                href="/auth?view=signup"
                className="flex items-center gap-2 px-5 py-2 border border-black text-[10px] tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all duration-300"
              >
                <Zap size={12} />
                Sign Up
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}



