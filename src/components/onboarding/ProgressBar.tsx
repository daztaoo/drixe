"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = ["About You", "Location", "Vibes", "Bio"];

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  return (
    <div className="w-full py-4">
      {/* Container for the steps */}
      <div className="flex items-start justify-between relative">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isCompleted = i < currentStep;
          const isActive = i === currentStep;

          return (
            <div key={i} className="flex-1 group relative">
              <div className="flex flex-col items-center gap-3">
                
                {/* 1. THE BAR */}
                <div className="relative w-full px-1">
                  {/* Track Background */}
                  <div className="h-[3px] w-full bg-white/10 rounded-full overflow-hidden">
                    {/* Active Fill with Framer Motion */}
                    <motion.div
                      initial={false}
                      animate={{ 
                        width: isCompleted || isActive ? "100%" : "0%",
                        backgroundColor: isCompleted ? "rgba(255,255,255,0.4)" : "#ff4d6d"
                      }}
                      transition={{ duration: 0.6, ease: "circOut" }}
                      className="h-full rounded-full"
                      style={{ 
                        boxShadow: isActive ? "0 0 12px #ff4d6d" : "none" 
                      }}
                    />
                  </div>
                </div>

                {/* 2. THE LABEL */}
                <div className="flex flex-col items-center gap-1.5">
                  {/* Step Indicator Dot (Hinge Style) */}
                  <motion.div 
                    animate={{
                      scale: isActive ? 1.2 : 1,
                      backgroundColor: isActive ? "#ff4d6d" : isCompleted ? "#ffffff" : "rgba(255,255,255,0.1)"
                    }}
                    className="w-1.5 h-1.5 rounded-full transition-colors"
                  />
                  
                  <span
                    className={`text-[9px] font-bold tracking-[0.15em] uppercase transition-all duration-500 ${
                      isActive 
                        ? "text-white opacity-100 translate-y-0" 
                        : isCompleted 
                        ? "text-white/60 translate-y-0" 
                        : "text-white/20 translate-y-1"
                    }`}
                  >
                    {isCompleted ? (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1">
                         <Check size={8} strokeWidth={4} /> {stepLabels[i]}
                      </motion.span>
                    ) : (
                      stepLabels[i]
                    )}
                  </span>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;