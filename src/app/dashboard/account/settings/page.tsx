"use client";

import { useEffect, useState } from "react";
import { Inter_Tight } from "next/font/google";
import { Mail, Trash2, Save, Globe, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { TRANSLATIONS, Language } from "@/lib/i18n"; // Import your new library

const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "600", "800"] });

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    language: "en" as Language,
    email: "",
  });

  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [originalUsername, setOriginalUsername] = useState("");
  const [providers, setProviders] = useState<string[]>([]);

  // Get Translation based on current form language
  const t = TRANSLATIONS[formData.language] || TRANSLATIONS.en;
  const isRTL = formData.language === 'ar';

  // 1. DATA FETCHING
  useEffect(() => {
    async function loadData() {
      // A. Get Auth User
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setUser(user);
      setProviders(user.app_metadata.providers || []);

      // B. Get Profile Data from DB
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (profile) {
        setFormData({
          username: profile.username || "",
          full_name: profile.full_name || "",
          language: (profile.language as Language) || "en",
          email: user.email || ""
        });
        
        // Store original username to know when to trigger availability check
        setOriginalUsername(profile.username || "");

        // Sync local storage immediately on load
        if (profile.language) {
          localStorage.setItem("drixe_language", profile.language);
        }
      } else {
        // Fallback if profile doesn't exist yet
        setFormData(prev => ({ ...prev, email: user.email || "" }));
      }
      
      setLoading(false);
    }
    loadData();
  }, []);

  // 2. CHECK USERNAME AVAILABILITY (Debounced)
  useEffect(() => {
    // If empty or same as original, don't check
    if (!formData.username || formData.username === originalUsername) {
      setUsernameStatus("idle");
      return;
    }

    setUsernameStatus("checking");
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", formData.username)
        .single();

      // If we found a user with this name, it's taken
      if (data) setUsernameStatus("taken");
      else setUsernameStatus("available");
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username, originalUsername]);

  // 3. Save Changes (FIXED VERSION)
  // 3. DEBUG SAVE FUNCTION
  const handleSave = async () => {
    setSaving(true);
    console.log("--- STARTING DEBUG SAVE ---");

    try {
      // TEST 1: Try updating JUST the language (Safest)
      const { data: langData, error: langError } = await supabase
        .from("profiles")
        .update({ language: formData.language }) // Only update language
        .eq("id", user.id)
        .select();

      if (langError) {
        console.error("❌ Language Update Failed:", langError);
        toast.error("Language update failed: " + langError.message);
        throw langError;
      } else {
        console.log("✅ Language Update Success!", langData);
      }

      // TEST 2: If language worked, try updating everything else
      const { data: fullData, error: fullError } = await supabase
        .from("profiles")
        .update({
          username: formData.username,
          full_name: formData.full_name,
          updated_at: new Date().toISOString(), // <--- THIS MIGHT BE THE CULPRIT
        })
        .eq("id", user.id)
        .select();

      if (fullError) {
        console.error("❌ Full Update Failed:", fullError);
        // Check for specific error codes
        if (fullError.code === "23505") { // Unique violation code
            toast.error("Username is already taken.");
        } else if (fullError.code === "42703") { // Undefined column
            toast.error("Database column missing. Check console.");
        } else {
            toast.error("Update failed: " + fullError.message);
        }
        throw fullError;
      }

      console.log("✅ Full Update Success!", fullData);
      
      // Update LocalStorage
      localStorage.setItem("drixe_language", formData.language);
      window.dispatchEvent(new Event("storage"));
      
      toast.success(t.success_msg);
      setOriginalUsername(formData.username);
      
      setTimeout(() => window.location.reload(), 1000);

    } catch (error: any) {
      console.error("🔥 CRITICAL ERROR:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-white/50 gap-2">
      <Loader2 className="animate-spin" /> Fetching Profile...
    </div>
  );

  return (
    <div className={cn("space-y-10 animate-in fade-in zoom-in-95 duration-500 max-w-2xl pb-20", isRTL && "text-right")} dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={cn("text-3xl font-bold", inter.className)}>{t.title}</h2>
          <p className="text-white/40 mt-1">{t.subtitle}</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving || usernameStatus === "taken"}
          className="flex items-center gap-2 px-5 py-2 bg-white text-black font-bold rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? t.saving : t.save}
        </button>
      </div>

      {/* --- PROFILE SECTION --- */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">{t.section_profile}</h3>
        <div className="p-6 bg-[#0A0A0A] border border-white/5 rounded-2xl space-y-6">
          
          {/* Display Name */}
          <div>
            <label className="text-xs text-white/40 uppercase font-bold tracking-wider">{t.label_display_name}</label>
            <input 
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full mt-2 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
              placeholder={t.placeholder_display_name}
            />
          </div>

          {/* Username */}
          <div>
            <div className="flex justify-between">
              <label className="text-xs text-white/40 uppercase font-bold tracking-wider">{t.label_username}</label>
              
              {/* Status Indicator */}
              {usernameStatus === "checking" && <span className="text-xs text-yellow-500 flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> {t.status_checking}</span>}
              {usernameStatus === "taken" && <span className="text-xs text-red-500 flex items-center gap-1"><XCircle size={10}/> {t.status_taken}</span>}
              {usernameStatus === "available" && <span className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 size={10}/> {t.status_available}</span>}
            </div>

            <div className="relative mt-2">
              <span className={cn("absolute top-1/2 -translate-y-1/2 text-white/30 font-mono", isRTL ? "right-4" : "left-4")}>drixe.lol/</span>
              <input 
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                className={cn(
                  "w-full bg-black/50 border rounded-xl py-3 text-white font-mono focus:outline-none transition-colors",
                  isRTL ? "pr-24 pl-4" : "pl-24 pr-4",
                  usernameStatus === "taken" ? "border-red-500/50 focus:border-red-500" : "border-white/10 focus:border-white/30"
                )}
                placeholder={t.placeholder_username}
              />
            </div>
            <p className="text-[10px] text-white/20 mt-2">{t.hint_username}</p>
          </div>
        </div>
      </div>

      {/* --- PREFERENCES SECTION --- */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">{t.section_preferences}</h3>
        <div className="p-6 bg-[#0A0A0A] border border-white/5 rounded-2xl space-y-4">
          
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><Globe size={18} /></div>
               <div>
                 <p className="font-bold text-sm">{t.label_language}</p>
                 <p className="text-xs text-white/40">{t.desc_language}</p>
               </div>
             </div>
             
             <select 
               value={formData.language}
               onChange={(e) => setFormData({ ...formData, language: e.target.value as Language })}
               className="bg-black border border-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-purple-500/50 cursor-pointer"
             >
               <option value="en">🇺🇸 English</option>
               <option value="es">🇪🇸 Español</option>
               <option value="ar">🇸🇦 العربية</option>
               <option value="tr">🇹🇷 Türkçe</option>
               <option value="ru">🇷🇺 Русский</option>
             </select>
          </div>
        </div>
      </div>

      {/* --- CONNECTIONS SECTION --- */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">{t.section_connections}</h3>
        <div className="p-6 bg-[#0A0A0A] border border-white/5 rounded-2xl space-y-4">
          
          {/* Google */}
          <div className="flex items-center justify-between p-3 border border-white/5 rounded-xl bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <img src="https://authjs.dev/img/providers/google.svg" className="w-4 h-4" alt="Google" />
              </div>
              <span className="text-sm font-bold">Google</span>
            </div>
            {providers.includes("google") ? (
              <span className="text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 size={12}/> {t.connected}
              </span>
            ) : (
              <button className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
                {t.connect}
              </button>
            )}
          </div>

          {/* Discord */}
          <div className="flex items-center justify-between p-3 border border-white/5 rounded-xl bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center">
                <img src="https://authjs.dev/img/providers/discord.svg" className="w-5 h-5 invert" alt="Discord" />
              </div>
              <span className="text-sm font-bold">Discord</span>
            </div>
            {providers.includes("discord") ? (
              <span className="text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 size={12}/> {t.connected}
              </span>
            ) : (
              <button className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
                {t.connect}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* --- EMAIL SECTION --- */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">{t.section_security}</h3>
        <div className="p-6 bg-[#0A0A0A] border border-white/5 rounded-2xl space-y-4">
          <div>
            <label className="text-xs text-white/40 uppercase font-bold tracking-wider">{t.label_email}</label>
            <div className="flex gap-4 mt-2">
              <div className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white/50 flex items-center gap-3 cursor-not-allowed">
                <Mail size={16} /> {formData.email}
              </div>
            </div>
            <p className="text-[10px] text-white/20 mt-2">{t.hint_email}</p>
          </div>
        </div>
      </div>

      {/* --- DANGER ZONE --- */}
      <div className="pt-8 border-t border-white/5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-red-500/50 mb-4">{t.section_danger}</h3>
        <button 
          onClick={() => alert("This feature is disabled in the demo.")}
          className="w-full p-4 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm font-bold group"
        >
          <Trash2 size={16} className="group-hover:rotate-12 transition-transform" /> {t.btn_delete}
        </button>
      </div>

    </div>
  );
}