-- =====================================================
-- PRODUCT-DATASHEETS BUCKET SETUP & POLICIES
-- =====================================================
-- This sets up storage for product PDF datasheets

-- Note: You must create the 'product-datasheets' bucket in Supabase Dashboard first:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "New bucket"
-- 3. Name: product-datasheets
-- 4. Public bucket: Yes
-- 5. File size limit: 10MB
-- 6. Allowed MIME types: application/pdf

-- Then run this SQL to create the policies:

-- =====================================================
-- PRODUCT-DATASHEETS BUCKET POLICIES
-- =====================================================

-- Policy: Authenticated users can upload product datasheets
CREATE POLICY "Authenticated users can upload product datasheets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-datasheets');

-- Policy: Anyone can view product datasheets (public read)
CREATE POLICY "Anyone can view product datasheets"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-datasheets');

-- Policy: Authenticated users can update product datasheets
CREATE POLICY "Authenticated users can update product datasheets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-datasheets');

-- Policy: Authenticated users can delete product datasheets
CREATE POLICY "Authenticated users can delete product datasheets"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-datasheets');
