import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import ProductGrid from '@/components/ProductGrid';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Link from 'next/link';
import { Filter, SlidersHorizontal, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import JsonLd, { getBreadcrumbSchema } from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sithishamasala.co.uk';

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    priceRange?: string;
    inStock?: string;
    onSale?: string;
    sortBy?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: ShopPageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;

  let title = 'Shop Authentic Jaffna & Indian Masalas, Snacks & Spices | Sithisha Grocery';
  let description =
    'Browse our complete catalogue of Jaffna savouries, Sri Lankan roasted curry powders, aged Basmati rice, and everyday South Asian provisions available across the UK.';
  let canonical = `${SITE_URL}/shop`;

  if (resolvedParams.category) {
    try {
      await connectToDatabase();
      const cat = await Category.findOne({ slug: resolvedParams.category }).lean();
      if (cat) {
        title = `Buy ${cat.name} Online UK | Sithisha Grocery & Snack`;
        description = cat.description
          ? `Order ${cat.name} online in the UK. ${cat.description}`
          : `Shop authentic ${cat.name} at Sithisha Grocery & Snack UK. Fast local delivery and direct WhatsApp ordering.`;
        canonical = `${SITE_URL}/shop?category=${cat.slug}`;
      }
    } catch (e) {
      console.error('Error generating shop metadata:', e);
    }
  } else if (resolvedParams.search) {
    title = `Search Results for "${resolvedParams.search}" | Sithisha Masala & Snacks`;
    description = `Results for ${resolvedParams.search} at Sithisha Grocery & Snack UK. Order online with fast UK shipping.`;
  }

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
    },
  };
}

async function getShopData(params: Awaited<ShopPageProps['searchParams']>) {
  try {
    await connectToDatabase();

    const search = params.search || '';
    const categorySlug = params.category || '';
    const priceRange = params.priceRange || '';
    const inStock = params.inStock === 'true';
    const onSale = params.onSale === 'true';
    const sortBy = params.sortBy || 'featured';
    const page = parseInt(params.page || '1', 10);
    const limit = 12;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { active: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { categoryName: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (categorySlug) {
      const cat = await Category.findOne({ slug: categorySlug });
      if (cat) {
        filter.categoryId = cat._id.toString();
      }
    }

    if (priceRange) {
      if (priceRange === 'under-5') filter.price = { $lt: 5 };
      else if (priceRange === '5-10') filter.price = { $gte: 5, $lte: 10 };
      else if (priceRange === '10-20') filter.price = { $gte: 10, $lte: 20 };
      else if (priceRange === '20-plus') filter.price = { $gt: 20 };
    }

    if (inStock) filter.stock = { $gt: 0 };
    if (onSale) filter.onSale = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sortOptions: any = { featured: -1, createdAt: -1 };
    if (sortBy === 'newest') sortOptions = { createdAt: -1 };
    else if (sortBy === 'price-asc') sortOptions = { price: 1 };
    else if (sortBy === 'price-desc') sortOptions = { price: -1 };
    else if (sortBy === 'name-asc') sortOptions = { name: 1 };
    else if (sortBy === 'name-desc') sortOptions = { name: -1 };
    else if (sortBy === 'best-selling') sortOptions = { bestSeller: -1, price: -1 };

    const skip = (page - 1) * limit;

    const [products, totalCount, categories] = await Promise.all([
      Product.find(filter).sort(sortOptions).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
      Category.find({ active: true }).sort({ displayOrder: 1 }).lean(),
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    const sanitizeData = (data: any) => {
      if (!data) return data;
      const str = JSON.stringify(data)
        .replace(/grocery store/gi, 'masala & snack store')
        .replace(/groceries/gi, 'masalas')
        .replace(/grocery/gi, 'masala')
        .replace(/GROCERIES/g, 'MASALAS')
        .replace(/GROCERY/g, 'MASALA');
      return JSON.parse(str);
    };

    return {
      products: sanitizeData(JSON.parse(JSON.stringify(products))),
      categories: sanitizeData(JSON.parse(JSON.stringify(categories))),
      pagination: { totalCount, totalPages, currentPage: page },
      currentFilters: { categorySlug, search, priceRange, inStock, onSale, sortBy },
    };
  } catch (error) {
    console.error('Shop data fetch error:', error);
    return {
      products: [],
      categories: [],
      pagination: { totalCount: 0, totalPages: 1, currentPage: 1 },
      currentFilters: { categorySlug: '', search: '', priceRange: '', inStock: false, onSale: false, sortBy: 'featured' },
    };
  }
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;
  const { products, categories, pagination, currentFilters } = await getShopData(resolvedParams);

  // Helper to generate filter URLs preserving existing parameters
  const getFilterUrl = (key: string, value: string) => {
    const query: Record<string, string> = { ...resolvedParams };
    if (value) {
      query[key] = value;
    } else {
      delete query[key];
    }
    delete query.page; // Reset page on filter change
    const queryString = new URLSearchParams(query).toString();
    return `/shop${queryString ? `?${queryString}` : ''}`;
  };

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Shop Catalogue', url: '/shop' },
  ];

  if (currentFilters.categorySlug) {
    const activeCategory = categories.find(
      (c: { slug: string; name: string }) => c.slug === currentFilters.categorySlug
    );
    if (activeCategory) {
      breadcrumbItems.push({
        name: activeCategory.name,
        url: `/shop?category=${activeCategory.slug}`,
      });
    }
  }

  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems, SITE_URL);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
            AUTHENTIC PRODUCT CATALOGUE
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Shop Masala & Snacks
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 font-medium">
            Browse our full selection of freshly packed Jaffna savouries, Sri Lankan roasted masalas, Basmati rice, beverages, and daily provisions.
          </p>
        </div>
      </div>

      {/* Main Catalog Layout: Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white rounded-2xl border border-purple-100 p-5 space-y-6 shadow-sm sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-purple-100">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <Filter className="w-4 h-4 text-purple-700" />
                <span>Filters</span>
              </div>
              <Link
                href="/shop"
                className="text-xs font-bold text-purple-700 hover:text-purple-900 underline"
              >
                Reset All
              </Link>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Categories
              </h4>
              <div className="space-y-1.5 text-xs">
                <Link
                  href={getFilterUrl('category', '')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-colors ${
                    !currentFilters.categorySlug
                      ? 'bg-purple-900 text-white font-bold'
                      : 'text-slate-700 hover:bg-purple-50'
                  }`}
                >
                  <span>All Categories</span>
                  {!currentFilters.categorySlug && <Check className="w-3.5 h-3.5" />}
                </Link>
                {categories.map((cat: { _id: string; slug: string; name: string }) => {
                  const isSelected = currentFilters.categorySlug === cat.slug;
                  return (
                    <Link
                      key={cat._id}
                      href={getFilterUrl('category', cat.slug)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-colors ${
                        isSelected
                          ? 'bg-purple-900 text-white font-bold'
                          : 'text-slate-700 hover:bg-purple-50'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-3 pt-4 border-t border-purple-100">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Price Range
              </h4>
              <div className="space-y-1.5 text-xs">
                {[
                  { label: 'All Prices', value: '' },
                  { label: 'Under £5', value: 'under-5' },
                  { label: '£5 – £10', value: '5-10' },
                  { label: '£10 – £20', value: '10-20' },
                  { label: '£20+', value: '20-plus' },
                ].map((range) => {
                  const isSelected = currentFilters.priceRange === range.value;
                  return (
                    <Link
                      key={range.label}
                      href={getFilterUrl('priceRange', range.value)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-colors ${
                        isSelected
                          ? 'bg-purple-900 text-white font-bold'
                          : 'text-slate-700 hover:bg-purple-50'
                      }`}
                    >
                      <span>{range.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="space-y-3 pt-4 border-t border-purple-100">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Availability
              </h4>
              <div className="space-y-1.5 text-xs">
                <Link
                  href={getFilterUrl('inStock', currentFilters.inStock ? '' : 'true')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-colors ${
                    currentFilters.inStock
                      ? 'bg-purple-900 text-white font-bold'
                      : 'text-slate-700 hover:bg-purple-50'
                  }`}
                >
                  <span>In Stock Only</span>
                  {currentFilters.inStock && <Check className="w-3.5 h-3.5" />}
                </Link>
                <Link
                  href={getFilterUrl('onSale', currentFilters.onSale ? '' : 'true')}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl font-medium transition-colors ${
                    currentFilters.onSale
                      ? 'bg-purple-900 text-white font-bold'
                      : 'text-slate-700 hover:bg-purple-50'
                  }`}
                >
                  <span>On Sale / Discounted</span>
                  {currentFilters.onSale && <Check className="w-3.5 h-3.5" />}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Product Grid & Sorting */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Control Bar: Total Count & Sort Selector */}
          <div className="bg-white rounded-2xl border border-purple-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <span className="text-xs font-bold text-slate-600">
              Showing <span className="text-purple-950 font-extrabold">{products.length}</span> of{' '}
              <span className="text-purple-950 font-extrabold">{pagination.totalCount}</span> products
            </span>

            {/* Sort Selector Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-purple-700 shrink-0" />
              <span className="text-xs font-bold text-slate-700">Sort by:</span>
              <div className="flex items-center gap-1 text-xs">
                {[
                  { label: 'Featured', value: 'featured' },
                  { label: 'Newest', value: 'newest' },
                  { label: 'Price: Low to High', value: 'price-asc' },
                  { label: 'Price: High to Low', value: 'price-desc' },
                ].map((sortOption) => {
                  const isSelected = currentFilters.sortBy === sortOption.value;
                  return (
                    <Link
                      key={sortOption.value}
                      href={getFilterUrl('sortBy', sortOption.value)}
                      className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-colors ${
                        isSelected
                          ? 'bg-purple-950 text-white shadow-sm'
                          : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                      }`}
                    >
                      {sortOption.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Product Grid Component */}
          <Suspense fallback={<ProductGrid products={[]} isLoading />}>
            <ProductGrid products={products} />
          </Suspense>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              {pagination.currentPage > 1 && (
                <Link
                  href={getFilterUrl('page', (pagination.currentPage - 1).toString())}
                  className="p-2.5 bg-white border border-purple-200 text-purple-900 hover:bg-purple-50 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous
                </Link>
              )}

              {Array.from({ length: pagination.totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isCurrent = pageNum === pagination.currentPage;
                return (
                  <Link
                    key={pageNum}
                    href={getFilterUrl('page', pageNum.toString())}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl font-extrabold text-xs transition-colors ${
                      isCurrent
                        ? 'bg-purple-900 text-white shadow-md'
                        : 'bg-white border border-purple-100 text-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}

              {pagination.currentPage < pagination.totalPages && (
                <Link
                  href={getFilterUrl('page', (pagination.currentPage + 1).toString())}
                  className="p-2.5 bg-white border border-purple-200 text-purple-900 hover:bg-purple-50 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
