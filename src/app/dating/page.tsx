"use client";
import { useState, useMemo, useEffect } from "react";
import { Heart, ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase"; // <--- IMPORT THIS

// Components
import ProgressBar from "@/components/onboarding/ProgressBar";
import StepBasicInfo from "@/components/onboarding/StepBasicInfo";
import StepLocation from "@/components/onboarding/StepLocation";
import StepInterests from "@/components/onboarding/StepInterests";
import StepBio from "@/components/onboarding/StepBio";
import ShimmerButton from "@/components/onboarding/ShimmerButton";

const AmbientBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 z-0">
      <img 
        src="https://i.pinimg.com/736x/25/f5/1d/25f51dd0f5fedd4a9f141db60004d3a2.jpg" 
        className="w-full h-full object-cover opacity-90"
        alt="Background"
      />
      <div className="absolute inset-0 bg-stone-950/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
    </div>
    {/* CSS Particles */}
    <div className="particles-container absolute inset-0 z-[1]">
      {[...Array(15)].map((_, i) => (
        <div 
          key={i} 
          className="absolute rounded-full bg-white/10 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            animationDuration: `${Math.random() * 10 + 10}s`,
            animationDelay: `-${Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  </div>
);

const TOTAL_STEPS = 4;

const Index = () => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  
  // --- DATABASE STATE ---
  const [dbId, setDbId] = useState<string | null>(null); // Stores the Row UUID
  const [isSaving, setIsSaving] = useState(false);

  const [basicInfo, setBasicInfo] = useState({ name: "", age: "", gender: "",contact: "" });
  const [location, setLocation] = useState({ area: "", lookingFor: "" });
  const [interests, setInterests] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [completed, setCompleted] = useState(false);

  const isStepValid = useMemo(() => {
    switch (step) {
      case 0: return basicInfo.name.length > 1 && parseInt(basicInfo.age) >= 13 && !!basicInfo.gender && basicInfo.contact.length > 3; // <--- ADD THIS CHECK;
      case 1: return !!location.area && !!location.lookingFor;
      case 2: return interests.length >= 2;
      case 3: return bio.length >= 10;
      default: return false;
    }
  }, [step, basicInfo, location, interests, bio]);

  // --- THE LOGGING FUNCTION ---
  const saveProgress = async (nextStepIndex: number) => {
    setIsSaving(true);
    
    // Prepare the payload (what we send to DB)
    const payload = {
      name: basicInfo.name,
      age: basicInfo.age,
      gender: basicInfo.gender,
      area: location.area,
      looking_for: location.lookingFor,
      contact: basicInfo.contact, // <--- ADD THIS LINE!
      interests: interests,
      bio: bio,
      last_completed_step: step,
      updated_at: new Date().toISOString()
    };

    try {
      if (!dbId) {
        // FIRST SAVE: Create a new row
        const { data, error } = await supabase
          .from('temp_onboarding')
          .insert([payload])
          .select()
          .single();
          
        if (data) {
          setDbId(data.id); // Save the ID so next time we UPDATE instead of INSERT
          console.log("Draft created:", data.id);
        }
      } else {
        // SUBSEQUENT SAVES: Update existing row
        const { error } = await supabase
          .from('temp_onboarding')
          .update(payload)
          .eq('id', dbId);
          
        if (!error) console.log("Draft updated");
      }
    } catch (err) {
      console.error("Auto-save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const paginate = (newDirection: number) => {
    if (newDirection > 0 && !isStepValid) return;

    // Trigger Save in Background (Don't await it, so UI stays fast)
    if (newDirection > 0) {
      saveProgress(step + 1);
    }

    setDirection(newDirection);
    setStep((prev) => prev + newDirection);
  };

  const handleComplete = async () => {
    if (isStepValid) {
      // Final Save with 'is_completed' flag
      if (dbId) {
        await supabase
          .from('temp_onboarding')
          .update({ 
            bio: bio, 
            is_completed: true,
            last_completed_step: 4 
          })
          .eq('id', dbId);
      }
      setCompleted(true);
    }
  };
const INSTA_LINK = "https://instagram.com/daztaoo"
  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-black">
        <AmbientBackground />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="glass-card p-8 md:p-12 max-w-sm w-full text-center relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[2.5rem]"
        >
          {/* 1. Success Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mx-auto border border-green-500/30 mb-6 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <Check className="text-green-400 w-8 h-8" strokeWidth={4} />
          </div>

          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            You're on the list!
          </h1>
          <p className="text-white/60 text-sm mb-8 px-2">
            While we find your matches in {location.area}, level up your dating game.
          </p>

          {/* 2. The "Ad" Section */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6 hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#ff4d6d]" />
              <span className="text-xs font-bold text-[#ff4d6d] uppercase tracking-widest">
                Jammu Trend
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              Smart Social Keychains
            </h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Tap to share your Insta instantly. No more spelling out your username. The ultimate flex.
            </p>
          </div>

          {/* 3. The CTA Button */}
          <ShimmerButton 
            className="w-full shadow-[0_0_30px_rgba(255,77,109,0.4)]"
            onClick={() => window.open(INSTA_LINK, '_blank')}
          >
            <span className="flex items-center gap-2">
              Check it out <ArrowRight size={18} />
            </span>
          </ShimmerButton>
          
          <p className="mt-6 text-[10px] text-white/30 uppercase tracking-widest">
            Drixe Studio Originals
          </p>
        </motion.div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6 relative overflow-hidden bg-black font-sans">
      <AmbientBackground />

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
          <Heart className="w-5 h-5 text-[#ff4d6d] fill-[#ff4d6d]" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight drop-shadow-md">
          Jammu Hearts
        </span>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="glass-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
          <div className="pt-8 px-8 md:px-10 pb-0">
            <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />
          </div>

          <div className="p-8 md:p-10 min-h-[420px] flex flex-col justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -20 : 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full"
              >
                {step === 0 && <StepBasicInfo data={basicInfo} onChange={setBasicInfo} />}
                {step === 1 && <StepLocation data={location} onChange={setLocation} />}
                {step === 2 && <StepInterests data={interests} onChange={setInterests} />}
                {step === 3 && <StepBio data={bio} onChange={setBio} />}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="p-6 bg-white/5 border-t border-white/10 flex gap-3">
            {step > 0 && (
              <button
                onClick={() => paginate(-1)}
                className="px-6 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-all active:scale-95"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            
            <ShimmerButton
              className="w-full"
              onClick={() => step < TOTAL_STEPS - 1 ? paginate(1) : handleComplete()}
              disabled={!isStepValid}
            >
              {step < TOTAL_STEPS - 1 ? (
                <span className="flex items-center gap-2">
                  {isSaving ? "Saving..." : "Continue"} <ArrowRight size={18} />
                </span>
              ) : (
                <span className="flex items-center gap-2">Finish Setup <Sparkles size={18} /></span>
              )}
            </ShimmerButton>
          </div>
        </div>
      </div>
      
      {/* Debug Indicator (Optional - shows data saving status) */}
      <div className="fixed bottom-4 right-4 z-50">
        {isSaving && (
          <div className="flex items-center gap-2 bg-black/80 px-3 py-1 rounded-full border border-white/10">
            <div className="w-2 h-2 bg-[#ff4d6d] rounded-full animate-pulse" />
            <span className="text-[10px] text-white/60 font-mono">SYNCING DB...</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default Index;