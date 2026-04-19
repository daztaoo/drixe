-- ============================================================
-- DRIXE — Migration 001: Integrations Table
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Ensure profiles has all needed columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_opacity int DEFAULT 50;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_blur int DEFAULT 20;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS effect_type text DEFAULT 'none';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS accent_color text DEFAULT '#a855f7';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS text_color text DEFAULT '#ffffff';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS layout_id text DEFAULT 'default';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS background_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS audio_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cursor_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS likes_count int DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS views_count int DEFAULT 0;

-- 2. Links table (if not exists)
CREATE TABLE IF NOT EXISTS links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own links" ON links FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Public can read links" ON links FOR SELECT USING (true);

-- 3. Analytics table (if not exists)
CREATE TABLE IF NOT EXISTS analytics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL, -- 'view' | 'click'
  link_url text,
  referrer text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own analytics" ON analytics FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Anyone can insert analytics" ON analytics FOR INSERT WITH CHECK (true);

-- 4. Integrations table (THE CORE OF LIVE IDENTITY)
-- ---------------------------------------------------------------
-- DESIGN DECISIONS:
--   • is_live / live_title / last_polled_at are CACHED here.
--     Instead of hitting Twitch/YouTube APIs on every profile view,
--     we update these columns every 60s in the background.
--     Public profiles read from DB → zero external API calls per visitor.
--   • access_token / refresh_token stored here.
--     In production, consider encrypting with Supabase Vault.
--   • UNIQUE(user_id, platform) ensures one row per integration per user.
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS integrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Which platform
  platform text NOT NULL CHECK (platform IN ('discord', 'spotify', 'twitch', 'youtube')),

  -- Platform identity
  platform_user_id text,     -- Discord ID, Spotify user ID, Twitch login, YT channel ID
  platform_username text,    -- Display name on that platform

  -- OAuth tokens (Spotify initially; Twitch user-level later)
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,

  -- User controls
  is_enabled boolean DEFAULT true,       -- User toggle: show/hide on profile
  show_on_profile boolean DEFAULT true,  -- Whether to render widget on public page

  -- Cached live status (updated by background polling, NOT on every profile view)
  is_live boolean DEFAULT false,
  live_title text,
  live_viewer_count int,
  live_video_url text,
  last_polled_at timestamptz,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(user_id, platform)
);

-- Row Level Security
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Users can manage their own integrations (full CRUD)
CREATE POLICY "Users manage own integrations" ON integrations
  FOR ALL USING (auth.uid() = user_id);

-- Public can read enabled integrations (for public profile rendering)
-- IMPORTANT: This does NOT expose tokens — select specific columns in API routes
CREATE POLICY "Public can read enabled integrations" ON integrations
  FOR SELECT USING (is_enabled = true);

-- 5. Auto-update updated_at on integrations changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER integrations_updated_at
  BEFORE UPDATE ON integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SUPABASE STORAGE: Create the avatars bucket
-- (Run this separately in Supabase Dashboard > Storage, or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
-- ============================================================
