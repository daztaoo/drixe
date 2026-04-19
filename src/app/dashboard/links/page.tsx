"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Plus, Trash2, GripVertical, ExternalLink,
  Loader2, Link as LinkIcon, Pencil, Check, X, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaYoutube, FaTwitch, FaSpotify, FaDiscord, FaInstagram,
  FaTwitter, FaGithub, FaTiktok, FaTelegram, FaSnapchat,
  FaSoundcloud, FaReddit, FaPaypal, FaPatreon, FaSteam, FaGlobe
} from "react-icons/fa";
import { SiRoblox, SiCashapp, SiApplemusic } from "react-icons/si";

const PLATFORMS = [
  { id: "youtube",      label: "YouTube",     Icon: FaYoutube,    color: "#FF0000", placeholder: "https://youtube.com/@channel",   bg: "#FF000015" },
  { id: "twitch",       label: "Twitch",      Icon: FaTwitch,     color: "#9147FF", placeholder: "https://twitch.tv/username",      bg: "#9147FF15" },
  { id: "spotify",      label: "Spotify",     Icon: FaSpotify,    color: "#1DB954", placeholder: "https://open.spotify.com/artist/",bg: "#1DB95415" },
  { id: "discord",      label: "Discord",     Icon: FaDiscord,    color: "#5865F2", placeholder: "https://discord.gg/invite",        bg: "#5865F215" },
  { id: "instagram",    label: "Instagram",   Icon: FaInstagram,  color: "#E1306C", placeholder: "https://instagram.com/username",   bg: "#E1306C15" },
  { id: "twitter",      label: "Twitter",     Icon: FaTwitter,    color: "#1DA1F2", placeholder: "https://twitter.com/username",     bg: "#1DA1F215" },
  { id: "tiktok",       label: "TikTok",      Icon: FaTiktok,     color: "#ffffff", placeholder: "https://tiktok.com/@username",     bg: "#ffffff10" },
  { id: "telegram",     label: "Telegram",    Icon: FaTelegram,   color: "#229ED9", placeholder: "https://t.me/username",            bg: "#229ED915" },
  { id: "snapchat",     label: "Snapchat",    Icon: FaSnapchat,   color: "#FFFC00", placeholder: "https://snapchat.com/add/user",    bg: "#FFFC0015" },
  { id: "github",       label: "GitHub",      Icon: FaGithub,     color: "#ffffff", placeholder: "https://github.com/username",      bg: "#ffffff10" },
  { id: "soundcloud",   label: "SoundCloud",  Icon: FaSoundcloud, color: "#FF5500", placeholder: "https://soundcloud.com/username",  bg: "#FF550015" },
  { id: "reddit",       label: "Reddit",      Icon: FaReddit,     color: "#FF4500", placeholder: "https://reddit.com/u/username",    bg: "#FF450015" },
  { id: "paypal",       label: "PayPal",      Icon: FaPaypal,     color: "#003087", placeholder: "https://paypal.me/username",       bg: "#00308715" },
  { id: "patreon",      label: "Patreon",     Icon: FaPatreon,    color: "#FF424D", placeholder: "https://patreon.com/username",     bg: "#FF424D15" },
  { id: "steam",        label: "Steam",       Icon: FaSteam,      color: "#1b2838", placeholder: "https://steamcommunity.com/id/",   bg: "#ffffff10" },
  { id: "roblox",       label: "Roblox",      Icon: SiRoblox,     color: "#E2231A", placeholder: "https://roblox.com/users/",        bg: "#E2231A15" },
  { id: "cashapp",      label: "Cash App",    Icon: SiCashapp,    color: "#00D54B", placeholder: "https://cash.app/$username",        bg: "#00D54B15" },
  { id: "applemusic",   label: "Apple Music", Icon: SiApplemusic, color: "#FA2D48", placeholder: "https://music.apple.com/",         bg: "#FA2D4815" },
  { id: "custom",       label: "Custom URL",  Icon: FaGlobe,      color: "#888888", placeholder: "https://yoursite.com",             bg: "#88888815" },
];

function getPlatformForUrl(url: string) {
  const u = url.toLowerCase();
  return PLATFORMS.find((p) => {
    if (p.id === "youtube") return u.includes("youtube.com") || u.includes("youtu.be");
    if (p.id === "twitch") return u.includes("twitch.tv");
    if (p.id === "spotify") return u.includes("spotify.com");
    if (p.id === "discord") return u.includes("discord.gg") || u.includes("discord.com");
    if (p.id === "instagram") return u.includes("instagram.com");
    if (p.id === "twitter") return u.includes("twitter.com") || u.includes("x.com");
    if (p.id === "tiktok") return u.includes("tiktok.com");
    if (p.id === "telegram") return u.includes("t.me");
    if (p.id === "snapchat") return u.includes("snapchat.com");
    if (p.id === "github") return u.includes("github.com");
    if (p.id === "soundcloud") return u.includes("soundcloud.com");
    if (p.id === "reddit") return u.includes("reddit.com");
    if (p.id === "paypal") return u.includes("paypal.me") || u.includes("paypal.com");
    if (p.id === "patreon") return u.includes("patreon.com");
    if (p.id === "steam") return u.includes("steamcommunity.com");
    if (p.id === "roblox") return u.includes("roblox.com");
    if (p.id === "cashapp") return u.includes("cash.app");
    if (p.id === "applemusic") return u.includes("music.apple.com");
    return false;
  }) || PLATFORMS.find((p) => p.id === "custom")!;
}

interface Link {
  id: string;
  title: string;
  url: string;
  display_order: number;
  platform_type: string;
}

function isValidUrl(url: string) {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return ["http:", "https:"].includes(u.protocol);
  } catch { return false; }
}

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Add form state
  const [showPicker, setShowPicker] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<typeof PLATFORMS[0] | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  // Drag-and-drop
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setProfileId(user.id);
      const { data } = await supabase
        .from("links")
        .select("id, title, url, display_order, platform_type")
        .eq("profile_id", user.id)
        .order("display_order", { ascending: true });
      setLinks(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const pickPlatform = (p: typeof PLATFORMS[0]) => {
    setSelectedPlatform(p);
    setShowPicker(false);
    setNewTitle(p.id === "custom" ? "" : p.label);
    setNewUrl("");
  };

  const addLink = async () => {
    if (!newTitle.trim() || !newUrl.trim()) { toast.error("Title and URL required."); return; }
    const url = newUrl.startsWith("http") ? newUrl : `https://${newUrl}`;
    if (!isValidUrl(url)) { toast.error("Enter a valid URL."); return; }

    setSaving(true);
    const platform = selectedPlatform || getPlatformForUrl(url);
    const nextOrder = links.length > 0 ? Math.max(...links.map((l) => l.display_order)) + 1 : 0;

    // Try with platform_type first; fall back without it if column doesn't exist
    let data: any = null;
    let error: any = null;
    const fullInsert = await supabase
      .from("links")
      .insert({ profile_id: profileId, title: newTitle.trim(), url, display_order: nextOrder, platform_type: platform.id })
      .select()
      .single();

    if (fullInsert.error) {
      // If column doesn't exist yet, retry without platform_type
      if (fullInsert.error.code === "PGRST204" || fullInsert.error.message?.includes("platform_type") || fullInsert.error.message?.includes("column")) {
        const fallback = await supabase
          .from("links")
          .insert({ profile_id: profileId, title: newTitle.trim(), url, display_order: nextOrder })
          .select()
          .single();
        data = fallback.data;
        error = fallback.error;
        if (!error) toast.info("Tip: Run the SQL migration to enable platform icons.");
      } else {
        error = fullInsert.error;
      }
    } else {
      data = fullInsert.data;
    }

    if (error) {
      console.error("Link insert error:", error);
      toast.error(`Failed to add link: ${error.message || "Unknown error"}`);
    } else {
      setLinks((prev) => [...prev, { ...data, platform_type: data.platform_type ?? platform.id }]);
      setNewTitle(""); setNewUrl(""); setSelectedPlatform(null);
      toast.success("Link added!");
    }
    setSaving(false);
  };

  const deleteLink = async (id: string) => {
    const { error } = await supabase.from("links").delete().eq("id", id);
    if (!error) { setLinks((prev) => prev.filter((l) => l.id !== id)); toast.success("Removed."); }
  };

  const startEdit = (link: Link) => { setEditingId(link.id); setEditTitle(link.title); setEditUrl(link.url); };

  const saveEdit = async () => {
    if (!editingId) return;
    const url = editUrl.startsWith("http") ? editUrl : `https://${editUrl}`;
    if (!isValidUrl(url)) { toast.error("Invalid URL."); return; }
    const { error } = await supabase.from("links").update({ title: editTitle.trim(), url }).eq("id", editingId);
    if (error) { toast.error("Save failed."); }
    else {
      setLinks((prev) => prev.map((l) => l.id === editingId ? { ...l, title: editTitle.trim(), url } : l));
      setEditingId(null);
      toast.success("Updated!");
    }
  };

  const onDragStart = (idx: number) => { dragItem.current = idx; };
  const onDragEnter = (idx: number) => { dragOverItem.current = idx; };
  const onDragEnd = async () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;
    const reordered = [...links];
    const [moved] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverItem.current, 0, moved);
    const updated = reordered.map((l, i) => ({ ...l, display_order: i }));
    setLinks(updated);
    dragItem.current = null; dragOverItem.current = null;
    const { error } = await supabase.from("links").upsert(updated.map(({ id, display_order }) => ({ id, display_order })));
    if (error) toast.error("Reorder failed.");
    else toast.success("Order saved!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="animate-spin text-white/30" size={22} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Links</h2>
          <p className="text-white/40 text-sm mt-0.5">{links.length}/10 links · Drag to reorder</p>
        </div>
        {!selectedPlatform && !showPicker && links.length < 10 && (
          <button
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all active:scale-95 self-start sm:self-auto"
          >
            <Plus size={14} /> Add Link
          </button>
        )}
      </div>

      {/* PLATFORM PICKER */}
      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div>
                <p className="text-sm font-bold text-white">Pick a Platform</p>
                <p className="text-[10px] text-white/30 mt-0.5">0/{links.length > 0 ? 10 : 10} used</p>
              </div>
              <button onClick={() => setShowPicker(false)} className="p-2 text-white/30 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {PLATFORMS.filter((p) => p.id !== "custom").map((p) => (
                <button
                  key={p.id}
                  onClick={() => pickPlatform(p)}
                  title={p.label}
                  className="aspect-square rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 group"
                  style={{ background: p.bg, border: `1px solid ${p.color}20` }}
                >
                  <p.Icon size={22} style={{ color: p.color }} />
                </button>
              ))}
            </div>
            {/* Custom URL row */}
            <div
              onClick={() => pickPlatform(PLATFORMS.find((p) => p.id === "custom")!)}
              className="flex items-center gap-4 px-5 py-4 border-t border-white/[0.06] hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <FaGlobe size={18} className="text-white/50" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Add Custom URL</p>
                <p className="text-[10px] text-white/30">Use your own URL and choose an icon.</p>
              </div>
              <ChevronRight size={14} className="text-white/20 ml-auto" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADD LINK FORM (after platform selected) */}
      <AnimatePresence>
        {selectedPlatform && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: selectedPlatform.bg, border: `1px solid ${selectedPlatform.color}30` }}
              >
                <selectedPlatform.Icon size={18} style={{ color: selectedPlatform.color }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{selectedPlatform.label}</p>
                <p className="text-[10px] text-white/30">Fill in the details below</p>
              </div>
              <button onClick={() => { setSelectedPlatform(null); setNewTitle(""); setNewUrl(""); }} className="p-2 text-white/30 hover:text-white">
                <X size={14} />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <input
                type="text"
                placeholder="Display title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={50}
                className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
              />
              <input
                type="url"
                placeholder={selectedPlatform.placeholder}
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addLink()}
                className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors font-mono"
              />
              <div className="flex gap-2">
                <button
                  onClick={addLink}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save
                </button>
                <button
                  onClick={() => { setSelectedPlatform(null); setNewTitle(""); setNewUrl(""); }}
                  className="px-5 py-2.5 border border-white/10 text-white/40 text-xs font-bold uppercase tracking-widest rounded-xl hover:text-white hover:border-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LINKS LIST */}
      {links.length === 0 && !showPicker && !selectedPlatform ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <LinkIcon size={24} className="text-white/20" />
          </div>
          <p className="text-white/40 font-bold">No links yet</p>
          <p className="text-white/20 text-sm mt-1">Click "Add Link" to pick a platform</p>
        </div>
      ) : (
        <div className="space-y-2">
          {links.map((link, idx) => {
            const platform = PLATFORMS.find((p) => p.id === link.platform_type) || PLATFORMS.find((p) => p.id === "custom")!;
            return (
              <div
                key={link.id}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragEnter={() => onDragEnter(idx)}
                onDragEnd={onDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className="group bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex items-center gap-3 hover:border-white/20 transition-colors cursor-grab active:cursor-grabbing"
              >
                <div className="flex-shrink-0 text-white/20 group-hover:text-white/40 transition-colors touch-none">
                  <GripVertical size={18} />
                </div>

                {/* Platform icon */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: platform.bg, border: `1px solid ${platform.color}25` }}
                >
                  <platform.Icon size={16} style={{ color: platform.color }} />
                </div>

                {editingId === link.id ? (
                  <div className="flex-1 min-w-0 space-y-2">
                    <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-[#111] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/30" autoFocus placeholder="Title" />
                    <input type="url" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      className="w-full px-3 py-2 bg-[#111] border border-white/10 rounded-lg text-xs text-white/70 font-mono focus:outline-none focus:border-white/30" placeholder="https://..." />
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-white/90"><Check size={11} /> Save</button>
                      <button onClick={() => setEditingId(null)} className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 text-white/40 text-[10px] uppercase tracking-widest rounded-lg hover:text-white"><X size={11} /> Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{link.title}</p>
                    <p className="text-[10px] text-white/30 truncate font-mono mt-0.5">{link.url}</p>
                  </div>
                )}

                {editingId !== link.id && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all"><ExternalLink size={14} /></a>
                    <button onClick={() => startEdit(link)} className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all"><Pencil size={14} /></button>
                    <button onClick={() => deleteLink(link.id)} className="p-2 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {links.length >= 10 && (
        <p className="text-center text-xs text-white/20 py-2">
          Maximum 10 links. <a href="/dashboard/premium" className="text-purple-400 hover:underline">Upgrade for unlimited →</a>
        </p>
      )}

      <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
        <p className="text-xs text-white/30 leading-relaxed">
          💡 <strong className="text-white/50">Smart Priority:</strong> Twitch/YouTube links auto-float to the top when you&apos;re LIVE. Platform icons appear automatically on your public profile.
        </p>
      </div>
    </div>
  );
}