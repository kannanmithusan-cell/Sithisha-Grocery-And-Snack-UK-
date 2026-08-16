'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { IEditorialImage } from '@/models/HomepageConfig';

interface ShelvesToHomeSectionProps {
  editorialImages?: IEditorialImage[];
}

export default function ShelvesToHomeSection({ editorialImages = [] }: ShelvesToHomeSectionProps) {
  const adminImg = editorialImages.find((img) => img.section === 'shelves-to-home' && img.active);
  const bgUrl = adminImg?.url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80';

  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative rounded-3xl overflow-hidden border border-purple-100 shadow-xl bg-slate-950 min-h-[420px] sm:min-h-[480px] flex items-center group">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image src={bgUrl} alt="From Our Shelves To Your Home" fill className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/90 via-purple-950/70 to-transparent" />
        </div>
        <div className="relative z-10 p-8 sm:p-14 max-w-xl space-y-6">
          <div className="surface-cream p-8 sm:p-10 rounded-3xl border border-amber-200/80 shadow-2xl space-y-5 text-slate-900">
            <span className="text-[10px] font-black text-purple-800 uppercase tracking-widest block">EDITORIAL MASALA SELECTION</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight uppercase text-purple-950">FROM OUR SHELVES TO YOUR HOME</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">We carefully hand-select, inspect, and package Ceylon spices, authentic snacks, extra-long Basmati rice, and daily South Asian essentials so your kitchen feels completely stocked with love.</p>
            <div className="pt-2">
              <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-purple-950 font-black rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all group/btn">
                <ShoppingBag className="w-4 h-4" /> Explore Masala Shelves <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
