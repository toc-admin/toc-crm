-- =============================================
-- The Office Company CRM - Database Schema
-- =============================================
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- BRANDS TABLE
-- =============================================
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_name TEXT,
  image_url TEXT,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ROOMS TABLE
-- =============================================
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  emoji TEXT,
  description TEXT,
  hero_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  subcategory TEXT,
  short_description TEXT,
  long_description TEXT,
  sku TEXT UNIQUE,
  is_new BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PRODUCT IMAGES TABLE
-- =============================================
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  medium_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PRODUCT FEATURES TABLE
-- =============================================
CREATE TABLE product_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PRODUCT COLORS TABLE
-- =============================================
CREATE TABLE product_colors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color_name TEXT NOT NULL,
  hex_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PRODUCT SPECIFICATIONS TABLE
-- =============================================
CREATE TABLE product_specifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  spec_key TEXT NOT NULL,
  spec_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PRODUCT ROOMS (Many-to-Many)
-- =============================================
CREATE TABLE product_rooms (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (product_id, room_id)
);

-- =============================================
-- QUOTE REQUESTS TABLE
-- =============================================
CREATE TABLE quote_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_company TEXT,
  quantity INTEGER,
  additional_requirements TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_deleted ON products(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_features_product ON product_features(product_id);
CREATE INDEX idx_product_colors_product ON product_colors(product_id);
CREATE INDEX idx_product_specifications_product ON product_specifications(product_id);
CREATE INDEX idx_quote_requests_status ON quote_requests(status);
CREATE INDEX idx_quote_requests_email ON quote_requests(customer_email);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quote_requests_updated_at BEFORE UPDATE ON quote_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update category product count
CREATE OR REPLACE FUNCTION update_category_product_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE categories
    SET product_count = (
      SELECT COUNT(*)
      FROM products
      WHERE category_id = NEW.category_id
        AND deleted_at IS NULL
    )
    WHERE id = NEW.category_id;
  END IF;

  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.category_id IS DISTINCT FROM NEW.category_id) THEN
    UPDATE categories
    SET product_count = (
      SELECT COUNT(*)
      FROM products
      WHERE category_id = OLD.category_id
        AND deleted_at IS NULL
    )
    WHERE id = OLD.category_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_category_count AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION update_category_product_count();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Public read access for website (products, brands, categories, rooms)
CREATE POLICY "Public read access" ON products FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Public read access" ON brands FOR SELECT USING (true);
CREATE POLICY "Public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public read access" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read access" ON product_features FOR SELECT USING (true);
CREATE POLICY "Public read access" ON product_colors FOR SELECT USING (true);
CREATE POLICY "Public read access" ON product_specifications FOR SELECT USING (true);
CREATE POLICY "Public read access" ON product_rooms FOR SELECT USING (true);

-- Authenticated users can do everything (CRM admin users)
CREATE POLICY "Authenticated full access" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access" ON brands FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access" ON rooms FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access" ON product_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access" ON product_features FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access" ON product_colors FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access" ON product_specifications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access" ON product_rooms FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated full access" ON quote_requests FOR ALL USING (auth.role() = 'authenticated');

-- Public can insert quote requests (from website)
CREATE POLICY "Public can create quotes" ON quote_requests FOR INSERT WITH CHECK (true);

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Insert sample categories
INSERT INTO categories (name, slug, description, icon_name) VALUES
  ('Chairs', 'chairs', 'Office chairs and seating solutions', 'armchair'),
  ('Desks & Tables', 'desks-tables', 'Work desks and meeting tables', 'table'),
  ('Storage', 'storage', 'Filing cabinets and storage solutions', 'archive'),
  ('Acoustic', 'acoustic', 'Sound dampening solutions', 'volume-2'),
  ('Accessories & Lighting', 'accessories-lighting', 'Office accessories and lighting', 'lightbulb'),
  ('Lounge', 'lounge', 'Lounge and breakout furniture', 'sofa');

-- Insert sample rooms
INSERT INTO rooms (name, slug, emoji, description) VALUES
  ('Reception', 'reception', '🚪', 'First impression spaces'),
  ('Private Office', 'private-office', '💼', 'Individual workspaces'),
  ('Meeting Rooms', 'meeting-rooms', '🤝', 'Collaboration spaces'),
  ('Lounge', 'lounge', '☕', 'Relaxation and breakout areas'),
  ('Outdoor', 'outdoor', '🌳', 'Outdoor office spaces');

-- Insert sample brand
INSERT INTO brands (name, slug, website_url) VALUES
  ('Herman Miller', 'herman-miller', 'https://www.hermanmiller.com'),
  ('Steelcase', 'steelcase', 'https://www.steelcase.com'),
  ('Haworth', 'haworth', 'https://www.haworth.com');
