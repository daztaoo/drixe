"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        router.push("/auth");
        return;
      }

      // Check if this user already has a profile (returning user vs new user)
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        // Returning user → go straight to dashboard
        router.push("/dashboard");
      } else {
        // First-time OAuth user → must complete onboarding (pick username, display name)
        router.push("/onboarding");
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      <p className="text-xs tracking-[0.3em] uppercase text-white/40 font-mono">
        Authenticating...
      </p>
    </div>
  );
}