'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { IEditorialImage } from '@/models/HomepageConfig';

interface DiscoverNewCTAProps {
  editorialImages?: IEditorialImage[];
}

export default function DiscoverNewCTA({ editorialImages = [] }: DiscoverNewCTAProps) {
  const adminImg = editorialImages.find((img) => img.section === 'discover-new' && img.active);

  const bgUrl =
    adminImg?.url ||
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1600&auto=format&fit=crop&q=80';
  const title = (adminImg?.title || 'DISCOVER SOMETHING NEW THIS WEEK.').replace(/grocery|groceries/gi, 'Masala');
  const subtitle =
    (adminImg?.subtitle ||
    'New authentic snacks, tea-time cookies, and specialty pantry items have just arrived at our store. Explore our latest additions today.').replace(/grocery|groceries/gi, 'masala');
  const link = adminImg?.link || '/shop?sortBy=newest';

  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative rounded-[3rem] overflow-hidden border border-purple-900 shadow-2xl bg-purple-950 min-h-[380px] sm:min-h-[440px] flex items-center group">
        
        {/* Background Food Photograph */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={bgUrl}
            alt="Discover Something New"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-45"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/95 via-purple-950/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 sm:p-14 max-w-2xl space-y-6 text-white">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/90 border border-purple-700/60 text-amber-300 text-xs font-black uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" /> FRESH ARRIVALS
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight uppercase">
            {title}
          </h2>

          <p className="text-xs sm:text-base text-purple-100 leading-relaxed font-medium">
            {subtitle}
          </p>
        </div>

      </div>
    </AnimatedSection>
  );
}
