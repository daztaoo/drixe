"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2, Save, RotateCcw, Crown, Lock } from "lucide-react";
import { CURSOR_OPTIONS } from "@/components/CustomCursor";
import { PremiumModal } from "@/components/PremiumModal";

const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

// ── Preset themes ────────────────────────────────────────────────────────────
const PRESET_THEMES = [
  { id: "obsidian", label: "Obsidian",  bg: "#080808", card: "#111111", accent: "#a855f7", text: "#ffffff" },
  { id: "abyss",    label: "Abyss",     bg: "#07070f", card: "#0f0f1c", accent: "#6366f1", text: "#e0e0ff" },
  { id: "blood",    label: "Blood",     bg: "#0a0000", card: "#140000", accent: "#ef4444", text: "#ffd0d0" },
  { id: "forest",   label: "Forest",    bg: "#040a04", card: "#0a120a", accent: "#22c55e", text: "#d0ffd0" },
  { id: "ocean",    label: "Ocean",     bg: "#040812", card: "#080f1f", accent: "#3b82f6", text: "#d0e8ff" },
  { id: "gold",     label: "Gold",      bg: "#0a0800", card: "#150f00", accent: "#f59e0b", text: "#fff3d0" },
  { id: "ash",      label: "Ash",       bg: "#0c0c0c", card: "#1a1a1a", accent: "#9ca3af", text: "#e5e5e5" },
  { id: "sakura",   label: "Sakura",    bg: "#0e0009", card: "#180010", accent: "#ec4899", text: "#ffe0f0" },
];

interface Theme { bg: string; card: string; accent: string; text: string; }

export default function CustomizePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [premiumFeature, setPremiumFeature] = useState("");

  // Basic fields
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");

  // Theme
  const [theme, setTheme] = useState<Theme>({ bg: "#080808", card: "#111111", accent: "#a855f7", text: "#ffffff" });

  // Cursor
  const [cursorId, setCursorId] = useState("default");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (data) {
      setProfile(data);
      setIsPremium(!!data.is_premium);
      setFullName(data.full_name || "");
      setBio(data.bio || data.description || "");
      setTheme({
        bg:     data.theme_bg     || "#080808",
        card:   data.theme_card_bg|| "#111111",
        accent: data.theme_accent || "#a855f7",
        text:   data.theme_text   || "#ffffff",
      });
      setCursorId(data.cursor_id || "default");
    }
    setLoading(false);
  };

  const applyPreset = (preset: typeof PRESET_THEMES[0]) => {
    if (!isPremium) { setPremiumFeature("Custom Themes"); setPremiumModalOpen(true); return; }
    setTheme({ bg: preset.bg, card: preset.card, accent: preset.accent, text: preset.text });
  };

  const handleCursorSelect = (id: string) => {
    if (!isPremium && id !== "default") { setPremiumFeature("Custom Cursors"); setPremiumModalOpen(true); return; }
    setCursorId(id);
  };

  const saveAll = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        bio,
        ...(isPremium ? {
          theme_accent: theme.accent,
          theme_bg: theme.bg,
          theme_card_bg: theme.card,
          theme_text: theme.text,
          cursor_id: cursorId,
        } : {}),
      })
      .eq("id", profile.id);

    if (error) toast.error("Failed to save: " + error.message);
    else toast.success("Profile updated!");
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 size={20} className="animate-spin text-white/30" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <PremiumModal
        open={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
        featureName={premiumFeature}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={cn("text-xl font-black text-white", inter.className)}>Customize Profile</h2>
          <p className="text-xs text-white/30 mt-0.5">Control how your identity looks to the world</p>
        </div>
        <button
          onClick={saveAll}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zinc-100 transition-all active:scale-[0.97] disabled:opacity-50"
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          Save
        </button>
      </div>

      {/* Identity Fields */}
      <section className="bg-[#0a0a0a] border border-white/[0.07] rounded-2xl p-6 space-y-5">
        <p className={cn("text-[9px] uppercase tracking-[0.4em] text-white/25", inter.className)}>Identity</p>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Display Name</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name..."
              className={cn(
                "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors",
                inter.className
              )}
            />
          </div>
          <div>
            <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the world who you are..."
              rows={3}
              maxLength={200}
              className={cn(
                "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors resize-none",
                inter.className
              )}
            />
            <p className="text-right text-[9px] text-white/20 mt-1">{bio.length}/200</p>
          </div>
        </div>
      </section>

      {/* Custom Cursor */}
      <section className="bg-[#0a0a0a] border border-white/[0.07] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className={cn("text-[9px] uppercase tracking-[0.4em] text-white/25", inter.className)}>Custom Cursor</p>
          {!isPremium && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-[8px] text-purple-400 font-bold uppercase tracking-wider">
              <Crown size={9} /> Premium
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {CURSOR_OPTIONS.map((opt) => {
            const isLocked = !isPremium && opt.id !== "default";
            const isSelected = cursorId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleCursorSelect(opt.id)}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                  isSelected
                    ? "bg-white/10 border-white/30"
                    : "bg-white/[0.03] border-white/[0.07] hover:border-white/15"
                )}
              >
                {isLocked && (
                  <div className="absolute top-1.5 right-1.5">
                    <Lock size={9} className="text-white/25" />
                  </div>
                )}
                <span className="text-2xl">{opt.preview}</span>
                <span className={cn("text-[8px] uppercase tracking-wider", isSelected ? "text-white/80" : "text-white/30", mono.className)}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Theme Builder */}
      <section className="bg-[#0a0a0a] border border-white/[0.07] rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <p className={cn("text-[9px] uppercase tracking-[0.4em] text-white/25", inter.className)}>Theme Builder</p>
          {!isPremium && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-[8px] text-purple-400 font-bold uppercase tracking-wider">
              <Crown size={9} /> Premium
            </span>
          )}
        </div>

        {/* Preset chips */}
        <div>
          <p className="text-[9px] text-white/20 uppercase tracking-widest mb-2">Presets</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_THEMES.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.07] hover:border-white/20 transition-all group"
                style={!isPremium ? {} : { background: p.bg + "cc" }}
              >
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: p.accent }} />
                <span className={cn("text-[10px] text-white/50 group-hover:text-white/80 transition-colors", inter.className)}>
                  {p.label}
                </span>
                {!isPremium && <Lock size={9} className="text-white/20" />}
              </button>
            ))}
          </div>
        </div>

        {/* Color pickers */}
        <div className={cn("grid grid-cols-2 gap-4", !isPremium && "opacity-40 pointer-events-none")}>
          {([
            { label: "Accent Color",      key: "accent" as const, hint: "Links, buttons, highlights" },
            { label: "Background",        key: "bg" as const,     hint: "Main page background" },
            { label: "Card Background",   key: "card" as const,   hint: "Content panels" },
            { label: "Text Color",        key: "text" as const,   hint: "Body text" },
          ]).map(({ label, key, hint }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className={cn("text-[10px] text-white/50", inter.className)}>{label}</label>
                <span className={cn("text-[9px] text-white/20", mono.className)}>{theme[key]}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-xl p-2">
                <input
                  type="color"
                  value={theme[key]}
                  onChange={(e) => setTheme((t) => ({ ...t, [key]: e.target.value }))}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                />
                <input
                  type="text"
                  value={theme[key]}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setTheme((t) => ({ ...t, [key]: v }));
                  }}
                  className={cn("flex-1 bg-transparent text-xs text-white/60 outline-none", mono.className)}
                  maxLength={7}
                />
              </div>
              <p className="text-[8px] text-white/20">{hint}</p>
            </div>
          ))}
        </div>

        {/* Live preview swatch */}
        {isPremium && (
          <div className="mt-4 rounded-xl overflow-hidden border border-white/[0.07]"
            style={{ background: theme.bg }}>
            <div className="p-6 space-y-3">
              <div className="w-16 h-16 rounded-2xl" style={{ background: theme.card, border: `1px solid ${theme.accent}30` }} />
              <div className="h-2 w-32 rounded-full" style={{ background: theme.accent + "50" }} />
              <p className="text-sm font-bold" style={{ color: theme.text }}>Preview text</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
                style={{ background: theme.accent, color: theme.bg }}>
                Button
              </div>
            </div>
          </div>
        )}

        {!isPremium && (
          <button
            onClick={() => { setPremiumFeature("Custom Themes"); setPremiumModalOpen(true); }}
            className="w-full py-3 bg-gradient-to-r from-purple-900/40 to-indigo-900/30 border border-purple-500/20 hover:border-purple-500/40 rounded-xl text-xs font-bold text-purple-300 flex items-center justify-center gap-2 transition-all"
          >
            <Crown size={13} /> Unlock Theme Builder — Upgrade to Premium
          </button>
        )}
      </section>
    </div>
  );
}