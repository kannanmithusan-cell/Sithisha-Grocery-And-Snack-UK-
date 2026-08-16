'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { ICtaImage } from '@/models/HomepageConfig';

interface WhatsAppCTAProps {
  ctaImage?: ICtaImage;
}

export default function WhatsAppCTA({ ctaImage }: WhatsAppCTAProps) {
  const bgUrl =
    ctaImage?.url && ctaImage?.active !== false
      ? ctaImage.url
      : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80';

  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative rounded-[3rem] overflow-hidden shadow-xl border border-purple-100 min-h-[420px] sm:min-h-[480px] flex items-center bg-purple-950 text-white group">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={bgUrl}
            alt="What's Going In Your Basket"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-40"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/95 via-purple-950/85 to-purple-900/60" />
        </div>

        {/* Floating Badges */}
        <div className="absolute top-8 right-12 z-20 hidden md:flex items-center gap-2 bg-purple-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-400 text-amber-300 text-xs font-black animate-float-slow">
          🛍️ Basket Ready
        </div>
        <div className="absolute bottom-10 left-12 z-20 hidden md:flex items-center gap-2 bg-purple-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-emerald-400 text-emerald-300 text-xs font-black animate-float-reverse">
          🍪 Crisp Savouries & Spices
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center p-8 sm:p-14 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/90 border border-purple-700/60 text-amber-300 text-xs font-black uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" /> READY TO FILL YOUR KITCHEN?
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight uppercase">
            WHAT&apos;S GOING IN YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-purple-200">BASKET?</span>
          </h2>

          <p className="text-xs sm:text-base text-purple-100 leading-relaxed font-medium max-w-xl mx-auto">
            Browse authentic snacks, aromatic spices, fragrant Basmati rice, and everyday masala favourites. Add them to your basket and checkout in just a few simple steps.
          </p>

          <div className="pt-2 flex justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-9 py-4 bg-amber-400 hover:bg-amber-300 text-purple-950 font-black rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-amber-400/30 group/btn"
            >
              <ShoppingBag className="w-5 h-5 text-purple-950 group-hover/btn:scale-110 transition-transform" />
              <span>Start Shopping</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </AnimatedSection>
  );
}
