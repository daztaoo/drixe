"use client";
import { Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StepInterestsProps {
  data: string[];
  onChange: (data: string[]) => void;
}

const interests = [
  { label: "Bahu Fort Walks", emoji: "🏰" },
  { label: "Mubarak Mandi", emoji: "🏛️" },
  { label: "Dogri Music", emoji: "🎶" },
  { label: "Temple Hopping", emoji: "🛕" },
  { label: "Street Food", emoji: "🍲" },
  { label: "Katra Trips", emoji: "🚗" },
  { label: "Photography", emoji: "📸" },
  { label: "Chai & Gaps", emoji: "☕" },
  { label: "Bollywood", emoji: "🎬" },
  { label: "Fitness", emoji: "💪" },
  { label: "Shayari", emoji: "📝" },
  { label: "Cooking", emoji: "👨‍🍳" },
  { label: "Gaming", emoji: "🎮" },
  { label: "Trekking", emoji: "⛰️" },
  { label: "Reading", emoji: "📚" },
  { label: "Sketching", emoji: "🎨" },
  { label: "Live Music", emoji: "🎤" },
  { label: "Hustle", emoji: "🚀" },
  { label: "Vaishno Devi", emoji: "🙏" },
  { label: "Shopping", emoji: "🛍️" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03 // This makes them flow in one by one
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: { opacity: 1, y: 0, scale: 1 }
};

const StepInterests = ({ data, onChange }: StepInterestsProps) => {
  const isFull = data.length >= 6;

  const toggle = (interest: string) => {
    if (data.includes(interest)) {
      onChange(data.filter((i) => i !== interest));
    } else if (!isFull) {
      onChange([...data, interest]);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Header with Floating Icon */}
      <div className="text-center space-y-3">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl mb-2"
        >
          <Sparkles className="w-7 h-7 text-white" fill="#FFD700" />
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-sm">
          What <span className="italic text-[#ff4d6d]">excites</span> you?
        </h2>
        <p className="text-white/60 font-medium text-sm max-w-sm mx-auto tracking-wide">
          Pick up to 6 vibes. We'll match you with the right crowd.
        </p>
      </div>

      {/* 2. The Interest Cloud (Staggered Animation) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-3 justify-center"
      >
        {interests.map((item) => {
          const selected = data.includes(item.label);
          const disabled = isFull && !selected;

          return (
            <motion.button
              key={item.label}
              variants={itemVariants}
              whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
              whileTap={!disabled ? { scale: 0.95 } : {}}
              onClick={() => toggle(item.label)}
              className={`
                relative px-5 py-3 rounded-full border text-sm font-bold flex items-center gap-2 transition-all duration-300
                ${selected
                  ? "bg-[#ff4d6d] border-[#ff4d6d] text-white shadow-[0_0_15px_rgba(255,77,109,0.4)] z-10"
                  : disabled
                  ? "bg-white/5 border-white/5 text-white/20 cursor-not-allowed blur-[0.5px]"
                  : "bg-white/10 border-white/10 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm"
                }
              `}
            >
              <span className={`text-base ${selected ? "grayscale-0" : disabled ? "grayscale opacity-50" : ""}`}>
                {item.emoji}
              </span>
              {item.label}
              
              {/* Selected Checkmark Indicator */}
              {selected && (
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center"
                >
                  <Sparkles size={10} className="text-[#ff4d6d]" fill="currentColor" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* 3. Dynamic Counter Footer */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-1.5 h-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                height: i < data.length ? 8 : 4,
                width: i < data.length ? 8 : 4,
                backgroundColor: i < data.length ? "#ff4d6d" : "rgba(255,255,255,0.2)"
              }}
              className="rounded-full shadow-[0_0_10px_currentColor]"
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={isFull ? "full" : "counting"}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className={`text-xs font-bold uppercase tracking-[0.2em] ${isFull ? "text-[#ff4d6d]" : "text-white/40"}`}
          >
            {isFull ? "Max Vibes Reached!" : `${data.length} / 6 Selected`}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StepInterests;