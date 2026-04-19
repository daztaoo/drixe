-- ============================================================
-- Drixe Phase 10 Migrations
-- Run these in Supabase SQL editor AFTER running 002_phase9.sql
-- ============================================================

-- 7. Custom cursor (Premium feature)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cursor_id text DEFAULT 'default';

-- 8. Custom theme colors
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS theme_accent text DEFAULT '#a855f7';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS theme_bg text DEFAULT '#080808';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS theme_card_bg text DEFAULT '#111111';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS theme_text text DEFAULT '#ffffff';

-- 9. Custom domain (Premium feature)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS custom_domain text;

-- 10. Profile views_count column (if it doesn't exist)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS views_count integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS likes_count integer DEFAULT 0;
