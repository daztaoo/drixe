"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import DotGrid and ModelCanvas with SSR disabled
const DotGrid = dynamic<any>(() => import("./DotGrid"), {
  ssr: false,
});
const ModelCanvas = dynamic(() => import("./ModelCanvas"), { ssr: false });

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      className="relative h-screen min-h-[700px] w-full overflow-hidden bg-[#121212] text-white flex items-center justify-center selection:bg-[#7c5cfc] selection:text-white"
    >
      {/* ══════════════════════════════════════════════
          BACKGROUND LAYER: INTERACTIVE DOT GRID
      ══════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
        <DotGrid
          dotSize={3}
          gap={24}
          baseColor="#444444"
          activeColor="#7c5cfc"
          proximity={140}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />

        {/* Ambient Blurple Radial Glow */}
        <div
          className="pointer-events-none absolute -top-[10%] left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-25 blur-[140px]"
          style={{
            background:
              "radial-gradient(circle, rgba(124, 92, 252, 0.6) 0%, rgba(18, 18, 18, 0) 70%)",
          }}
        />

        {/* Subtle Bottom Vignette Fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#121212] to-transparent" />
      </div>

      {/* ── Central Hero Content Container ── */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 w-full max-w-[1500px] mx-auto px-8 lg:px-16 flex items-center justify-between gap-12"
      >
        {/* ══════════════════════════════════════════════
            LEFT SIDE: HIGH-IMPACT TYPOGRAPHY
        ══════════════════════════════════════════════ */}
        <div className="flex flex-col justify-center max-w-[720px] z-20">
          {/* Eyebrow / Category Tag */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mb-8 flex items-center gap-3"
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor: "#7c5cfc",
                boxShadow: "0 0 10px #7c5cfc",
              }}
            />
            <span
              className="text-[0.75rem] font-bold uppercase tracking-[0.35em]"
              style={{ color: "#7c5cfc" }}
            >
              AI-Driven Enterprise Software
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="mb-8 leading-[0.98] tracking-tighter">
            <div className="overflow-hidden">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.7,
                  delay: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="block text-[clamp(1.8rem,3.2vw,3.2rem)] font-light text-white/70"
              >
                Your Enterprise Challenges?
              </motion.span>
            </div>

            <div className="overflow-hidden mt-1">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.7,
                  delay: 1.0,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="block text-[clamp(4.5rem,7.5vw,8rem)] font-black uppercase tracking-tighter"
                style={{ color: "#7c5cfc" }}
              >
                Solved.
              </motion.span>
            </div>
          </h1>

          {/* Body Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="max-w-[560px] text-[1rem] lg:text-[1.125rem] leading-relaxed text-white/60 font-normal"
          >
            From{" "}
            <strong className="text-white font-medium">
              Salesforce optimization
            </strong>{" "}
            to full{" "}
            <strong className="text-white font-medium">
              intelligent AI automation 
            </strong>
            , CODM partners with enterprises to modernize operations and deliver
            measurable impact —{" "}
            <strong style={{ color: "#a78bfa" }} className="font-bold">
              300–400% ROI
            </strong>{" "}
            across 50+ implementations.
          </motion.p>
        </div>

        {/* ══════════════════════════════════════════════
            RIGHT SIDE: POP-UP TO GLIDE 3D CANVAS
        ══════════════════════════════════════════════ */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 1.4,
            x: "-50%",
            left: "50%",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            x: "0%",
            left: "auto",
          }}
          transition={{
            duration: 1.2,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1], // Smooth physics easing
          }}
          className="relative hidden lg:block h-[56vh] min-h-[420px] w-[48%] z-10"
        >
          <ModelCanvas />
        </motion.div>
      </motion.div>
    </section>
  );
}