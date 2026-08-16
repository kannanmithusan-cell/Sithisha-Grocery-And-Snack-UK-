# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Project: Sithisha Masala & Snacks — Premium E-Commerce Web Application

---

## 1. Executive Summary & Overview

### 1.1 Brand & Store Details
* **Company Name:** Sithisha Masala & Snacks
* **Address:** 120 Parsons Hill, Birmingham, B30 3QP, United Kingdom
* **Business Model:** Online product catalog, shopping cart, direct WhatsApp order placement, and full admin operations dashboard.

### 1.2 Technology Stack
* **Frontend:** Next.js (App Router, React 19 / 18, TypeScript)
* **Styling & UI:** Tailwind CSS, Lucide React Icons, Framer Motion (subtle animations), Font Inter / Plus Jakarta Sans
* **Backend:** Next.js API Routes / Server Actions
* **Database:** MongoDB (using Mongoose with schema validation and indexes)
* **Image Storage:** Cloudinary (Server-side signed uploads, automatic optimization, deletion of unused assets)
* **Authentication:** NextAuth.js / JWT-based secure session for Admin
* **Notifications:** React Hot Toast / Sonner
* **Messaging Integration:** WhatsApp Web API deep-linking (`https://wa.me/`)

---

## 2. Design System & Aesthetics

### 2.1 Color Palette
* **Primary Brand Accent:** Deep Royal Purple (`#4C1D95`, `#581C87`) - used for primary CTAs, active filters, price highlights, navigation badges, and admin accents.
* **Secondary / Soft Accents:** Soft Lavender (`#F3E8FF`, `#E9D5FF`), Warm Amber Gold (`#F59E0B` for discount/sale badges).
* **Backgrounds:** Clean White (`#FFFFFF`), Light Gray (`#F9FAFB`), Off-white (`#F3F4F6`).
* **Typography & Text:** Dark Charcoal (`#111827`), Slate (`#374151`), Muted Gray (`#6B7280`).

### 2.2 Visual Principles
* Modern UK grocery brand feel (fresh, premium, trustworthy).
* Ample whitespace, high contrast, clean card elevations, rounded borders (`rounded-xl`, `rounded-2xl`).
* Responsive skeletons, smooth micro-interactions, responsive drawer carts, accessible focus rings.

---

## 3. Core Functional Requirements

### 3.1 Customer Portal Features
1. **Header & Navigation:** Sticky desktop & mobile header with logo, navigation links (Home, Shop, Categories, About, Contact), interactive search bar, and cart item count badge.
2. **Hero Section:** High-impact typography ("Your Favourite Groceries & Snacks, All in One Place"), call-to-action buttons ("Shop Now", "Explore Categories"), and appetizing food graphics.
3. **Shop by Category:** Dynamic grid fed from MongoDB categories with product count badges and active category route links.
4. **Featured & Special Offers:** Carousel/Grid highlighting featured items, best sellers, and discounted products with "SAVE X%" badges.
5. **Product Catalog (`/shop`):**
   - **Filter Sidebar:** Category checkbox, Price ranges (Under £5, £5–£10, £10–£20, £20+), In Stock status.
   - **Sorting:** Featured, Newest, Price (Low to High / High to Low), Name (A-Z / Z-A), Best Selling.
   - **Pagination:** Server-side pagination (12/24 items per page).
   - **Search:** Dynamic real-time text query matching name, category, description, and tags.
6. **Product Details Page (`/product/[slug]`):**
   - Gallery supporting **strictly up to 4 images** with thumbnail selector and main image preview.
   - Price, discount calculation, stock status badge, full description, quantity selector with stock limits.
   - Dual CTAs: "Add to Cart" and "Order via WhatsApp".
7. **Cart System & Drawer:**
   - Slide-over drawer and dedicated `/cart` page.
   - Item quantity modifiers (preventing additions over stock limit), subtotal calculation, delivery fee rules.
   - Professional empty state with quick shop button.
8. **Checkout & WhatsApp Flow (`/checkout`):**
   - Form fields: Full Name, Mobile Number, Email Address, Address Line 1, Address Line 2, City, Postcode, Delivery Instructions.
   - Validation: UK Postcode format, Mobile number format, required email validation.
   - Order creation in MongoDB upon form completion.
   - Automatic WhatsApp message generation with structured receipt formatted with items, totals, and delivery info.
   - Immediate redirect to shop's WhatsApp number.

---

### 3.2 Admin Portal Features
1. **Authentication (`/admin/login`):** Secure login protecting all `/admin/*` routes via JWT/session middleware.
2. **Dashboard Overview (`/admin`):**
   - KPI Metrics: Total Products, Total Categories, Total Orders, Pending Orders, Total Revenue, Low Stock Alerts.
   - Analytics Charts: Orders Overview (line chart), Sales Trend (bar chart), Top Selling Products.
3. **Product Management (`/admin/products`):**
   - Paginated datatable with search, category filtering, stock status filter, and quick toggle for Featured/Active.
   - **Add Product (`/admin/products/new`):**
     - Form validating all product fields.
     - **Cloudinary Image Uploader enforcing strictly maximum 4 images**. Prevents 5th upload attempt with toast notification.
   - **Edit Product (`/admin/products/[id]/edit`):** Edit product metadata and update images (removes deleted image public IDs from Cloudinary).
   - **Delete Product:** Modal confirmation with soft-delete / order safety preservation.
4. **Category Management (`/admin/categories`):**
   - CRUD interface for categories (Name, Slug, Description, Category Image, Display Order, Active switch).
5. **Order Operations (`/admin/orders`):**
   - Orders list with status pills (Pending, Confirmed, Preparing, Ready, Out for Delivery, Delivered, Cancelled).
   - Order Details view (`/admin/orders/[id]`) with full customer info, itemized list, subtotal, delivery fee, total, and status dropdown updater.
6. **Store Settings (`/admin/settings`):**
   - Configurable Store Name, Address, Phone, Email, **WhatsApp Number**, Delivery Fee, Free Delivery Threshold.

---

## 4. Data Models & Schemas (MongoDB)

### 4.1 `products` Collection
```typescript
interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  categoryName: string;
  images: string[]; // Max length 4
  cloudinaryPublicIds: string[]; // Max length 4
  stock: number;
  sku?: string;
  tags: string[];
  featured: boolean;
  bestSeller: boolean;
  onSale: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.2 `categories` Collection
```typescript
interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  active: boolean;
  displayOrder: number;
  createdAt: Date;
}
```

### 4.3 `orders` Collection
```typescript
interface IOrderItem {
  productId: string;
  productName: string;
  image: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface IOrder {
  _id: string;
  orderNumber: string; // e.g. SITH-10024
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postcode: string;
  deliveryInstructions?: string;
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  whatsappSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.4 `settings` Collection
```typescript
interface ISettings {
  _id: string;
  storeName: string;
  address: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  currency: string;
}
```

---

## 5. Security & Business Rules

1. **Strict 4-Image Limit:** Neither the admin UI nor the backend API endpoint `/api/products` will accept more than 4 images per product.
2. **Server-Side Price Recalculation:** When submitting an order, the server recalculates item subtotals and grand total from DB price records to prevent tampering.
3. **Cloudinary Asset Safety:** Replacing or deleting a product image triggers deletion of the corresponding `cloudinaryPublicId` from Cloudinary via API.
4. **Admin Protection:** Middleware guards `/admin/*` routes (except `/admin/login`).

---

## 6. Acceptance Criteria

- [x] Responsive Customer UI built with Next.js & Tailwind CSS using royal purple branding.
- [x] Full catalog browsing, live filtering, dynamic sorting, and server pagination.
- [x] Product detail pages displaying max 4 Cloudinary gallery images.
- [x] Cart system with stock constraints and subtotal calculations.
- [x] Checkout validation (UK phone & postcode rules) creating order in MongoDB and launching formatted WhatsApp receipt.
- [x] Admin Login and Dashboard with real analytics charts.
- [x] Product CRUD with enforced 4-image limit and Cloudinary integration.
- [x] Category CRUD, Order Status Management, and Admin Store Settings.
- [x] MongoDB database seeding script for quick initial setup.
