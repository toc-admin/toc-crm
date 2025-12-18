# The Office Company - CRM System

Internal admin tool for managing The Office Company's furniture catalog website.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy `.env.local.example` to `.env.local`
3. Add your Supabase credentials to `.env.local`
4. Run the SQL schema in Supabase SQL Editor (see `supabase-schema.sql`)
5. Follow `SUPABASE_SETUP.md` for storage buckets and policies

### 3. Create Admin User

In Supabase Dashboard:
- Go to Authentication → Users
- Click "Add user" → "Create new user"
- Enter email and password

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with your admin credentials.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Features

- ✅ **Authentication** - Secure login with Supabase Auth
- ✅ **Dashboard** - Overview with stats and recent quotes
- ✅ **Product Management** - Full CRUD for products with images
- ✅ **Category Management** - Manage product categories
- ✅ **Brand Management** - Manage furniture brands
- ✅ **Room Management** - Manage room types
- ✅ **Quote Requests** - Track and manage customer inquiries

## Project Structure

```
/app/dashboard          # Protected admin pages
/components/layout      # Sidebar, Header components
/lib/supabase          # Supabase client configuration
/types                 # TypeScript type definitions
supabase-schema.sql    # Database schema
SUPABASE_SETUP.md      # Detailed setup instructions
CLAUDE.md              # Development guide for Claude Code
```

## Development

See `CLAUDE.md` for detailed development guidelines and architecture documentation.

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy

## Current Status

**Phase 1: Foundation** ✅ COMPLETED
- Project setup and configuration
- Database schema with all tables
- Authentication system
- Dashboard layout with sidebar navigation
- Dashboard home page with statistics

**Phase 2: Products** 🚧 READY TO BUILD
- Product list with search and filters
- Add/edit product forms
- Image upload and management
- Delete functionality

## License

Private - Internal use only
