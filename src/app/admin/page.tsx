"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "700", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        setError("Access denied. Invalid credentials.");
      }
    } catch {
      setError("Connection error.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "40px 40px" }}
      />
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl mb-4">
            <ShieldCheck size={24} className="text-red-400" />
          </div>
          <h1 className={cn("text-2xl font-black text-white", inter.className)}>Drixe Admin</h1>
          <p className="text-white/30 text-xs mt-1">Restricted access. Authorized personnel only.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              autoFocus
              className={cn(
                "w-full pl-10 pr-10 py-4 bg-[#0f0f0f] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/40 transition-colors",
                mono.className
              )}
            />
            <button type="button" onClick={() => setShow((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
              {show ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {error && (
            <div className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <><ShieldCheck size={14} /> Enter Admin</>
            )}
          </button>
        </form>

        <p className="text-center text-[10px] text-white/15 mt-8">Unauthorized access attempts are logged.</p>
      </div>
    </div>
  );
}
