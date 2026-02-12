"use client";
import { useState } from "react";
import { MapPin, Search, ChevronDown, Check, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StepLocationProps {
  data: { area: string; lookingFor: string };
  onChange: (data: { area: string; lookingFor: string }) => void;
}

const jammuAreas = {
  "Central Jammu": ["Gandhi Nagar", "Kachi Chawni", "Residency Road", "Raghunath Bazaar", "Rani Park", "City Chowk"],
  "North Jammu": ["Trikuta Nagar", "Bakshi Nagar", "Nanak Nagar", "Shastri Nagar", "Gangyal", "Roop Nagar"],
  "South Jammu": ["Janipur", "Sainik Colony", "Channi Himmat", "Bantalab", "Paloura", "Sarwal"],
  "East Jammu": ["Sidhra", "Nagrota", "Kunjwani", "Bari Brahmana", "Satwari"],
  "Heritage": ["Bahu Fort", "Mubarak Mandi", "Amar Mahal", "Peer Kho"],
  "Nearby": ["Miran Sahib", "Talab Tillo", "Akhnoor", "Katra", "Udhampur", "Patnitop"]
};

const lookingForOptions = [
  { label: "Something serious", emoji: "💕", desc: "Long-term connection" },
  { label: "Casual dating", emoji: "✨", desc: "Fun & vibes" },
  { label: "New friends", emoji: "🤝", desc: "Expand your circle" },
  { label: "Let's see", emoji: "🌊", desc: "Go with the flow" },
];

const StepLocation = ({ data, onChange }: StepLocationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Helper to filter areas based on search
  const filteredAreas = Object.entries(jammuAreas).reduce((acc, [group, areas]) => {
    const filtered = areas.filter(a => a.toLowerCase().includes(search.toLowerCase()));
    if (filtered.length > 0) acc[group] = filtered;
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="animate-step-in space-y-8">
      
      {/* 1. Header */}
      <div className="text-center space-y-3">
        <motion.div 
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl mb-2"
        >
          <MapPin className="w-7 h-7 text-white" fill="#ff4d6d" />
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-sm">
          Where in <span className="italic text-[#ff4d6d]">Jammu?</span>
        </h2>
        <p className="text-white/60 font-medium text-sm max-w-xs mx-auto tracking-wide">
          Find your crowd. We'll show you matches nearby.
        </p>
      </div>

      <div className="space-y-6 relative">
        
        {/* 2. CUSTOM GLASS DROPDOWN */}
        <div className="space-y-2 relative z-50">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">Your Locality</label>
          
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`w-full pl-5 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-left flex justify-between items-center transition-all duration-300 backdrop-blur-md ${isOpen ? "ring-2 ring-[#ff4d6d]/40 bg-white/10" : "hover:bg-white/10"}`}
            >
              <span className={`text-base font-medium ${data.area ? "text-white" : "text-white/40"}`}>
                {data.area || "Select your area..."}
              </span>
              <ChevronDown className={`w-5 h-5 text-white/40 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* The Dropdown Menu */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="absolute top-full left-0 right-0 mt-2 p-2 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-h-[300px] overflow-hidden flex flex-col z-50"
                >
                  {/* Search Bar inside Dropdown */}
                  <div className="px-2 pb-2 mb-2 border-b border-white/5 sticky top-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input 
                        autoFocus
                        placeholder="Search area..." 
                        className="w-full pl-9 pr-4 py-3 bg-white/5 rounded-xl text-sm text-white placeholder:text-white/20 outline-none focus:bg-white/10 transition-colors"
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Scrollable List */}
                  <div className="overflow-y-auto pr-1 custom-scrollbar flex-1">
                    {Object.keys(filteredAreas).length === 0 ? (
                      <div className="p-4 text-center text-white/30 text-sm">No area found</div>
                    ) : (
                      Object.entries(filteredAreas).map(([group, areas]) => (
                        <div key={group} className="mb-3">
                          <h4 className="px-3 py-1 text-[10px] font-bold text-[#ff4d6d] uppercase tracking-wider sticky top-0 bg-[#1a1a1a]/90 backdrop-blur-sm z-10">
                            {group}
                          </h4>
                          {areas.map(area => (
                            <button
                              key={area}
                              onClick={() => {
                                onChange({ ...data, area });
                                setIsOpen(false);
                                setSearch("");
                              }}
                              className={`w-full px-3 py-2.5 rounded-lg text-left text-sm flex items-center justify-between transition-colors ${data.area === area ? "bg-[#ff4d6d]/20 text-[#ff4d6d]" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
                            >
                              {area}
                              {data.area === area && <Check className="w-4 h-4" />}
                            </button>
                          ))}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 3. INTENT SELECTOR (Grid Layout) */}
        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">What's the plan?</label>
          <div className="grid grid-cols-1 gap-3">
            {lookingForOptions.map((opt) => {
              const isActive = data.lookingFor === opt.label;
              return (
                <button
                  key={opt.label}
                  onClick={() => onChange({ ...data, lookingFor: opt.label })}
                  className={`
                    relative p-4 rounded-2xl border flex items-center gap-4 transition-all duration-300 group
                    ${isActive 
                      ? "bg-white/10 border-[#ff4d6d]/50 shadow-[0_0_15px_rgba(255,77,109,0.2)]" 
                      : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                    }
                  `}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${isActive ? "bg-[#ff4d6d] scale-110 shadow-lg" : "bg-white/5 group-hover:scale-110"}`}>
                    {opt.emoji}
                  </div>
                  <div className="text-left">
                    <div className={`text-sm font-bold transition-colors ${isActive ? "text-white" : "text-white/80"}`}>
                      {opt.label}
                    </div>
                    <div className="text-xs text-white/40 font-medium">
                      {opt.desc}
                    </div>
                  </div>
                  
                  {/* Subtle checkmark indicator */}
                  {isActive && (
                    <motion.div 
                      layoutId="check"
                      className="absolute right-4 w-6 h-6 rounded-full bg-[#ff4d6d] flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </motion.div>
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

export default StepLocation;