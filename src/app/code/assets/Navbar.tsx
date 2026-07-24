"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Solutions", href: "#solutions" },
  { label: "Why CODM?", href: "#why" },
  { label: "Services", href: "#services", hasChevron: true },
  { label: "Industries", href: "#industries" },
  { label: "Insights", href: "#insights" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 72));

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* ─── Outer wrapper: always fixed full-width, centers the pill ─── */}
      <div className="fixed inset-x-0 top-0 z-50 flex justify-center">
        <motion.div
          layout
          animate={
            scrolled
              ? {
                  marginTop: 20,
                  width: "min(72%, 880px)", // Decreased width
                  borderRadius: 9999,
                  paddingLeft: 36,
                  paddingRight: 28,
                  paddingTop: 20, // Increased height
                  paddingBottom: 20, // Increased height
                  backgroundColor: "rgba(4,4,12,0.85)",
                  backdropFilter: "blur(24px)",
                 
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.12), 0 20px 50px rgba(0,0,0,0.65)",
                }
              : {
                  marginTop: 0,
                  width: "92%", // Decreased initial width (was 100%)
                  borderRadius: 24,
                  paddingLeft: 48,
                  paddingRight: 40,
                  paddingTop: 48, // Taller initial height
                  paddingBottom: 48, // Taller initial height
                  backgroundColor: "rgba(0,0,0,0)",
                  backdropFilter: "blur(0px)",
                  
                  boxShadow: "none",
                }
          }
          transition={{ type: "spring", stiffness: 240, damping: 28, mass: 0.9 }}
          className="flex items-center justify-between"
        >
          {/* ── Logo ── */}
          <a href="#home" className="flex-shrink-0 select-none">
            <motion.div
              animate={{ gap: scrolled ? "8px" : "10px" }}
              className="flex items-baseline"
            >
              <motion.span
                animate={{ fontSize: scrolled ? "1.75rem" : "2.4rem" }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="block font-black leading-none tracking-tight text-white"
              >
                COD
              </motion.span>
              <motion.span
                animate={{ fontSize: scrolled ? "1.75rem" : "2.4rem" }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className="block font-black leading-none tracking-tight"
                style={{ color: "#7c5cfc" }}
              >
                M
              </motion.span>
            </motion.div>
          </a>

          {/* ── Desktop nav links ── */}
          <nav className="hidden items-center gap-10 lg:flex">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group flex items-center gap-1.5 text-[1.05rem] font-medium text-white/70 transition-colors duration-200 hover:text-white"
              >
                {link.label}
                {link.hasChevron && (
                  <svg
                    className="mt-px h-3.5 w-3.5 text-white/40 transition-transform duration-300 group-hover:rotate-180"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M2.56 5.94a.67.67 0 0 0 0 .94l5 5a.67.67 0 0 0 .94 0l5-5a.67.67 0 0 0-.94-.94L8 10.47 3.5 5.94a.67.67 0 0 0-.94 0Z" />
                  </svg>
                )}
              </a>
            ))}
          </nav>

          {/* ── Right side ── */}
          <div className="hidden items-center gap-6 lg:flex flex-shrink-0">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05, boxShadow: "0 0 28px rgba(124,92,252,0.5)" }}
              whileTap={{ scale: 0.96 }}
              animate={
                scrolled
                  ? { paddingLeft: 22, paddingRight: 22, paddingTop: 12, paddingBottom: 12 }
                  : { paddingLeft: 32, paddingRight: 32, paddingTop: 16, paddingBottom: 16 }
              }
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="relative inline-flex items-center gap-2.5 overflow-hidden rounded-full text-base font-semibold text-white"
              style={{
                border: "2px solid rgba(124,92,252,0.8)",
              }}
            >
              {/* Shimmer */}
              <motion.span
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "110%" }}
                transition={{ duration: 0.55 }}
              />
              {/* Text hides when scrolled */}
              <AnimatePresence mode="wait">
                {!scrolled && (
                  <motion.span
                    key="text"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.22 }}
                    className="relative z-10 whitespace-nowrap overflow-hidden"
                  >
                    Contact Us
                  </motion.span>
                )}
              </AnimatePresence>
              {/* Mail icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 flex-shrink-0"
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M17.5 3.906H2.5a.47.47 0 0 0-.469.47V15c0 .29.115.567.325.772.21.206.491.322.784.322h13.72c.293 0 .574-.116.784-.322.21-.205.325-.483.325-.772V4.375a.47.47 0 0 0-.469-.469Zm-1.205.937L10 10.614 3.705 4.843h12.59ZM16.875 15.156H3.125a.156.156 0 0 1-.156-.156V5.44L9.687 11.6c.086.079.2.122.317.122.117 0 .23-.043.317-.122L17.03 5.44V15a.156.156 0 0 1-.156.156Z" />
              </svg>
            </motion.a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-white/20 text-white lg:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.14 }}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </motion.div>
      </div>

      {/* ─── Mobile fullscreen menu ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mob"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col bg-[#04040c]/98 px-8 pt-36 pb-12 backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex flex-col gap-2">
              {LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-white/[0.08] py-5 text-2xl font-medium text-white/70 transition hover:text-white"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <div className="mt-auto pt-8">
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center rounded-full py-4 text-base font-semibold text-white"
                style={{ border: "2px solid rgba(124,92,252,0.8)" }}
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}