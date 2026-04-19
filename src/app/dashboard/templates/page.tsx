"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Check, ExternalLink, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Inter_Tight } from "next/font/google";

const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "600", "800"] });

const TEMPLATES = [
  {
    id: "default",
    name: "Glass",
    premium: false,
    description: "Dark glassmorphism with depth and blur",
    preview: {
      bg: "linear-gradient(135deg, #0d0d0d 0%, #1a0533 100%)",
      card: "rgba(255,255,255,0.06)",
      accent: "#a855f7",
      text: "#fff",
    },
  },
  {
    id: "gothic",
    name: "Gothic",
    premium: false,
    description: "Blackletter aesthetic, deep and mysterious",
    preview: {
      bg: "linear-gradient(180deg, #0a0008 0%, #1a0012 100%)",
      card: "rgba(255,255,255,0.04)",
      accent: "#dc2626",
      text: "#e5d3c8",
    },
  },
  {
    id: "retro",
    name: "Retro",
    premium: false,
    description: "Scanlines and cassette nostalgia vibes",
    preview: {
      bg: "repeating-linear-gradient(0deg, #0d0d0d 0px, #0d0d0d 2px, #141414 2px, #141414 4px)",
      card: "rgba(255,200,0,0.06)",
      accent: "#ffc300",
      text: "#ffc300",
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    premium: false,
    description: "Clean and distraction-free white card",
    preview: {
      bg: "#efefef",
      card: "#fff",
      accent: "#171717",
      text: "#171717",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    premium: true,
    description: "Neon grid, scanlines, dystopian future",
    preview: {
      bg: "linear-gradient(135deg, #00001a 0%, #001a0a 100%)",
      card: "rgba(0,255,200,0.05)",
      accent: "#00ffe0",
      text: "#00ffe0",
    },
  },
];

export default function TemplatesPage() {
  const [profile, setProfile] = useState<any>(null);
  const [activeLayout, setActiveLayout] = useState("default");
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("id, layout_id, username")
        .eq("id", user.id)
        .single();
      if (data) {
        setProfile(data);
        setActiveLayout(data.layout_id || "default");
      }
      setLoading(false);
    };
    load();
  }, []);

  const applyTemplate = async (templateId: string, isPremium: boolean) => {
    if (isPremium) {
      toast.info("Upgrade to Premium to unlock this theme.");
      return;
    }
    if (!profile) return;
    setSaving(templateId);

    const { error } = await supabase
      .from("profiles")
      .update({ layout_id: templateId })
      .eq("id", profile.id);

    if (!error) {
      setActiveLayout(templateId);
      toast.success(`Theme applied!`);
    } else {
      toast.error("Failed to apply theme.");
    }
    setSaving(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-40">
      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className={cn("text-2xl font-bold text-white", inter.className)}>Templates</h2>
          <p className="text-white/40 text-sm mt-1">Choose a visual theme for your public profile.</p>
        </div>
        {profile?.username && (
          <a
            href={`/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-xs text-white/50 hover:text-white hover:border-white/20 transition-all self-start"
          >
            <ExternalLink size={13} /> Preview Profile
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((tpl) => {
          const isActive = activeLayout === tpl.id;
          const isSaving = saving === tpl.id;

          return (
            <div
              key={tpl.id}
              className={cn(
                "group relative rounded-2xl overflow-hidden border transition-all duration-200 cursor-pointer",
                isActive
                  ? "border-white/40 shadow-[0_0_24px_rgba(255,255,255,0.07)]"
                  : "border-white/10 hover:border-white/20",
                tpl.premium && "opacity-80"
              )}
              onClick={() => applyTemplate(tpl.id, tpl.premium)}
            >
              {/* Theme preview canvas */}
              <div className="h-44 w-full p-4 flex flex-col justify-between" style={{ background: tpl.preview.bg }}>
                {/* Avatar + name stub */}
                <div className="flex flex-col items-center gap-2 pt-3">
                  <div
                    className="w-10 h-10 rounded-full border-2"
                    style={{ background: tpl.preview.card, borderColor: tpl.preview.accent + "50", boxShadow: `0 0 10px ${tpl.preview.accent}30` }}
                  />
                  <div className="h-2 w-16 rounded-full" style={{ background: tpl.preview.text, opacity: 0.8 }} />
                  <div className="h-1.5 w-24 rounded-full" style={{ background: tpl.preview.text, opacity: 0.25 }} />
                </div>
                {/* Mini link rows */}
                <div className="space-y-1.5">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-6 w-full rounded-lg flex items-center justify-center"
                      style={{ background: tpl.preview.card, border: `1px solid ${tpl.preview.accent}20` }}
                    >
                      <div className="h-1.5 rounded-full" style={{ width: i === 1 ? "50%" : "38%", background: tpl.preview.text, opacity: 0.55 }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Card info footer */}
              <div className="bg-[#0a0a0a] px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className={cn("text-sm font-bold text-white truncate", inter.className)}>{tpl.name}</p>
                  <p className="text-[10px] text-white/30 mt-0.5 truncate">{tpl.description}</p>
                </div>

                {tpl.premium ? (
                  <span className="flex-shrink-0 flex items-center gap-1 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-bold text-amber-400 uppercase tracking-wide">
                    <Lock size={8} /> Pro
                  </span>
                ) : isActive ? (
                  <span className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[9px] font-bold text-green-400 uppercase">
                    <Check size={9} /> Active
                  </span>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); applyTemplate(tpl.id, tpl.premium); }}
                    disabled={isSaving}
                    className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white/50 hover:text-white hover:bg-white/10 transition-all font-bold uppercase tracking-wide disabled:opacity-50"
                  >
                    {isSaving ? "…" : "Apply"}
                  </button>
                )}
              </div>

              {/* Premium hover lock overlay */}
              {tpl.premium && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Lock size={18} className="text-amber-400" />
                  <p className="text-xs font-bold text-white">Premium Theme</p>
                  <a href="/dashboard/premium" className="text-[10px] text-amber-400 hover:underline">
                    Upgrade to unlock →
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
        <p className="text-xs text-white/30 leading-relaxed">
          💡 Theme changes are instant. Your links, integrations, and content stay the same.
        </p>
      </div>
    </div>
  );
}