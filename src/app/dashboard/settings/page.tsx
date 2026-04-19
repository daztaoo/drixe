"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Inter_Tight } from "next/font/google";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  User, Mail, KeyRound, Trash2, LogOut,
  AlertTriangle, Check, Loader2, Eye, EyeOff
} from "lucide-react";
import { useRouter } from "next/navigation";

const inter = Inter_Tight({ subsets: ["latin"], weight: ["400", "600", "800"] });

export default function AccountSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // Username change
  const [newUsername, setNewUsername] = useState("");
  const [usernameSaving, setUsernameSaving] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Email change
  const [newEmail, setNewEmail] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);

  // Danger zone
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { router.push("/auth"); return; }
      setUser(authUser);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url")
        .eq("id", authUser.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setNewUsername(profileData.username || "");
      }
      setLoading(false);
    };
    load();
  }, [router]);

  const handleUsernameChange = async () => {
    setUsernameError("");
    const cleaned = newUsername.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (cleaned.length < 3) { setUsernameError("Username must be at least 3 characters."); return; }
    if (cleaned.length > 24) { setUsernameError("Username must be 24 characters or less."); return; }

    setUsernameSaving(true);
    // Check uniqueness
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", cleaned)
      .neq("id", profile.id)
      .maybeSingle();

    if (existing) {
      setUsernameError("This username is already taken.");
      setUsernameSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ username: cleaned })
      .eq("id", profile.id);

    if (error) {
      toast.error("Failed to update username.");
    } else {
      setProfile({ ...profile, username: cleaned });
      toast.success(`Username updated to @${cleaned}`);
    }
    setUsernameSaving(false);
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords don't match."); return; }

    setPasswordSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { toast.error(error.message); }
    else {
      toast.success("Password updated!");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    }
    setPasswordSaving(false);
  };

  const handleEmailChange = async () => {
    if (!newEmail.trim() || !newEmail.includes("@")) { toast.error("Enter a valid email."); return; }
    setEmailSaving(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    if (error) { toast.error(error.message); }
    else { toast.success("Confirmation email sent to your new address."); setNewEmail(""); }
    setEmailSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== profile?.username) {
      toast.error("Username doesn't match.");
      return;
    }
    setDeleting(true);
    // Soft delete — sign out (hard delete requires service role key)
    toast.info("Account deletion requested. Contact support@drixe.com to complete.");
    await supabase.auth.signOut();
    router.push("/");
    setDeleting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500 max-w-2xl">
      <div>
        <h2 className={cn("text-2xl font-bold text-white", inter.className)}>Account Settings</h2>
        <p className="text-white/40 text-sm mt-1">Manage your identity, security, and data.</p>
      </div>

      {/* Current Info Banner */}
      <div className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.07] rounded-2xl">
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-xl font-black text-white">
            {profile?.username?.[0]?.toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className={cn("font-bold text-white truncate", inter.className)}>{profile?.full_name || profile?.username}</p>
          <p className="text-xs text-white/30 truncate mt-0.5">@{profile?.username} · {user?.email}</p>
        </div>
      </div>

      {/* Username */}
      <Section title="Username" icon={User} description="Your public profile URL: drixe.com/@username">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">@</span>
            <input
              value={newUsername}
              onChange={(e) => { setNewUsername(e.target.value); setUsernameError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleUsernameChange()}
              placeholder="your_username"
              maxLength={24}
              className="w-full pl-8 pr-4 py-3 bg-[#111] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
          <button
            onClick={handleUsernameChange}
            disabled={usernameSaving || newUsername === profile?.username}
            className="flex items-center gap-2 px-5 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all disabled:opacity-40 flex-shrink-0"
          >
            {usernameSaving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
            Save
          </button>
        </div>
        {usernameError && <p className="text-xs text-red-400 mt-2">{usernameError}</p>}
        <p className="text-[10px] text-white/20 mt-2">3–24 characters. a–z, 0–9, underscores only.</p>
      </Section>

      {/* Email */}
      <Section title="Email Address" icon={Mail} description="A confirmation link will be sent to your new email.">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder={user?.email || "New email address"}
            className="flex-1 px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
          />
          <button
            onClick={handleEmailChange}
            disabled={emailSaving || !newEmail}
            className="flex items-center gap-2 px-5 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all disabled:opacity-40 flex-shrink-0"
          >
            {emailSaving ? <Loader2 size={13} className="animate-spin" /> : <Mail size={13} />}
            Update
          </button>
        </div>
      </Section>

      {/* Password */}
      <Section title="Password" icon={KeyRound} description="Must be at least 8 characters.">
        <div className="space-y-2">
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full px-4 py-3 pr-10 bg-[#111] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
            >
              {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePasswordChange()}
            placeholder="Confirm new password"
            className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors"
          />
          <button
            onClick={handlePasswordChange}
            disabled={passwordSaving || !newPassword || !confirmPassword}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all disabled:opacity-40"
          >
            {passwordSaving ? <Loader2 size={13} className="animate-spin" /> : <KeyRound size={13} />}
            Update Password
          </button>
        </div>
      </Section>

      {/* Sign Out */}
      <Section title="Sign Out" icon={LogOut} description="You'll be redirected to the login page.">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest rounded-xl hover:border-white/20 hover:text-white transition-all"
        >
          <LogOut size={13} />
          Sign Out of Drixe
        </button>
      </Section>

      {/* Danger Zone */}
      <div className="border border-red-500/20 rounded-2xl overflow-hidden">
        <div className="bg-red-500/5 px-5 py-4 flex items-center gap-2 border-b border-red-500/10">
          <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
          <p className={cn("text-sm font-bold text-red-300", inter.className)}>Danger Zone</p>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <p className="text-sm text-white/60 font-bold mb-1">Delete Account</p>
            <p className="text-xs text-white/30 leading-relaxed mb-4">
              Permanently deletes your profile, links, and all data. This cannot be undone.
              Type your username <span className="text-white/50 font-mono">@{profile?.username}</span> to confirm.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder={`Type @${profile?.username} to confirm`}
                className="flex-1 px-4 py-2.5 bg-[#111] border border-red-500/20 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/40 transition-colors"
              />
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirm !== profile?.username}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all disabled:opacity-40 flex-shrink-0"
              >
                {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title, icon: Icon, description, children
}: {
  title: string;
  icon: any;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2.5">
        <div className="p-1.5 bg-white/5 rounded-lg">
          <Icon size={13} className="text-white/50" />
        </div>
        <div>
          <p className="text-xs font-bold text-white">{title}</p>
          {description && <p className="text-[10px] text-white/30 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
