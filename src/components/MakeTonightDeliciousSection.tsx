'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { IEditorialImage } from '@/models/HomepageConfig';

interface MakeTonightDeliciousSectionProps {
  editorialImages?: IEditorialImage[];
}

export default function MakeTonightDeliciousSection({ editorialImages = [] }: MakeTonightDeliciousSectionProps) {
  const adminImg = editorialImages.find((img) => img.section === 'make-tonight' && img.active);
  const imgUrl = adminImg?.url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80';
  const title = (adminImg?.title || 'MAKE TONIGHT DELICIOUS.').replace(/grocery|groceries/gi, 'Masala');
  const subtitle =
    (adminImg?.subtitle ||
    'Transform family dinner into a celebratory feast. From roasted Sri Lankan curry powders to freshly baked butter biscuits and ginger drinks — make tonight worth remembering.').replace(/grocery|groceries/gi, 'masala');

  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="surface-beige rounded-3xl p-8 sm:p-14 border border-purple-100/90 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <span className="text-xs font-black text-purple-800 uppercase tracking-widest block flex items-center justify-center lg:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> LIFESTYLE FOOD MOMENT
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase leading-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-base text-slate-700 leading-relaxed font-medium">
              {subtitle}
            </p>
          </div>
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden border-2 border-amber-300 shadow-xl group bg-white">
              <Image src={imgUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
