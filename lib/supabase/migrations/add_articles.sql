-- Articles/Blog System Migration
-- Creates article_categories, articles, tags, and article_tags tables
-- Creates article-images storage bucket

-- Article Categories (simple, no separate management page)
CREATE TABLE IF NOT EXISTS article_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default categories
INSERT INTO article_categories (name, slug) VALUES
  ('News', 'news'),
  ('Tips & Guides', 'tips-guides'),
  ('Case Studies', 'case-studies'),
  ('Product Updates', 'product-updates')
ON CONFLICT DO NOTHING;

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image_url TEXT,
  cover_image_thumbnail_url TEXT,
  category_id UUID REFERENCES article_categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Article-Tags junction table
CREATE TABLE IF NOT EXISTS article_tags (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_deleted_at ON articles(deleted_at);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

-- Enable RLS on all tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies (same pattern as existing tables - authenticated users have full access)
CREATE POLICY "Auth users full access" ON articles FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth users full access" ON article_categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth users full access" ON tags FOR ALL TO authenticated USING (true);
CREATE POLICY "Auth users full access" ON article_tags FOR ALL TO authenticated USING (true);

-- Storage bucket: article-images (public)
-- Note: Create this bucket via Supabase Dashboard or API
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('article-images', 'article-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- Storage policies for article-images bucket (run via Dashboard or as superuser)
-- CREATE POLICY "Authenticated users can upload article images"
--   ON storage.objects
--   FOR INSERT
--   TO authenticated
--   WITH CHECK (bucket_id = 'article-images');

-- CREATE POLICY "Anyone can view article images"
--   ON storage.objects
--   FOR SELECT
--   TO public
--   USING (bucket_id = 'article-images');

-- CREATE POLICY "Authenticated users can update article images"
--   ON storage.objects
--   FOR UPDATE
--   TO authenticated
--   USING (bucket_id = 'article-images');

-- CREATE POLICY "Authenticated users can delete article images"
--   ON storage.objects
--   FOR DELETE
--   TO authenticated
--   USING (bucket_id = 'article-images');
