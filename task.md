# Task Checklist — Sithisha Masala & Snacks Web Application

## Phase 1: Project Setup & Architecture
- [x] Initialize Next.js application with TypeScript and Tailwind CSS
- [x] Configure Tailwind CSS color palette (Royal Purple theme, soft lavender, neutral grays)
- [x] Set up project directory structure (`app/`, `components/`, `lib/`, `models/`, `types/`, `hooks/`)
- [x] Configure environment variables (`.env.local`, `.env.example`)
- [x] Set up MongoDB connection helper (`lib/db.ts`)
- [x] Set up Cloudinary server-side SDK helper (`lib/cloudinary.ts`)

---

## Phase 2: Database Schemas, Models & Seeding
- [x] Create `Product` model & schema (`models/Product.ts`) with max 4 images constraint
- [x] Create `Category` model & schema (`models/Category.ts`)
- [x] Create `Order` model & schema (`models/Order.ts`)
- [x] Create `Settings` model & schema (`models/Settings.ts`)
- [x] Create `User` model & schema (`models/User.ts`)
- [x] Define TypeScript type definitions (`types/index.ts`)
- [x] Implement database seeding script (`scripts/seed.ts`) with initial categories, products, settings, and admin user

---

## Phase 3: Shared UI & Navigation System
- [x] Create Navigation Header with Desktop & Mobile responsive views, logo, navigation links, dynamic cart count badge, and search toggle
- [x] Create Footer component with Birmingham address (120 Parsons Hill, B30 3QP), links, and social icons
- [x] Create Toast Notification system
- [x] Create reusable UI components (Button, Input, Select, Badge, Card, Modal, Skeleton Loader)
- [x] Build Slide-over Cart Drawer component

---

## Phase 4: Customer Pages & Web Flow
- [x] Implement Home Page (`app/page.tsx`):
  - [x] Hero section with purple brand accents & CTAs
  - [x] Dynamic Category Grid
  - [x] Featured Products section
  - [x] Special Offers / Daily Deals section
  - [x] Customer Testimonials & Trust Badges section
- [x] Implement Product Catalog Page (`app/shop/page.tsx`):
  - [x] Left sidebar filters (Category, Price range, In-stock toggle)
  - [x] Sort dropdown (Featured, Price Low-High, Price High-Low, Newest, A-Z)
  - [x] Live search bar integration
  - [x] Server-side pagination
- [x] Implement Product Details Page (`app/product/[slug]/page.tsx`):
  - [x] 4-Image Cloudinary Gallery with main preview & thumbnails
  - [x] Product details, discount badge, stock status
  - [x] Quantity selector with stock limit protection
  - [x] "Add to Cart" & "Order via WhatsApp" buttons
- [x] Implement Cart Page (`app/cart/page.tsx`) & Cart Context state manager
- [x] Implement Checkout Page (`app/checkout/page.tsx`):
  - [x] Customer & delivery address form with validation (UK Postcode, Mobile, Email)
  - [x] Order summary breakdown (Subtotal, Delivery Fee, Total)
  - [x] API integration to create order in MongoDB
  - [x] WhatsApp message generation and automatic deep-link redirect
- [x] Implement About Page (`app/about/page.tsx`)
- [x] Implement Contact Page (`app/contact/page.tsx`)

---

## Phase 5: Backend API Routes & Services
- [x] `/api/products` - GET (search, filter, sort, paginate) & POST (create product)
- [x] `/api/products/[id]` - GET, PUT (update product), DELETE (delete product + Cloudinary images)
- [x] `/api/categories` - GET & POST
- [x] `/api/categories/[id]` - PUT & DELETE
- [x] `/api/orders` - POST (create order with server-side total validation) & GET (list orders for admin)
- [x] `/api/orders/[id]` - GET & PUT (update order status)
- [x] `/api/settings` - GET & PUT (store configuration)
- [x] `/api/upload` - Server-side Cloudinary upload handler enforcing max 4 images
- [x] `/api/auth/login` - Admin authentication handler

---

## Phase 6: Admin Dashboard (`/admin`)
- [x] Implement Admin Login Page (`app/admin/login/page.tsx`) & session guard
- [x] Implement Admin Dashboard Overview (`app/admin/page.tsx`):
  - [x] Metric cards (Total Products, Categories, Orders, Revenue, Low Stock)
  - [x] Orders & Sales Overview charts
- [x] Implement Admin Product Management (`app/admin/products/page.tsx`):
  - [x] Paginated Product Table with filters & search
  - [x] Add Product Page (`app/admin/products/new/page.tsx`) with 4-image uploader & preview
  - [x] Edit Product Page (`app/admin/products/[id]/edit/page.tsx`)
  - [x] Delete confirmation modal with soft-delete safety
- [x] Implement Admin Category Management (`app/admin/categories/page.tsx`)
- [x] Implement Admin Order Operations (`app/admin/orders/page.tsx` & `[id]/page.tsx`):
  - [x] Order datatable with status badges
  - [x] Order Detail viewer & status update dropdown
- [x] Implement Admin Settings Page (`app/admin/settings/page.tsx`)

---

## Phase 7: Verification, Optimization & Final Review
- [x] Verify maximum 4-image upload constraint (Frontend UI alert + API validation)
- [x] Test stock enforcement (prevent customer ordering > available stock)
- [x] Verify WhatsApp message URL encoding and format correctness
- [x] Test responsive views on Mobile (320px+), Tablet (768px+), and Desktop (1440px+)
- [x] Verify TypeScript build (`npm run build`) with zero errors
