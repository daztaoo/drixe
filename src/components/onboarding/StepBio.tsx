"use client";
import { Pen, Sparkles, Quote, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface StepBioProps {
  data: string;
  onChange: (data: string) => void;
}

const prompts = [
  "My ideal Sunday in Jammu...",
  "Best Kalari Kulcha spot is...",
  "I'm the kind of person who...",
  "Unpopular opinion about Tawi...",
];

const StepBio = ({ data, onChange }: StepBioProps) => {
  // Calculate progress color based on length
  const progressColor = 
    data.length > 250 ? "bg-red-400" : 
    data.length > 150 ? "bg-amber-400" : 
    "bg-[#ff4d6d]";

  return (
    <div className="animate-step-in space-y-8">
      
      {/* 1. Header */}
      <div className="text-center space-y-3">
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl mb-2"
        >
          <Pen className="w-7 h-7 text-white" />
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-sm">
          Your <span className="italic text-[#ff4d6d]">Vibe</span> Check
        </h2>
        <p className="text-white/60 font-medium text-sm max-w-[280px] mx-auto tracking-wide">
          Don't overthink it. Just be you.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* 2. The Glass Canvas (Textarea) */}
        <div className="relative group">
          <div className="absolute left-5 top-5 pointer-events-none">
            <Quote className="w-5 h-5 text-white/20 group-focus-within:text-[#ff4d6d] transition-colors duration-500" />
          </div>
          
          <textarea
            value={data}
            onChange={(e) => onChange(e.target.value)}
            placeholder="I love long drives to Sidhra..."
            rows={5}
            maxLength={300}
            className="w-full pl-14 pr-6 py-5 rounded-3xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-[#ff4d6d]/40 focus:border-[#ff4d6d]/50 focus:bg-white/10 transition-all duration-300 backdrop-blur-md shadow-inner resize-none leading-relaxed"
          />
          
          {/* Character Count & Progress Bar */}
          <div className="absolute bottom-4 right-6 flex items-center gap-3">
             <div className="h-1 w-16 bg-white/10 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(data.length / 300) * 100}%` }}
                 className={`h-full rounded-full ${progressColor} shadow-[0_0_10px_currentColor]`}
               />
             </div>
             <span className="text-[10px] font-bold text-white/40 tracking-widest">
               {data.length}/300
             </span>
          </div>
        </div>

        {/* 3. Conversation Starters */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white/50 px-2">
            <Sparkles className="w-3 h-3" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Inspiration</span>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {prompts.map((prompt, i) => (
              <motion.button
                key={prompt}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChange(prompt + " ")}
                className="group relative w-full text-left px-5 py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-between"
              >
                <span className="text-sm text-white/80 font-medium italic group-hover:text-white transition-colors">
                  "{prompt}"
                </span>
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#ff4d6d] transition-colors">
                   <MessageCircle className="w-3 h-3 text-white/50 group-hover:text-white" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StepBio;