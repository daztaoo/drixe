"use client";
import { Heart, User, Calendar, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

interface StepBasicInfoProps {
  // Added 'contact' to the data interface
  data: { name: string; age: string; gender: string; contact: string };
  onChange: (data: { name: string; age: string; gender: string; contact: string }) => void;
}

const genderOptions = [
  { label: "Woman", emoji: "👩" },
  { label: "Man", emoji: "👨" },
  { label: "Non-binary", emoji: "✨" },
];

const StepBasicInfo = ({ data, onChange }: StepBasicInfoProps) => {
  return (
    <div className="animate-step-in space-y-8">
      {/* 1. Header Section */}
      <div className="text-center space-y-3">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }} 
          transition={{ repeat: Infinity, duration: 3 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl mb-2"
        >
          <Heart className="w-7 h-7 text-white" fill="#ff4d6d" />
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-sm">
          Let's start with <span className="italic">you</span>
        </h2>
        <p className="text-white/60 font-medium text-sm max-w-[280px] mx-auto tracking-wide">
          Your profile is your vibe. Tell us the basics.
        </p>
      </div>

      <div className="space-y-5">
        
        {/* 2. Name Input */}
        <div className="space-y-2 group">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">The Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#ff4d6d] transition-colors" />
            <input
              type="text"
              placeholder="e.g. Aarav or Priya"
              value={data.name}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-[#ff4d6d]/40 focus:border-[#ff4d6d]/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-md shadow-inner"
            />
          </div>
        </div>

        {/* 3. NEW: Contact Input (Phone / Insta / Snap) */}
        <div className="space-y-2 group">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">Social / Contact</label>
          <div className="relative">
            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#ff4d6d] transition-colors" />
            <input
              type="text"
              placeholder="Insta ID, Snap, or Phone"
              value={data.contact}
              onChange={(e) => onChange({ ...data, contact: e.target.value })}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-[#ff4d6d]/40 focus:border-[#ff4d6d]/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-md shadow-inner"
            />
          </div>
        </div>

        {/* 4. Age Input */}
        <div className="space-y-2 group">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">Your Age</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#ff4d6d] transition-colors" />
            <input
              type="number"
              placeholder="18"
              min={13}
              max={50}
              value={data.age}
              onChange={(e) => onChange({ ...data, age: e.target.value })}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-[#ff4d6d]/40 focus:border-[#ff4d6d]/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-md shadow-inner"
            />
          </div>
        </div>

        {/* 5. Gender Selection */}
        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1 block">Identity</label>
          <div className="grid grid-cols-3 gap-3">
            {genderOptions.map((g) => {
              const isActive = data.gender === g.label;
              return (
                <button
                  key={g.label}
                  onClick={() => onChange({ ...data, gender: g.label })}
                  className={`
                    relative py-4 rounded-2xl border flex flex-col items-center gap-1 transition-all duration-300
                    ${isActive 
                      ? "bg-white text-[#2D1F1D] border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-[1.05]" 
                      : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                    }
                  `}
                >
                  <span className={`text-xl transition-transform ${isActive ? "scale-110" : "grayscale opacity-50"}`}>
                    {g.emoji}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {g.label}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab" 
                      className="absolute inset-0 bg-white rounded-2xl -z-10" 
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StepBasicInfo;