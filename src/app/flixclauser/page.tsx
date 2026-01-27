"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const insults = [
  "ROOT@TERMINAL: FLIX KE MUH ME KALE GOTE",
  "SYSTEM_LOG: CLAUSER KE MUH ME KALE GOTE",
  "DATABASE: FLIX + CLAUSER = GOTE LOVERS",
  "ALERT: KALE GOTE OVERFLOW DETECTED",
  "INFO: FLIX NIBBA KALE GOTE KHA RAHA HAI",
  "MEDIA: CLAUSER KI PASAND KALE GOTE",
  "SCAN: GOTE HI GOTE EVERYWHERE",
  "WARN: MUH KHOL KALE GOTE AAYE",
  "CRITICAL: FLIX'S SECRET GOTE STASH FOUND",
  "ACCESS: CLAUSER'S GOTE FOLDER LEAKED",
  "FATAL: MUH ME LO CLAUSER AND FLIX",
];

export default function GroupTrap() {
  const [isChaos, setIsChaos] = useState(false);

  return (
    <main className={`fixed inset-0 flex items-center justify-center overflow-hidden font-mono p-4 ${isChaos ? 'bg-black' : 'bg-[#0a0a0a]'}`}>
      
      {!isChaos ? (
        /* THE TRAP UI: Fixed for Mobile Screens */
        <motion.div 
          className="w-full max-w-[340px] p-6 bg-[#111] border border-green-500/20 rounded-xl text-left shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center gap-1.5 mb-4">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
            <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full" />
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
          </div>
          <h1 className="text-green-500 text-sm font-bold mb-1 tracking-widest uppercase">Root@Exploit:~/Group</h1>
          <p className="text-gray-500 text-[10px] mb-6 leading-tight">
            Target: <span className="text-green-400 font-bold tracking-tighter">Flix & Clauser_Media_v4</span>
          </p>
          <button
            onClick={() => setIsChaos(true)}
            className="w-full py-3 bg-green-600/10 border border-green-500 text-green-500 text-[10px] font-black tracking-[0.2em] hover:bg-green-500 hover:text-black transition-all active:scale-95 uppercase"
          >
            Execute Script
          </button>
        </motion.div>
      ) : (
        /* THE STATIC CHAOS: Perfectly Readable spam */
        <div className="relative w-full h-full flex flex-col justify-center items-center">
          
          {/* Background Static Spam */}
          <div className="flex flex-col gap-2 w-full opacity-60">
            {insults.concat(insults).map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="text-[10px] md:text-sm font-bold tracking-tighter uppercase whitespace-nowrap"
                style={{
                  color: i % 3 === 0 ? "#00FF00" : i % 3 === 1 ? "#FFFF00" : "#FF0000",
                }}
              >
                &gt; [{Math.random().toString(36).substring(7)}] {text}
              </motion.div>
            ))}
          </div>
          
          {/* Main Center Box - Fixed for Phone Width */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [-1, 1, -1] }}
              transition={{ rotate: { repeat: Infinity, duration: 0.2 } }}
              className="w-full max-w-[300px] bg-red-600 text-white p-4 border-4 border-white shadow-[8px_8px_0px_#000] text-center"
            >
              <h2 className="text-2xl font-black leading-none mb-1">MUH ME LO</h2>
              <p className="text-lg font-black tracking-tighter">CLAUSER & FLIX</p>
            </motion.div>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 bg-yellow-400 text-black px-3 py-1 text-[10px] font-black uppercase border-2 border-black"
            >
                KALE GOTE SPECIALIST DETECTED
            </motion.div>
          </div>
        </div>
      )}

      {/* Retro Scanline Effect */}
      {isChaos && (
        <div className="absolute inset-0 pointer-events-none z-[110] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      )}
    </main>
  );
}