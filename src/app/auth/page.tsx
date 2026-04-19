"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaGoogle, FaDiscord } from "react-icons/fa";
import { toast } from "sonner";
import {
  UnifrakturMaguntia,
  Inter_Tight,
  JetBrains_Mono,
} from "next/font/google";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

const gothic = UnifrakturMaguntia({ weight: ["400"], subsets: ["latin"] });
const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [usernameState, setUsernameState] = useState<"idle" | "checking" | "available" | "taken">("idle");

  useEffect(() => {
    const view = searchParams.get("view");
    const urlUsername = searchParams.get("username");
    if (view === "signup") setMode("signup");
    if (urlUsername) { setUsername(urlUsername); setMode("signup"); }
  }, [searchParams]);

  // Debounced username check
  useEffect(() => {
    if (mode !== "signup" || username.length < 3) { setUsernameState("idle"); return; }
    setUsernameState("checking");
    const t = setTimeout(async () => {
      const { data } = await supabase.from("profiles").select("username").eq("username", username.toLowerCase()).maybeSingle();
      setUsernameState(data ? "taken" : "available");
    }, 500);
    return () => clearTimeout(t);
  }, [username, mode]);

  const oauthLogin = async (provider: "google" | "discord") => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Fill in all fields."); return; }
    if (mode === "signup" && usernameState !== "available") {
      toast.error("Choose an available username."); return;
    }
    setLoading(true);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { toast.error(error.message); setLoading(false); return; }
      if (data.user) {
        await supabase.from("profiles").insert({ id: data.user.id, username: username.toLowerCase(), email });
        toast.success("Welcome to Drixe. Your identity begins now.");
        router.push("/onboarding");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { toast.error(error.message); setLoading(false); return; }
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const isLogin = mode === "login";

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#080808] text-white">

      {/* ── LEFT PANEL: changes based on mode ──────────────────────── */}
      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="login-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:flex w-1/2 relative overflow-hidden items-end justify-start p-14 bg-[#050505]"
          >
            {/* Dark minimal gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0d0d0d] to-black" />
            {/* Corner glow — cold blue */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-900/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/[0.03] blur-[80px] rounded-full" />

            {/* Scanline overlay */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "100% 3px" }}
            />

            {/* Content: sparse + minimal */}
            <div className="relative z-10 space-y-3">
              <p className={cn("text-[9px] tracking-[0.5em] uppercase text-white/20", mono.className)}>
                drixe.lol
              </p>
              <h2 className={cn("text-7xl text-white/90 leading-none", gothic.className)}>Drixe</h2>
              <p className={cn("text-xs text-white/25 tracking-[0.25em] uppercase", inter.className)}>
                Your signal. Your presence.
              </p>

              {/* Floating stat badges */}
              <div className="flex gap-3 pt-6">
                {["LIVE PRESENCE", "REAL-TIME IDENTITY", "CROSS-PLATFORM"].map((s) => (
                  <span key={s} className={cn("text-[7px] tracking-[0.3em] uppercase text-white/15 border border-white/5 px-2 py-1", mono.className)}>{s}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="signup-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center bg-[#050505]"
          >
            {/* Signup: warmer, more chaotic, energetic */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0c0a14] via-[#080808] to-black" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/15 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-900/10 blur-[80px] rounded-full" />

            {/* Grid texture */}
            <div className="absolute inset-0 opacity-[0.025]"
              style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "50px 50px" }}
            />

            <div className="relative z-10 text-center space-y-4 p-12">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className={cn("text-8xl text-white leading-none mb-2", gothic.className)}>
                  Drixe
                </h2>
                <p className={cn("text-[10px] tracking-[0.5em] uppercase text-white/30", inter.className)}>
                  Create your identity
                </p>
              </motion.div>

              {/* Animated dots */}
              <div className="flex justify-center gap-2 pt-4">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                    className="w-1 h-1 rounded-full bg-purple-400"
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-8 max-w-xs mx-auto">
                {["Discord Presence", "Spotify Live", "Twitch LIVE", "Custom Themes"].map((f) => (
                  <div key={f} className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    <span className={cn("text-[9px] text-white/40", mono.className)}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── RIGHT PANEL: Form ──────────────────────────────────────── */}
      <div className={cn("w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative", isLogin ? "bg-[#080808]" : "bg-[#070712]")}>

        {/* Mode toggle top-right */}
        <div className="absolute top-8 right-8 flex items-center gap-1 bg-white/[0.04] border border-white/[0.07] rounded-full p-1">
          {(["login", "signup"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300",
                mode === m ? "bg-white text-black" : "text-white/30 hover:text-white"
              )}
            >
              {m === "login" ? "Login" : "Sign Up"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-[380px] space-y-8"
          >
            {/* Header */}
            <div className="space-y-2">
              {isLogin ? (
                <>
                  <h1 className={cn("text-4xl text-white leading-none", gothic.className)}>Welcome Back</h1>
                  <p className={cn("text-xs text-white/30 tracking-wider", inter.className)}>
                    Sign in to your Drixe identity
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    <span className={cn("text-[9px] tracking-[0.4em] uppercase text-purple-400/70", mono.className)}>New Identity</span>
                  </div>
                  <h1 className={cn("text-4xl text-white leading-none", gothic.className)}>Join the Ritual</h1>
                  <p className={cn("text-xs text-white/30 tracking-wider", inter.className)}>
                    Claim your living profile on Drixe
                  </p>
                </>
              )}
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => oauthLogin("google")}
                className="w-full flex items-center justify-center gap-3 bg-white text-black py-3.5 rounded-xl font-bold hover:bg-zinc-100 transition-all active:scale-[0.98] text-xs uppercase tracking-wider"
              >
                <FaGoogle size={14} />
                Continue with Google
              </button>

              <button
                onClick={() => oauthLogin("discord")}
                className="w-full flex items-center justify-center gap-3 bg-[#5865F2] text-white py-3.5 rounded-xl font-bold hover:bg-[#4752c4] transition-all active:scale-[0.98] text-xs uppercase tracking-wider"
              >
                <FaDiscord size={16} />
                Continue with Discord
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center">
              <div className="flex-1 h-px bg-white/[0.08]" />
              <span className={cn("px-4 text-[9px] uppercase tracking-[0.3em] text-white/20", mono.className)}>or email</span>
              <div className="flex-1 h-px bg-white/[0.08]" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <div className={cn(
                    "flex items-center border-b-2 pb-2 transition-colors duration-300",
                    usernameState === "available" ? "border-green-500" :
                    usernameState === "taken" ? "border-red-400" :
                    "border-white/[0.12]"
                  )}>
                    <span className={cn("text-white/30 text-sm flex-shrink-0", mono.className)}>@</span>
                    <input
                      type="text"
                      placeholder="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                      maxLength={24}
                      className={cn("flex-1 px-2 bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none", mono.className)}
                    />
                    {usernameState === "checking" && <Loader2 size={12} className="animate-spin text-white/30 flex-shrink-0" />}
                    {usernameState === "available" && <span className="text-green-500 text-sm flex-shrink-0">✓</span>}
                    {usernameState === "taken" && <span className="text-red-400 text-sm flex-shrink-0">✗</span>}
                  </div>
                  {usernameState === "taken" && <p className="text-[9px] text-red-400">Username taken — try another</p>}
                  {usernameState === "available" && <p className="text-[9px] text-green-500">Available!</p>}
                </div>
              )}

              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={cn(
                  "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors",
                  inter.className
                )}
              />

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={cn(
                    "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 pr-11 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-colors",
                    inter.className
                  )}
                />
                <button type="button" onClick={() => setShowPass((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || (!isLogin && usernameState !== "available")}
                className={cn(
                  "w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2",
                  isLogin
                    ? "bg-white text-black hover:bg-zinc-100"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500"
                )}
              >
                {loading
                  ? <><Loader2 size={14} className="animate-spin" /> Processing...</>
                  : isLogin
                    ? <><ArrowRight size={14} /> Sign In</>
                    : <><ArrowRight size={14} /> Create Identity</>
                }
              </button>
            </form>

            {/* Switch mode */}
            <p className={cn("text-center text-[10px] text-white/20", inter.className)}>
              {isLogin ? "No account?" : "Already have one?"}{" "}
              <button
                onClick={() => setMode(isLogin ? "signup" : "login")}
                className="text-white/50 hover:text-white underline underline-offset-2 transition-colors"
              >
                {isLogin ? "Sign up free" : "Sign in"}
              </button>
            </p>

            <p className="text-center text-[8px] text-white/10 leading-relaxed">
              By continuing, you agree to our Terms and Privacy Policy.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}