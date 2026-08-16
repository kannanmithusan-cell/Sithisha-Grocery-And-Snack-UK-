'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ICategory } from '@/types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface QuickCategoryStripProps {
  categories: ICategory[];
}

function getCardShapeStyle(cat: ICategory, index: number): { shapeClass: string; bgClass: string } {
  if (cat.shapeType === 'arch') return { shapeClass: 'shape-arch', bgClass: 'surface-orange' };
  if (cat.shapeType === 'ticket') return { shapeClass: 'shape-ticket', bgClass: 'surface-red' };
  if (cat.shapeType === 'organic') return { shapeClass: 'shape-organic', bgClass: 'surface-berry' };
  if (cat.shapeType === 'editorial') return { shapeClass: 'rounded-3xl', bgClass: 'surface-green' };

  const variants = [
    { shapeClass: 'shape-arch', bgClass: 'surface-orange' },
    { shapeClass: 'shape-organic', bgClass: 'surface-red' },
    { shapeClass: 'shape-ticket', bgClass: 'surface-berry' },
    { shapeClass: 'rounded-3xl', bgClass: 'surface-green' },
    { shapeClass: 'rounded-t-[3.5rem] rounded-b-2xl', bgClass: 'surface-beige' },
  ];
  return variants[index % variants.length];
}

export default function QuickCategoryStrip({ categories }: QuickCategoryStripProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div id="craving-categories" className="py-14 bg-gradient-to-b from-amber-50/30 via-white to-purple-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-black text-purple-800 uppercase tracking-widest block flex items-center justify-center sm:justify-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> VISUAL CRAVING DISCOVERY
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">
            WHAT ARE YOU CRAVING?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            From crunchy savouries to roasted Ceylon spices, find something worth craving.
          </p>
        </div>

        {/* Asymmetric Visual Grid of Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, idx) => {
            const { shapeClass, bgClass } = getCardShapeStyle(cat, idx);

            return (
              <Link
                key={cat._id || cat.slug}
                href={`/shop?category=${cat.slug}`}
                className={`group ${bgClass} ${shapeClass} p-5 flex flex-col justify-between h-64 sm:h-72 border shadow-sm hover:shadow-purple-subtle transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden`}
              >
                {/* Large Food Photography */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white/70 shadow-xs border border-black/5 mb-3 group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src={cat.image || 'https://images.unsplash.com/photo-1621996346565-e3d5d6281276?w=400'}
                    alt={cat.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div className="text-center space-y-0.5">
                  <span className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-purple-800 transition-colors line-clamp-1">
                    {cat.name.replace(/grocery|groceries/gi, 'Masala & Snacks')}
                  </span>
                  <span className="text-[10px] font-bold text-purple-700 block">
                    {cat.productCount ? `${cat.productCount} Items` : 'Explore →'}
                  </span>
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1.5 rounded-full shadow-md">
                  <ArrowRight className="w-3.5 h-3.5 text-purple-900" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
