# Setup Guide - Getting Started

## ✅ Phase 1: Foundation - COMPLETED

The foundation of your CRM system is ready! Here's what has been built:

### What's Included

1. **Next.js 14 Project Setup**
   - TypeScript configured with strict mode
   - Tailwind CSS with custom primary color (#7C2D3A)
   - All dependencies defined in package.json

2. **Database Schema**
   - Complete PostgreSQL schema in `supabase-schema.sql`
   - All 10 tables defined with relationships
   - Indexes for performance optimization
   - Triggers for auto-updating timestamps
   - Row Level Security (RLS) policies configured

3. **TypeScript Types**
   - Full type definitions in `types/database.types.ts`
   - Helper types for easier development
   - Extended types with relations (ProductWithRelations, etc.)

4. **Supabase Integration**
   - Server Component client (`lib/supabase/server.ts`)
   - Client Component client (`lib/supabase/client.ts`)
   - Middleware for route protection (`middleware.ts`)

5. **Authentication System**
   - Login page at `/login`
   - Protected routes (all /dashboard/* routes)
   - Automatic redirects for authenticated/unauthenticated users

6. **Dashboard Layout**
   - Professional sidebar navigation
   - Header component for page titles
   - Responsive design
   - Sign out functionality

7. **Dashboard Home Page**
   - 4 stat cards (Products, Quotes, New Quotes, Featured Products)
   - Quick action buttons
   - Recent quotes table
   - Real-time data from Supabase

## 🚀 Next Steps - Get It Running

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, Supabase, and more.

### Step 2: Set Up Supabase

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Choose organization, project name, database password, region
   - Wait for project to be ready (~2 minutes)

2. **Get Your Credentials**
   - Go to Project Settings → API
   - Copy your "Project URL"
   - Copy your "anon/public" key
   - Copy your "service_role" key (keep this secret!)

3. **Create Environment File**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Run Database Schema**
   - Open Supabase Dashboard → SQL Editor
   - Copy entire contents of `supabase-schema.sql`
   - Paste and click "Run"
   - Verify success (should see tables in Table Editor)

5. **Create Storage Buckets**
   - Follow instructions in `SUPABASE_SETUP.md`
   - Create 4 public buckets: product-images, category-images, brand-logos, room-images
   - Apply storage policies (provided in SUPABASE_SETUP.md)

6. **Create Admin User**
   - Go to Authentication → Users
   - Click "Add user" → "Create new user"
   - Enter your email and password
   - Click "Create user"

7. **Disable Email Confirmations (Development Only)**
   - Go to Authentication → Settings
   - Find "Enable email confirmations"
   - Toggle OFF
   - Click Save
   - ⚠️ Re-enable this for production!

### Step 3: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Step 4: Log In

- You'll be redirected to `/login`
- Enter the email and password you created in Supabase
- Click "Sign in"
- You should see the dashboard with stats!

## 📊 What You'll See

When you first log in:
- **Dashboard** with 4 stat cards (all showing 0 since no data yet)
- **Sidebar navigation** on the left
- **Quick action buttons** for common tasks
- **Recent quotes table** (empty initially)

The sample data (3 categories, 5 rooms, 3 brands) from the SQL schema will be visible.

## 🎯 Phase 2: Products Management - NEXT

Once you've verified Phase 1 works, you're ready to build Phase 2:

1. **Product List Page** - View all products in a table
2. **Add Product Form** - Create new products with all fields
3. **Image Upload** - Upload multiple product images
4. **Edit Product** - Update existing products
5. **Delete Product** - Soft delete products

Let me know when you're ready and I'll help you build Phase 2!

## 🐛 Troubleshooting

### "Failed to sign in"
- Check email/password is correct
- Verify user exists in Supabase → Authentication → Users
- Ensure email confirmations are disabled (dev only)

### "Cannot connect to Supabase"
- Verify `.env.local` exists and has correct credentials
- Check Supabase project is running (not paused)
- Restart dev server after changing .env.local

### "RLS policy violation"
- Verify you ran the complete `supabase-schema.sql`
- Check RLS policies exist: `SELECT * FROM pg_policies;`
- Ensure you're signed in when accessing protected data

### Dashboard shows errors
- Check browser console for specific errors
- Verify all tables exist in Supabase
- Make sure sample data was inserted (categories, rooms, brands)

## 📚 Documentation

- `README.md` - Project overview
- `CLAUDE.md` - Development guide (for Claude Code and developers)
- `SUPABASE_SETUP.md` - Detailed Supabase configuration
- `supabase-schema.sql` - Complete database schema

## 🎨 Design Notes

- **Primary Color:** #7C2D3A (burgundy) - accessible via `bg-primary-700`, `text-primary-700`
- **Layout:** Fixed sidebar (256px) + flexible content area
- **Icons:** Lucide React (clean, modern)
- **Responsive:** Works on desktop and tablet (mobile support in Phase 5)

## ✨ What's Next?

Once you have the dashboard running, we'll build:
1. Products management (Phase 2) ← MOST IMPORTANT
2. Categories, Brands, Rooms management (Phase 3)
3. Quote request management (Phase 4)
4. Polish and advanced features (Phase 5)

Ready to continue? Just let me know! 🚀
