# CLAUDE.md

The Office Company CRM - Furniture catalog admin tool. Next.js 14 App Router + TypeScript + Supabase + Tailwind.

## Commands
```bash
npm run dev        # localhost:3000
npm run build
npm run lint
```

## Tech Stack
- Next.js 14 App Router, TypeScript (strict), Supabase (PostgreSQL + Auth + Storage), Tailwind, Lucide icons
- Server Components for data fetching, Client Components for forms/interactivity
- Sharp for image processing (thumbnail 300x300, medium 800x800, original 1600x1600)

## Structure
```
/app/dashboard/*    # Protected routes: products, categories, brands, rooms, quotes, settings
/components         # layout/, products/, categories/, settings/, ui/
/lib/supabase       # createServerClient(), createClient(), migrations/
/types              # database.types.ts
```

## Database
**Main tables:** products (soft delete), product_images, product_features, product_colors, product_specifications, categories, brands, rooms, product_rooms (many-to-many), quote_requests, user_preferences, company_settings

**Storage buckets:** product-images, category-images, brand-logos, room-images, avatars, company-logos (all public)

**Auth:** `/dashboard/*` requires auth via middleware.ts, user metadata stores full_name + avatar_url

## Key Patterns

**Server Component data fetch:**
```typescript
const supabase = createServerClient()
const { data } = await supabase.from('products').select('*').is('deleted_at', null)
```

**Client Component mutations:**
```typescript
'use client'
const supabase = createClient()
await supabase.from('products').insert({...})
```

**Images:** Upload to Storage bucket → Create 3 sizes with Sharp → Store URLs in DB

## Styling
- Fonts: Clash Display (headings), Inter (body)
- Colors: Sky blue (#0ea5e9), Purple (#a855f7)
- Effects: Glassmorphism (backdrop-blur-xl), gradients
- Classes: `.btn-primary`, `.btn-secondary`, `.card`, `.input-field`

## Critical Rules
- Filter soft-deleted products: `.is('deleted_at', null)`
- Convert empty strings → null before save (avoid unique constraint violations)
- Use `slugify()` for URL-friendly slugs
- Stop event propagation on nested clickable elements
- Map DB field names to component props (DB: `image_url` → Component: `url`)

## Status

**Phase 1 (Foundation): ✅ COMPLETE**
- Next.js setup, DB schema, auth, dashboard layout

**Phase 2 (Products): ✅ COMPLETE**
- Full CRUD, multi-image upload, auto-SKU, soft delete, grid/list views

**Phase 3 (Supporting Data): ✅ COMPLETE**
- ✅ Categories management: Full CRUD with image upload
- ✅ Brands management: Full CRUD with logo upload, website field, auto-slug generation
- ✅ Rooms management: Full CRUD with hero image upload, emoji support, grid/list views, auto-slug generation
- ✅ Success modals: Replaced browser alert() with glassmorphism modal for products, categories, brands, rooms (auto-dismiss, sky/purple gradient)
- ✅ Category image cleanup: Delete from storage when image removed/replaced, auto-cleanup on update

**Phase 4 (Quote Requests): ✅ COMPLETE**
- ✅ Quote requests management: Full quote request tracking with status workflow (new, contacted, quoted, closed), grid/list views, customer/product details, search/filter by status

**Phase 5 (Settings & Profile): ✅ COMPLETE**
- ✅ Settings screen: Tabbed interface (Profile, Security, Preferences, Company)
- ✅ Profile management: Full name, avatar upload (Sharp processing), email display
- ✅ Security: Password change with validation (min 8 chars)
- ✅ Preferences: Default view mode (grid/list), email notification toggles
- ✅ Company settings: Name, logo, address, phone, email (shared across users)
- ✅ Dashboard header: Floating UserProfile + LiveClock in top-right corner
- ✅ API endpoints: /api/upload-avatar, /api/upload-company-logo
