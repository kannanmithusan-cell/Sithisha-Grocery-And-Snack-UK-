import type { Metadata } from 'next';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import ProductGallery from '@/components/ProductGallery';
import ProductActions from '@/components/ProductActions';
import { ArrowLeft, ShieldCheck, Truck, RefreshCw, MessageCircle } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import JsonLd, { getProductSchema, getBreadcrumbSchema } from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sithishamasala.co.uk';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductDetail(slug);

  if (!data || !data.product) {
    return {
      title: 'Product Not Found | Sithisha Grocery & Snack UK',
      description: 'The requested product could not be found.',
    };
  }

  const { product } = data;
  const title = `Buy ${product.name} Online UK | Sithisha Grocery & Snack`;
  const rawDesc = product.shortDescription || product.description || product.name;
  const description =
    rawDesc.length > 160 ? `${rawDesc.substring(0, 157)}...` : rawDesc;
  const canonical = `${SITE_URL}/product/${product.slug}`;
  const images = product.images && product.images.length > 0 ? product.images : [`${SITE_URL}/logo.jpg`];

  return {
    title,
    description,
    keywords: [
      product.name,
      product.categoryName || 'Masala & Snacks',
      `Buy ${product.name} UK`,
      'Sithisha Masala',
      `Order ${product.name} Birmingham`,
      'South Asian Grocery UK',
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Sithisha Masala & Snacks UK',
      images: images.map((imgUrl: string) => ({
        url: imgUrl,
        alt: `${product.name} - Sithisha Grocery & Snack UK`,
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [images[0]],
    },
  };
}

async function getProductDetail(slug: string) {
  try {
    await connectToDatabase();
    const product = await Product.findOne({ slug, active: true }).lean();
    if (!product) return null;

    // Fetch related products in the same category
    const relatedProducts = await Product.find({
      categoryId: product.categoryId,
      _id: { $ne: product._id },
      active: true,
    })
      .limit(4)
      .lean();

    return {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
    };
  } catch (error) {
    console.error('Error fetching product detail:', error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const data = await getProductDetail(slug);

  if (!data || !data.product) {
    notFound();
  }

  const { product, relatedProducts } = data;

  const originalPriceVal = product.originalPrice || 0;
  const hasDiscount =
    !!product.onSale &&
    originalPriceVal > product.price;

  const discountPercent = hasDiscount
    ? Math.round(((originalPriceVal - product.price) / originalPriceVal) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;

  const productSchema = getProductSchema(product, SITE_URL);
  const breadcrumbSchema = getBreadcrumbSchema(
    [
      { name: 'Home', url: '/' },
      { name: 'Shop Catalogue', url: '/shop' },
      { name: product.categoryName || 'Category', url: `/shop` },
      { name: product.name, url: `/product/${product.slug}` },
    ],
    SITE_URL
  );

  return (
    <>
      <JsonLd data={productSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Back Button Link */}
      <div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Shop Catalog
        </Link>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Side: Cloudinary Image Gallery (Supporting strictly MAX 4 IMAGES) */}
        <div className="lg:col-span-6">
          <ProductGallery images={product.images || []} productName={product.name} />
        </div>

        {/* Right Side: Product Details & Purchase Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-purple-700 uppercase tracking-widest block">
              {product.categoryName || 'Masala & Snacks'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>
            {product.sku && (
              <span className="text-xs text-slate-400 font-mono block">
                SKU: {product.sku}
              </span>
            )}
          </div>

          {/* Pricing & Discount */}
          <div className="flex items-center gap-4 bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
            <span className="text-3xl font-black text-purple-950">
              £{product.price.toFixed(2)}
            </span>

            {hasDiscount && product.originalPrice && (
              <span className="text-base text-slate-400 line-through font-medium">
                £{product.originalPrice.toFixed(2)}
              </span>
            )}

            {discountPercent > 0 && (
              <span className="bg-amber-400 text-purple-950 text-xs font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
                SAVE {discountPercent}%
              </span>
            )}

            <span
              className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${
                isOutOfStock
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock})`}
            </span>
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-sm font-medium text-slate-600 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Client Interactive Add to Cart & WhatsApp Order Actions */}
          <ProductActions product={product} />

          {/* Full Description */}
          <div className="pt-6 border-t border-purple-100 space-y-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Product Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-purple-100 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-purple-100">
              <Truck className="w-4 h-4 text-purple-700 shrink-0" />
              <span>Fast UK Shipping</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-purple-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Quality Assurance</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-purple-100">
              <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct Store WhatsApp Support</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-purple-100">
              <RefreshCw className="w-4 h-4 text-purple-700 shrink-0" />
              <span>Fresh Weekly Deliveries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-purple-100 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              You Might Also Like
            </h2>
            <Link href="/shop" className="text-xs font-bold text-purple-700 hover:underline">
              Browse All →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map((rel: typeof product) => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
    </>
  );
}
