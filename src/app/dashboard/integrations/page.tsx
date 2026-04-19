"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import {
  FaDiscord,
  FaSpotify,
  FaTwitch,
  FaYoutube,
} from "react-icons/fa";
import {
  Check,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Unplug,
  ExternalLink,
} from "lucide-react";

const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "600", "800"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

type Integration = {
  id: string;
  platform: "discord" | "spotify" | "twitch" | "youtube";
  platform_user_id: string | null;
  platform_username: string | null;
  is_enabled: boolean;
  show_on_profile: boolean;
  is_live: boolean;
};

const PLATFORM_META = {
  discord: {
    label: "Discord",
    icon: FaDiscord,
    color: "#5865F2",
    description: "Show your real-time status (online, playing, listening) on your profile.",
    inputLabel: "Your Discord User ID",
    inputPlaceholder: "e.g. 123456789012345678",
    hint: "Right-click your profile in Discord → Copy User ID (Developer Mode must be on)",
    type: "input",
  },
  spotify: {
    label: "Spotify",
    icon: FaSpotify,
    color: "#1DB954",
    description: "Show what you're currently listening to on your profile in real time.",
    type: "oauth",
  },
  twitch: {
    label: "Twitch",
    icon: FaTwitch,
    color: "#9147FF",
    description: "When you go LIVE, your Twitch link is automatically pinned to the top of your profile.",
    inputLabel: "Your Twitch Username",
    inputPlaceholder: "e.g. shroud",
    type: "input",
  },
  youtube: {
    label: "YouTube",
    icon: FaYoutube,
    color: "#FF0000",
    description: "When you start a live stream, your YouTube link gets promoted to the top with a LIVE badge.",
    inputLabel: "Your YouTube Channel ID",
    inputPlaceholder: "e.g. UCxxxxxxxxxxxxxxxxxxxxxx",
    hint: "Find it in YouTube Studio → Settings → Channel → Basic Info",
    type: "input",
  },
} as const;

export default function IntegrationsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [integrations, setIntegrations] = useState<Record<string, Integration | null>>({
    discord: null, spotify: null, twitch: null, youtube: null,
  });
  const [inputValues, setInputValues] = useState<Record<string, string>>({
    discord: "", twitch: "", youtube: "",
  });
  const [saving, setSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Read success/error from URL (e.g. ?spotify=connected)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const spotifyStatus = params.get("spotify");
    if (spotifyStatus === "connected") toast.success("Spotify connected!");
    if (spotifyStatus === "error") toast.error("Spotify connection failed. Try again.");
    if (spotifyStatus === "denied") toast.info("Spotify connection was cancelled.");
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("integrations")
        .select("*")
        .eq("user_id", user.id);

      const map: Record<string, Integration | null> = {
        discord: null, spotify: null, twitch: null, youtube: null,
      };
      const inputs: Record<string, string> = { discord: "", twitch: "", youtube: "" };

      data?.forEach((row: Integration) => {
        map[row.platform] = row;
        if (row.platform !== "spotify") {
          inputs[row.platform] = row.platform_user_id || "";
        }
      });

      setIntegrations(map);
      setInputValues(inputs);
      setLoading(false);
    };
    init();
  }, []);

  const saveInputIntegration = async (platform: "discord" | "twitch" | "youtube") => {
    if (!userId) return;
    const value = inputValues[platform]?.trim();
    if (!value) { toast.error("Please enter a value."); return; }

    setSaving(platform);
    const { error } = await supabase.from("integrations").upsert({
      user_id: userId,
      platform,
      platform_user_id: value,
      platform_username: value,
      is_enabled: true,
      show_on_profile: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,platform" });

    if (error) {
      toast.error("Save failed: " + error.message);
    } else {
      toast.success(`${PLATFORM_META[platform].label} connected!`);
      setIntegrations(prev => ({
        ...prev,
        [platform]: { ...prev[platform], platform_user_id: value, is_enabled: true } as Integration,
      }));
    }
    setSaving(null);
  };

  const toggleEnabled = async (platform: string, current: boolean) => {
    if (!userId) return;
    const { error } = await supabase
      .from("integrations")
      .update({ is_enabled: !current })
      .eq("user_id", userId)
      .eq("platform", platform);

    if (!error) {
      setIntegrations(prev => ({
        ...prev,
        [platform]: prev[platform] ? { ...prev[platform]!, is_enabled: !current } : null,
      }));
      toast.success(!current ? "Enabled on profile." : "Hidden from profile.");
    }
  };

  const disconnect = async (platform: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from("integrations")
      .delete()
      .eq("user_id", userId)
      .eq("platform", platform);

    if (!error) {
      setIntegrations(prev => ({ ...prev, [platform]: null }));
      setInputValues(prev => ({ ...prev, [platform]: "" }));
      toast.success("Disconnected.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="animate-spin text-white/30" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h2 className={cn("text-2xl font-bold text-white", inter.className)}>
          Integrations
        </h2>
        <p className="text-white/40 text-sm mt-1">
          Connect your platforms. Make your profile come alive.
        </p>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {(Object.keys(PLATFORM_META) as Array<keyof typeof PLATFORM_META>).map((platform) => {
          const meta = PLATFORM_META[platform];
          const integration = integrations[platform];
          const isConnected = !!integration;
          const Icon = meta.icon;

          return (
            <div
              key={platform}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-white/20 transition-colors"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: meta.color + "20", border: `1px solid ${meta.color}30` }}
                  >
                    <Icon size={20} style={{ color: meta.color }} />
                  </div>
                  <div>
                    <p className={cn("font-bold text-white text-sm", inter.className)}>
                      {meta.label}
                    </p>
                    {isConnected && integration.platform_username && (
                      <p className={cn("text-[10px] text-white/40", mono.className)}>
                        @{integration.platform_username}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status badge */}
                {isConnected ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-bold text-green-400 uppercase tracking-wide">
                    <Check size={10} />
                    Connected
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/30 uppercase tracking-wide">
                    Not connected
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-white/40 leading-relaxed">{meta.description}</p>

              {/* Connect UI */}
              {!isConnected ? (
                meta.type === "oauth" ? (
                  // OAuth: Direct redirect button
                  <a
                    href="/api/integrations/spotify/connect"
                    className={cn(
                      "flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                      "hover:opacity-90 active:scale-95"
                    )}
                    style={{ backgroundColor: meta.color, color: "#000" }}
                  >
                    <Icon size={14} />
                    Connect {meta.label}
                  </a>
                ) : (
                  // Input: Enter ID/username
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      {(meta as any).inputLabel}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={(meta as any).inputPlaceholder}
                        value={inputValues[platform] || ""}
                        onChange={(e) =>
                          setInputValues(prev => ({ ...prev, [platform]: e.target.value }))
                        }
                        onKeyDown={(e) => e.key === "Enter" && saveInputIntegration(platform as any)}
                        className={cn(
                          "flex-1 px-4 py-2.5 bg-[#111] border border-white/10 rounded-xl text-xs text-white",
                          "focus:outline-none focus:border-white/30 transition-colors",
                          mono.className
                        )}
                      />
                      <button
                        onClick={() => saveInputIntegration(platform as any)}
                        disabled={saving === platform}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-black transition-all disabled:opacity-50 hover:opacity-90 active:scale-95"
                        style={{ backgroundColor: meta.color }}
                      >
                        {saving === platform ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>
                    {(meta as any).hint && (
                      <p className="text-[10px] text-white/20 leading-relaxed">
                        💡 {(meta as any).hint}
                      </p>
                    )}
                  </div>
                )
              ) : (
                // Connected state: Show controls
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  {/* Toggle visibility */}
                  <button
                    onClick={() => toggleEnabled(platform, integration.is_enabled)}
                    className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors"
                  >
                    {integration.is_enabled ? (
                      <ToggleRight size={20} className="text-green-500" />
                    ) : (
                      <ToggleLeft size={20} className="text-white/20" />
                    )}
                    {integration.is_enabled ? "Visible on profile" : "Hidden from profile"}
                  </button>

                  {/* Disconnect */}
                  <button
                    onClick={() => disconnect(platform)}
                    className="flex items-center gap-1.5 text-[10px] text-white/20 hover:text-red-400 transition-colors"
                  >
                    <Unplug size={12} />
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info box */}
      <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
        <p className="text-xs text-purple-300/70 leading-relaxed">
          <span className="font-bold text-purple-300">How Live Identity works:</span>{" "}
          When you&apos;re live on Twitch or streaming on YouTube, your profile automatically promotes
          that link to the top with a{" "}
          <span className="text-red-400 font-bold">LIVE</span> badge. Spotify shows what
          you&apos;re currently playing. Discord displays your real-time status — all dynamically,
          with zero extra effort.
        </p>
      </div>
    </div>
  );
}
