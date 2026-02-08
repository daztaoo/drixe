"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const melissaRoasts = [
  "SYSTEM STATUS: EMMA = MAIN CHARACTER",
  "MELISSA HAS BEEN MOVED TO COMMENTARY MODE",
  "EMMA LEADS | MELISSA PROVIDES SOUND EFFECTS",
  "WARNING: MELISSA DETECTED YAPPING (NON-CRITICAL)",
  "EMMA CARRIES THE VIBE — MELISSA HYPES FROM SIDELINES",
  "MELISSA BUFF APPLIED: COMEDIC RELIEF",
  "EMMA MAKES THE DECISIONS",
  "MELISSA MAKES THE OBSERVATIONS",
  "FRIEND GROUP PATCH NOTES: EMMA BUFFED AGAIN",
  "MELISSA IS NOT A RED FLAG — JUST A LOUD ONE",
  "RESULT VERIFIED BY VIBE CHECK™"
];

export default function EmmaSupremacyTrap() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const startVerification = () => {
    setStep(1);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep(2), 500);
          return 100;
        }
        return prev + 4;
      });
    }, 120);
  };

  return (
    <main
      className={`fixed inset-0 flex items-center justify-center overflow-hidden font-sans p-6 transition-colors duration-700 ${
        step === 2 ? "bg-[#ff2d55]" : "bg-[#0f172a]"
      }`}
    >
      {/* STEP 0 — BAIT */}
      {step === 0 && (
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-[360px] bg-white rounded-[2rem] p-8 text-center shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
        >
          <div className="text-5xl mb-6">📊</div>
          <h1 className="text-2xl font-black text-slate-900 mb-2">
            GC POWER <br /> ANALYZER
          </h1>
          <p className="text-slate-500 text-sm mb-8 font-medium">
            Scientifically determines <br />
            <span className="font-bold underline text-indigo-600">
              Emma vs Melissa
            </span>
          </p>

          <button
            onClick={startVerification}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold tracking-widest hover:bg-indigo-700 active:scale-95 transition-all uppercase text-xs shadow-lg"
          >
            Run Algorithm
          </button>
        </motion.div>
      )}

      {/* STEP 1 — FAKE LOADING */}
      {step === 1 && (
        <div className="w-full max-w-[320px] text-center">
          <h2 className="text-white text-xs font-mono mb-4 tracking-[0.3em] uppercase opacity-70">
            Analyzing Group Chat…
          </h2>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-500"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-4 text-indigo-300 font-mono text-[10px] uppercase">
            {progress < 35 && "Scanning confidence levels…"}
            {progress >= 35 && progress < 70 && "Measuring yap frequency…"}
            {progress >= 70 && "Confirming Emma energy…"}
          </p>
        </div>
      )}

      {/* STEP 2 — CHAOS */}
      {step === 2 && (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Background roast feed */}
          <div className="absolute inset-0 flex flex-col items-center gap-2 pt-24 opacity-90">
            {melissaRoasts.map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-black text-white px-4 py-2 text-[11px] md:text-sm font-black uppercase italic border-l-8 border-yellow-400 w-[90%] max-w-[520px]"
              >
                {text}
              </motion.div>
            ))}
          </div>

          {/* Center card */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1.05, rotate: 0 }}
            className="relative z-20 bg-white p-8 border-[10px] border-black shadow-[18px_18px_0_#000] text-center max-w-[360px]"
          >
            <h2 className="text-4xl font-black text-pink-600 italic mb-3">
              OFFICIAL RESULT
            </h2>

            <p className="text-xs font-black tracking-widest uppercase mb-4">
              ACCORDING TO PURE VIBES
            </p>

            <div className="text-3xl font-black text-indigo-600 underline mb-4">
              EMMA WINS
            </div>

            <p className="text-[11px] font-mono text-slate-500 uppercase bg-slate-100 p-2">
              Melissa remains essential for commentary and dramatic reactions.
            </p>
          </motion.div>

          {/* Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            onClick={() => alert("Relax 😌 it’s just the algorithm.")}
            className="absolute bottom-16 bg-yellow-400 text-black px-8 py-3 font-black uppercase border-4 border-black shadow-[4px_4px_0_#000] active:translate-y-1"
          >
            Melissa Click for Explanation
          </motion.button>
        </div>
      )}

      {/* TEAM EMMA SCROLL */}
      {step === 2 && (
        <div className="absolute top-8 left-0 w-full overflow-hidden opacity-20 pointer-events-none">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className="flex gap-20 text-[90px] font-black text-white whitespace-nowrap"
          >
            <span>TEAM EMMA</span>
            <span>TEAM EMMA</span>
            <span>TEAM EMMA</span>
          </motion.div>
        </div>
      )}
    </main>
  );
}
