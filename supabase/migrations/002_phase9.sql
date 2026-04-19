-- ============================================================
-- Drixe Phase 9 Migrations
-- Run these in Supabase SQL editor in order
-- ============================================================

-- 1. Bio column (for Customize page + new layouts)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;

-- 2. Premium system columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan text DEFAULT 'free';

-- 3. Typed links (platform icon picker)
ALTER TABLE links ADD COLUMN IF NOT EXISTS platform_type text DEFAULT 'custom';

-- 4. uid_serial for OG badge (first 100 users) — optional auto-increment
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS uid_serial serial;
-- NOTE: 'serial' cannot be added to existing table via ALTER.
-- Instead create a sequence and trigger:
CREATE SEQUENCE IF NOT EXISTS user_serial_seq START 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS uid_serial integer;
CREATE OR REPLACE FUNCTION assign_uid_serial()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.uid_serial IS NULL THEN
    NEW.uid_serial := nextval('user_serial_seq');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS set_uid_serial ON profiles;
CREATE TRIGGER set_uid_serial
BEFORE INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION assign_uid_serial();

-- 5. User badges table (if not exists)
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id text NOT NULL,
  granted_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
-- Service role can insert/delete (for admin panel)

-- 6. RLS policies for links with platform_type
-- (existing policies should already cover this — no change needed)
