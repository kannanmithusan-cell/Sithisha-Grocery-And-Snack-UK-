'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { IProduct } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: IProduct;
  variant?: 'cream' | 'color' | 'image-first';
}

const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f0ff'/%3E%3Crect x='140' y='120' width='120' height='100' rx='12' fill='%23e9d5ff'/%3E%3Ccircle cx='170' cy='155' r='15' fill='%23c4b5fd'/%3E%3Cpolygon points='140,220 175,170 205,195 235,155 260,220' fill='%23a78bfa'/%3E%3Ctext x='200' y='270' font-family='sans-serif' font-size='14' fill='%237c3aed' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

function ProductImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState<string>(src || FALLBACK_IMG);

  if (imgSrc.startsWith('data:')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imgSrc}
        alt={alt}
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        onError={() => setImgSrc(FALLBACK_IMG)}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-500"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      onError={() => setImgSrc(FALLBACK_IMG)}
    />
  );
}

function getCategorySurfaceClass(catName?: string): string {
  if (!catName) return 'surface-cream';
  const lower = catName.toLowerCase();
  if (lower.includes('snack') || lower.includes('savour')) return 'surface-orange';
  if (lower.includes('spice') || lower.includes('masala') || lower.includes('chilli')) return 'surface-red';
  if (lower.includes('sweet') || lower.includes('biscuit')) return 'surface-berry';
  if (lower.includes('drink') || lower.includes('beverage')) return 'surface-green';
  if (lower.includes('rice') || lower.includes('grain')) return 'surface-beige';
  return 'surface-cream';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'cream' }) => {
  const { addToCart } = useCart();

  const originalPriceVal = product.originalPrice || 0;
  // STRICT RULE 37: Only display discount when real discount exists (originalPrice > price)
  const hasDiscount = !!product.onSale && originalPriceVal > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPriceVal - product.price) / originalPriceVal) * 100)
    : 0;
  const isOutOfStock = product.stock <= 0;

  const surfaceClass = getCategorySurfaceClass(product.categoryName);

  return (
    <div
      className={`group ${surfaceClass} rounded-3xl border shadow-sm hover:shadow-purple-subtle transition-all duration-500 flex flex-col overflow-hidden relative transform hover:-translate-y-1.5`}
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden p-3">
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white/60 shadow-xs border border-black/5">
          <Link href={`/product/${product.slug}`} className="block w-full h-full">
            <ProductImage src={product.images?.[0] || ''} alt={product.name} />
          </Link>

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
            {hasDiscount && discountPercent > 0 && (
              <span className="bg-amber-400 text-purple-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
                SAVE {discountPercent}%
              </span>
            )}
            {product.featured && (
              <span className="bg-purple-900 text-amber-300 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Featured
              </span>
            )}
          </div>

          {/* Quick View Button Hover overlay */}
          <div className="absolute inset-0 bg-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
            <Link
              href={`/product/${product.slug}`}
              className="pointer-events-auto p-2.5 bg-white text-purple-950 rounded-xl shadow-lg hover:bg-purple-900 hover:text-white transition-colors"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-[10px] font-black text-purple-800 uppercase tracking-widest block mb-1">
            {product.categoryName || 'Masala & Snacks'}
          </span>
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-extrabold text-slate-900 text-sm hover:text-purple-800 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing & Stock Status */}
        <div className="pt-1 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-purple-950">
              £{product.price.toFixed(2)}
            </span>
            {hasDiscount && product.originalPrice && (
              <span className="text-xs text-slate-400 line-through font-medium">
                £{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              isOutOfStock
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : 'In Stock'}
          </span>
        </div>

        {/* Primary Action Button: Clean Full-Width Add to Cart */}
        <div className="pt-2 border-t border-purple-100/60">
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => addToCart(product, 1)}
            className="w-full py-2.5 px-4 bg-purple-950 hover:bg-purple-900 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
