-- =============================================
-- CROATIAN TRANSLATION COLUMNS
-- English stays in the existing columns; the *_hr
-- columns hold the Croatian variant. The website
-- falls back to English when a *_hr value is NULL.
-- Run this in the Supabase SQL editor.
-- =============================================

-- Products
ALTER TABLE products ADD COLUMN IF NOT EXISTS short_description_hr TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS long_description_hr TEXT;

-- Product features
ALTER TABLE product_features ADD COLUMN IF NOT EXISTS feature_name_hr TEXT;

-- Categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_hr TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description_hr TEXT;

-- Rooms
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS name_hr TEXT;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS description_hr TEXT;

-- Articles (CRM blog)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS title_hr TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS excerpt_hr TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS content_hr TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS meta_title_hr TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS meta_description_hr TEXT;
