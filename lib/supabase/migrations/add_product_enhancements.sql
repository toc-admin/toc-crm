-- =============================================
-- Product Enhancements Migration
-- =============================================
-- This migration adds:
-- 1. Datasheet PDF support
-- 2. Product certifications (similar to features)
-- 3. User tracking (created_by, updated_by)
-- 4. Removes soft deletion (products will be hard deleted)

-- =============================================
-- STEP 1: Add new columns to products table
-- =============================================

-- Add datasheet URL field for PDF uploads
ALTER TABLE products ADD COLUMN IF NOT EXISTS datasheet_url TEXT;

-- Add user tracking fields
ALTER TABLE products ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by);
CREATE INDEX IF NOT EXISTS idx_products_updated_by ON products(updated_by);

-- =============================================
-- STEP 2: Create product certifications table
-- =============================================
CREATE TABLE IF NOT EXISTS product_certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  certification_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_product_certifications_product ON product_certifications(product_id);

-- Enable RLS
ALTER TABLE product_certifications ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON product_certifications FOR SELECT USING (true);

-- Authenticated users can do everything
CREATE POLICY "Authenticated full access" ON product_certifications FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- STEP 3: Create triggers to auto-populate user tracking
-- =============================================

-- Function to set created_by and updated_by on insert
CREATE OR REPLACE FUNCTION set_product_user_tracking()
RETURNS TRIGGER AS $$
BEGIN
  -- On INSERT, set both created_by and updated_by to current user
  IF TG_OP = 'INSERT' THEN
    NEW.created_by = auth.uid();
    NEW.updated_by = auth.uid();
  END IF;

  -- On UPDATE, only update updated_by to current user
  IF TG_OP = 'UPDATE' THEN
    NEW.updated_by = auth.uid();
    -- Preserve original created_by
    NEW.created_by = OLD.created_by;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS set_product_user_tracking_trigger ON products;
CREATE TRIGGER set_product_user_tracking_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION set_product_user_tracking();

-- =============================================
-- STEP 4: Update RLS policies to remove deleted_at filter
-- =============================================

-- Drop the old policy that filters by deleted_at
DROP POLICY IF EXISTS "Public read access" ON products;

-- Create new policy without deleted_at filter
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);

-- =============================================
-- STEP 5: Remove partial index on deleted_at (no longer needed for hard delete)
-- =============================================

DROP INDEX IF EXISTS idx_products_deleted;

-- =============================================
-- STEP 6: Update category count trigger to remove deleted_at logic
-- =============================================

CREATE OR REPLACE FUNCTION update_category_product_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE categories
    SET product_count = (
      SELECT COUNT(*)
      FROM products
      WHERE category_id = NEW.category_id
    )
    WHERE id = NEW.category_id;
  END IF;

  IF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND OLD.category_id IS DISTINCT FROM NEW.category_id) THEN
    UPDATE categories
    SET product_count = (
      SELECT COUNT(*)
      FROM products
      WHERE category_id = OLD.category_id
    )
    WHERE id = OLD.category_id;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- NOTES
-- =============================================
-- After running this migration:
-- 1. Create 'product-datasheets' storage bucket in Supabase dashboard
-- 2. Set bucket to public and allow PDF uploads (.pdf files only)
-- 3. Configure storage policies for authenticated users
-- 4. Update frontend code to hard delete products instead of soft delete
-- 5. The deleted_at column will remain in the table for backward compatibility
--    but will no longer be used. You can drop it manually if desired:
--    ALTER TABLE products DROP COLUMN deleted_at;
