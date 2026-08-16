'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { IEditorialImage } from '@/models/HomepageConfig';

interface BrandStorySectionProps {
  editorialImages?: IEditorialImage[];
}

export default function BrandStorySection({ editorialImages = [] }: BrandStorySectionProps) {
  const adminImg = editorialImages.find((img) => img.section === 'brand-story' && img.active);
  const imgUrl = adminImg?.url || 'https://images.unsplash.com/photo-1621996346565-e3d5d6281276?w=800&auto=format&fit=crop&q=80';
  const title = (adminImg?.title || 'FOOD THAT FEELS LIKE HOME.').replace(/grocery|groceries/gi, 'Masala & Snacks');
  const subtitle =
    (adminImg?.subtitle ||
    'At Sithisha Masala & Snacks, we bring together Ceylon spices, tea-time savouries, and everyday South Asian essentials that make food feel warm and familiar.').replace(/grocery|groceries/gi, 'masala & snack');

  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="surface-cream rounded-3xl p-8 sm:p-14 border border-amber-200/80 shadow-md relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-900 text-xs font-black uppercase tracking-wider">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> BRAND STORY
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight uppercase">
              {title}
            </h2>
            <div className="space-y-4 text-xs sm:text-base text-slate-700 leading-relaxed font-medium">
              <p className="text-base sm:text-lg font-bold text-slate-900 italic">&quot;Some flavours are more than flavours. They bring back memories.&quot;</p>
              <p>{subtitle}</p>
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden border-2 border-amber-300 shadow-xl bg-white group">
              <Image src={imgUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 1024px) 100vw, 40vw" />
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
