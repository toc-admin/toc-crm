-- Settings Screen Migration
-- Creates user_preferences and company_settings tables
-- Creates avatars and company-logos storage buckets

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  default_view_mode TEXT DEFAULT 'grid' CHECK (default_view_mode IN ('grid', 'list')),
  email_notifications_enabled BOOLEAN DEFAULT true,
  notify_new_quotes BOOLEAN DEFAULT true,
  notify_quote_updates BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create company_settings table
CREATE TABLE IF NOT EXISTS company_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT,
  company_logo_url TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Enable RLS on company_settings
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read and update their own preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policy: All authenticated users can read company settings
CREATE POLICY "Authenticated users can view company settings"
  ON company_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policy: All authenticated users can insert company settings
CREATE POLICY "Authenticated users can insert company settings"
  ON company_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policy: All authenticated users can update company settings
CREATE POLICY "Authenticated users can update company settings"
  ON company_settings
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create storage buckets (run these in Supabase Dashboard or via API)
-- Note: These commands are for reference; you may need to create buckets via Supabase Dashboard

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('avatars', 'avatars', true)
-- ON CONFLICT (id) DO NOTHING;

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('company-logos', 'company-logos', true)
-- ON CONFLICT (id) DO NOTHING;

-- Storage bucket policies (create via Dashboard or uncomment if running as superuser)
-- Avatars: Users can upload to their own folder
-- CREATE POLICY "Users can upload own avatar"
--   ON storage.objects
--   FOR INSERT
--   TO authenticated
--   WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- CREATE POLICY "Anyone can view avatars"
--   ON storage.objects
--   FOR SELECT
--   TO public
--   USING (bucket_id = 'avatars');

-- CREATE POLICY "Users can update own avatar"
--   ON storage.objects
--   FOR UPDATE
--   TO authenticated
--   USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- CREATE POLICY "Users can delete own avatar"
--   ON storage.objects
--   FOR DELETE
--   TO authenticated
--   USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Company Logos: All authenticated users can upload (future: restrict to admins)
-- CREATE POLICY "Authenticated users can upload company logos"
--   ON storage.objects
--   FOR INSERT
--   TO authenticated
--   WITH CHECK (bucket_id = 'company-logos');

-- CREATE POLICY "Anyone can view company logos"
--   ON storage.objects
--   FOR SELECT
--   TO public
--   USING (bucket_id = 'company-logos');

-- CREATE POLICY "Authenticated users can update company logos"
--   ON storage.objects
--   FOR UPDATE
--   TO authenticated
--   USING (bucket_id = 'company-logos');

-- CREATE POLICY "Authenticated users can delete company logos"
--   ON storage.objects
--   FOR DELETE
--   TO authenticated
--   USING (bucket_id = 'company-logos');
