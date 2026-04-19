"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  UnifrakturMaguntia,
  Cinzel_Decorative,
  Inter_Tight,
  JetBrains_Mono,
} from "next/font/google";
import {
  Fingerprint, User, ChevronRight, AlertCircle,
  Check, ArrowUpRight, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const blackletter = UnifrakturMaguntia({ weight: ["400"], subsets: ["latin"] });
const cinzel = Cinzel_Decorative({ weight: ["400", "700"], subsets: ["latin"] });
const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

// Step 1 → 2 → 3 (done)
export default function Onboarding() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");

  // Pre-fill from OAuth metadata
  useEffect(() => {
    const checkStatus = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { router.push("/auth"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", authUser.id)
        .single();

      if (profile) { router.push("/dashboard"); return; }

      setUser(authUser);

      // Pre-fill displayName from OAuth metadata
      const suggested = authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        authUser.user_metadata?.user_name || "";
      if (suggested) setDisplayName(suggested.slice(0, 40));

      setAuthChecking(false);
    };
    checkStatus();
  }, [router]);

  const validateUsername = async () => {
    const cleaned = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (cleaned.length < 3) { setError("Must be at least 3 characters."); return; }
    if (cleaned.length > 24) { setError("Must be 24 characters or less."); return; }
    setLoading(true); setError(null);
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", cleaned)
      .maybeSingle();
    setLoading(false);
    if (data) { setError("Identity occupied. Try another."); return; }
    setUsername(cleaned);
    setStep(2);
  };

  const finalizeProfile = async () => {
    setLoading(true);
    const { error: dbError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      username: username.toLowerCase(),
      full_name: displayName.trim() || username,
    });

    if (dbError) {
      toast.error(dbError.message);
      setLoading(false);
    } else {
      setStep(3); // Show celebration
      setLoading(false);
    }
  };

  if (authChecking) return null;

  const totalSteps = 2;
  const progress = ((step - 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row overflow-hidden selection:bg-white selection:text-black">

      {/* LEFT: FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-12 border-r border-white/5 relative bg-[#050505] z-10">
        <div className="max-w-md w-full mx-auto space-y-10">

          {/* Progress bar */}
          {step < 3 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={cn("text-[10px] tracking-[0.35em] uppercase text-white/30", cinzel.className)}>
                  Step {step} / {totalSteps}
                </span>
                <span className={cn("text-[10px] text-white/20", mono.className)}>Drixe</span>
              </div>
              <div className="h-px w-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-white"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          {/* Title */}
          {step < 3 && (
            <motion.h1
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("text-4xl md:text-5xl text-white leading-[0.9]", blackletter.className)}
            >
              {step === 1 ? "Claim Your" : "Define Your"}{" "}
              <br />
              <span className="text-white/40">
                {step === 1 ? "Digital Handle." : "Public Persona."}
              </span>
            </motion.h1>
          )}

          {/* Steps */}
          <div className="space-y-8 min-h-[280px]">
            <AnimatePresence mode="wait">

              {/* STEP 1: USERNAME */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <label className={cn("text-xs uppercase tracking-widest text-white/40 flex items-center gap-2", inter.className)}>
                      <Fingerprint size={14} /> Desired Handle
                    </label>
                    <input
                      value={username}
                      onChange={(e) => { setUsername(e.target.value.replace(/\s/g, "").toLowerCase()); setError(null); }}
                      onKeyDown={(e) => e.key === "Enter" && validateUsername()}
                      autoFocus
                      placeholder="username"
                      maxLength={24}
                      className={cn(
                        "w-full bg-transparent border-b py-4 text-3xl focus:outline-none transition-all placeholder:text-white/10 font-bold tracking-tight",
                        error ? "border-red-500 text-red-400" : "border-white/10 focus:border-white text-white",
                        mono.className
                      )}
                    />
                    {error && (
                      <p className="text-red-400 text-[10px] uppercase tracking-widest font-bold flex gap-2 items-center">
                        <AlertCircle size={11} /> {error}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={validateUsername}
                    disabled={loading || !username}
                    className="group w-full h-14 bg-white text-black rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all disabled:opacity-50 text-sm"
                  >
                    {loading ? "Checking..." : "Check Availability"}
                    {!loading && <ChevronRight size={16} />}
                  </button>
                </motion.div>
              )}

              {/* STEP 2: DISPLAY NAME */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <label className={cn("text-xs uppercase tracking-widest text-white/40 flex items-center gap-2", inter.className)}>
                      <User size={14} /> Display Name
                    </label>
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && finalizeProfile()}
                      autoFocus
                      placeholder="e.g. The Architect"
                      maxLength={40}
                      className={cn(
                        "w-full bg-transparent border-b border-white/10 py-4 text-3xl focus:outline-none focus:border-white transition-all placeholder:text-white/10 text-white font-bold",
                        inter.className
                      )}
                    />
                    <p className="text-[10px] text-white/20">Optional. You can always change this later.</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="w-1/3 h-14 border border-white/10 text-white/40 rounded-lg font-bold uppercase tracking-widest hover:text-white hover:border-white/30 transition-all text-[10px]"
                    >
                      Back
                    </button>
                    <button
                      onClick={finalizeProfile}
                      disabled={loading}
                      className="flex-1 h-14 bg-white text-black rounded-lg font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                      {loading ? "Creating..." : "Launch Profile"}
                      {!loading && <Zap size={15} />}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: CELEBRATION */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8 text-center"
                >
                  {/* Glow circle */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                        <Check size={32} className="text-green-400" />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-green-500/20 blur-xl animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h1 className={cn("text-4xl text-white", blackletter.className)}>
                      You&apos;re live.
                    </h1>
                    <p className={cn("text-white/40 text-sm", inter.className)}>
                      Welcome to Drixe, <span className="text-white font-bold">@{username}</span>
                    </p>
                  </div>

                  <div className="space-y-3 text-left bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                    <p className={cn("text-[10px] uppercase tracking-widest text-white/30 font-bold", inter.className)}>
                      What's next
                    </p>
                    {[
                      { label: "Add your links", href: "/dashboard/links", desc: "Build your link stack" },
                      { label: "Connect integrations", href: "/dashboard/integrations", desc: "Discord, Spotify, Twitch" },
                      { label: "Pick a theme", href: "/dashboard/templates", desc: "5 beautiful themes" },
                    ].map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all group"
                      >
                        <div>
                          <p className={cn("text-sm font-bold text-white", inter.className)}>{item.label}</p>
                          <p className="text-[10px] text-white/30 mt-0.5">{item.desc}</p>
                        </div>
                        <ChevronRight size={14} className="text-white/20 group-hover:text-white transition-colors" />
                      </a>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`/${username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-12 border border-white/20 text-white rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 text-xs hover:border-white/40 transition-all"
                    >
                      <ArrowUpRight size={14} /> View Profile
                    </a>
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="flex-1 h-12 bg-white text-black rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 text-xs hover:bg-zinc-200 transition-all"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* RIGHT: LIVE PREVIEW CARD */}
      <div className="hidden lg:flex w-1/2 bg-[#080808] items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] blur-[120px] rounded-full pointer-events-none"
          animate={{ background: step === 3 ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.04)" }}
          transition={{ duration: 1 }}
        />

        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-[360px] border border-white/10 bg-black/60 backdrop-blur-2xl p-10 flex flex-col justify-between shadow-2xl"
          style={{ height: 500 }}
        >
          {/* Corner accents */}
          {[
            "absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20",
            "absolute top-0 right-0 w-8 h-8 border-t border-r border-white/20",
            "absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/20",
            "absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20",
          ].map((cls, i) => <div key={i} className={cls} />)}

          {/* Card content */}
          <div className="space-y-8">
            <div className="text-right space-y-1">
              <p className={cn("text-[10px] tracking-[0.3em] uppercase text-white/30", mono.className)}>Status</p>
              <motion.p
                className={cn("text-xl", cinzel.className)}
                animate={{ color: step === 3 ? "#4ade80" : "#ffffff" }}
                transition={{ duration: 0.5 }}
              >
                {step === 3 ? "ACTIVE" : step >= 2 ? "CONFIGURING" : "PENDING"}
              </motion.p>
            </div>

            <div className="space-y-2">
              <p className={cn("text-[10px] tracking-[0.3em] uppercase text-white/30", mono.className)}>Identity</p>
              <motion.p
                key={displayName}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className={cn("text-4xl text-white truncate leading-none pt-2", blackletter.className)}
              >
                {displayName || "Unknown"}
              </motion.p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="space-y-2">
              <p className={cn("text-[9px] tracking-[0.2em] uppercase text-white/30", mono.className)}>Handle</p>
              <p className={cn("text-lg", error ? "text-red-400 line-through" : "text-white/80", mono.className)}>
                @{username || "..."}
              </p>
            </div>

            {/* Step progress dots */}
            <div className="flex justify-between items-end">
              <p className={cn("text-[10px] text-white/30", mono.className)}>
                {step === 3 ? "PROFILE: LIVE" : "SETUP: IN PROGRESS"}
              </p>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-6"
                    animate={{
                      background: step >= i
                        ? step === 3 ? "#4ade80" : "#ffffff"
                        : "rgba(255,255,255,0.1)"
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}