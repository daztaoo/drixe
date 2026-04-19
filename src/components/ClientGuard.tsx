"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface ClientGuardProps {
  children: React.ReactNode;
  /** Where to redirect if not authenticated. Defaults to /auth */
  redirectTo?: string;
}

/**
 * Wrap any page/layout that requires authentication.
 * Renders a full-screen spinner while checking session,
 * then either shows children (authenticated) or redirects (not authenticated).
 *
 * Usage:
 *   export default function DashboardLayout({ children }) {
 *     return <ClientGuard>{children}</ClientGuard>;
 *   }
 */
export function ClientGuard({ children, redirectTo = "/auth" }: ClientGuardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "authenticated" | "unauthenticated">("checking");

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setStatus("authenticated");
      } else {
        setStatus("unauthenticated");
        router.replace(redirectTo);
      }
    };
    check();

    // Also watch for session changes (e.g. token expiry)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setStatus("unauthenticated");
        router.replace(redirectTo);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, redirectTo]);

  if (status === "checking" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <div className="w-5 h-5 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
        <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 font-mono">
          {status === "checking" ? "Verifying session..." : "Redirecting..."}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
