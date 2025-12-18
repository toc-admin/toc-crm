# Supabase Setup Instructions

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready
3. Copy your project URL and keys

## 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Get these values from:
- Project Settings → API → Project URL
- Project Settings → API → Project API keys

## 3. Run Database Schema

1. Open Supabase SQL Editor
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the query
4. Verify tables are created in Table Editor

## 4. Create Storage Buckets

Go to Storage section and create these **PUBLIC** buckets:

### product-images
```sql
-- In SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);
```

**Policies for product-images:**
```sql
-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);
```

### category-images
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('category-images', 'category-images', true);

-- Apply same policies as product-images (replace bucket_id)
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'category-images');

CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'category-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'category-images' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'category-images' AND
  auth.role() = 'authenticated'
);
```

### brand-logos
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-logos', 'brand-logos', true);

-- Apply same policies (replace bucket_id with 'brand-logos')
```

### room-images
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('room-images', 'room-images', true);

-- Apply same policies (replace bucket_id with 'room-images')
```

## 5. Create Admin User

In Supabase Authentication section:
1. Go to Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter email and password
4. User can now log in to the CRM

## 6. Verify Setup

Run these queries to verify:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check sample data
SELECT * FROM categories;
SELECT * FROM rooms;
SELECT * FROM brands;

-- Check storage buckets
SELECT * FROM storage.buckets;
```

## 7. Optional: Disable Email Confirmations (Development)

For easier development, disable email confirmations:

1. Go to Authentication → Settings
2. Scroll to "Email Auth"
3. Disable "Enable email confirmations"
4. Save

**WARNING:** Re-enable this in production!

## Troubleshooting

### Cannot log in
- Verify user exists in Authentication → Users
- Check .env.local has correct credentials
- Ensure email confirmations are disabled (dev only)

### Images not uploading
- Verify storage buckets are PUBLIC
- Check storage policies are created
- Verify authenticated user has valid session

### RLS Policy Errors
- Ensure RLS is enabled on all tables
- Verify policies exist with: `SELECT * FROM pg_policies;`
- Check you're authenticated when making requests
