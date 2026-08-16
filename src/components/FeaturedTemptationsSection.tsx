'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { IProduct } from '@/types';
import ProductCard from './ProductCard';
import AnimatedSection from './AnimatedSection';
import { useCart } from '@/context/CartContext';

interface FeaturedTemptationsSectionProps {
  products: IProduct[];
}

export default function FeaturedTemptationsSection({ products }: FeaturedTemptationsSectionProps) {
  const { addToCart } = useCart();
  if (!products || products.length === 0) return null;

  const mainFeatured = products[0];
  const supportingProducts = products.slice(1, 7);

  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black text-purple-800 uppercase tracking-widest block mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> CURATED SELECTION
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">
              TODAY&apos;S TEMPTATIONS
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Handpicked favourites for your next snack break, meal or craving.
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs font-extrabold text-purple-800 hover:text-purple-950 flex items-center gap-1.5 group shrink-0"
          >
            Explore All Temptations <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Asymmetric Product Composition Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* VISUALLY DOMINANT LARGE FEATURED PRODUCT PICK */}
          {mainFeatured && (
            <div className="lg:col-span-5 surface-orange rounded-[3rem] p-8 border border-amber-200/80 shadow-md flex flex-col justify-between relative group overflow-hidden">
              <div className="space-y-4 relative z-10">
                <span className="bg-amber-400 text-purple-950 font-black text-xs uppercase px-3.5 py-1 rounded-full shadow-sm inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> FEATURED PICK
                </span>

                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  &quot;A snack worth sharing.&quot;
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 line-clamp-3 font-medium">
                  {mainFeatured.name} — {mainFeatured.description || 'Authentic flavor packed for tea-time and gatherings.'}
                </p>
              </div>

              {/* Large Product Photography */}
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden my-6 border-2 border-white shadow-xl bg-white group-hover:scale-105 transition-transform duration-700">
                <Image
                  src={mainFeatured.images?.[0] || 'https://images.unsplash.com/photo-1621996346565-e3d5d6281276?w=600'}
                  alt={mainFeatured.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex items-center justify-between pt-2 relative z-10">
                <div>
                  <span className="text-xs text-slate-500 font-bold block">Special Price</span>
                  <span className="text-2xl font-black text-purple-950">£{mainFeatured.price.toFixed(2)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(mainFeatured, 1)}
                  className="px-6 py-3 bg-purple-950 hover:bg-purple-900 text-white font-black rounded-2xl text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Basket
                </button>
              </div>
            </div>
          )}

          {/* SUPPORTING PRODUCTS GRID */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportingProducts.map((prod) => (
              <ProductCard key={prod._id || prod.slug} product={prod} variant="cream" />
            ))}
          </div>

        </div>

      </div>
    </AnimatedSection>
  );
}
