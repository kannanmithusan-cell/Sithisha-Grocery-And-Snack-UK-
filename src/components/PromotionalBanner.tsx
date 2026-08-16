'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

interface PromotionalBannerProps {
  promotionalBanners?: {
    url: string;
    title: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    badgeText?: string;
    active: boolean;
    displayOrder: number;
  }[];
}

export default function PromotionalBanner({ promotionalBanners = [] }: PromotionalBannerProps) {
  const activeBanners = promotionalBanners.filter((b) => b.active);
  const banner = activeBanners[0];

  const imageUrl = banner?.url || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1600&auto=format&fit=crop&q=80';
  const badgeText = banner?.badgeText || 'Premium Quality Assured';
  const title = banner?.title || 'Good Food Starts With Good Ingredients.';
  const description =
    banner?.description ||
    'Discover carefully sourced masalas, hand-roasted curry powders, aromatic spices, and traditional Sri Lankan & South Asian snacks selected for your home kitchen.';
  const buttonText = banner?.buttonText ? banner.buttonText.replace(/groceries/gi, 'Collection') : 'Explore Collection';
  const buttonLink = banner?.buttonLink || '/shop';

  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-purple-100 min-h-[380px] sm:min-h-[440px] flex items-center group bg-slate-900 text-white">
        {/* Rich Background Food/Grocery Image with Hover Scale */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out opacity-60"
            sizes="100vw"
          />
          {/* Subtle Overlay to contrast text */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/90 via-purple-950/60 to-purple-900/20" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 p-8 sm:p-14 max-w-xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-900/80 border border-purple-700/60 text-amber-300 text-xs font-black uppercase tracking-wider shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" /> {badgeText}
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            {title}
          </h2>

          <p className="text-xs sm:text-base text-purple-100 leading-relaxed font-medium">
            {description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href={buttonLink}
              className="px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-purple-950 font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-amber-400/20 flex items-center gap-2 group/btn"
            >
              <ShoppingBag className="w-4 h-4" /> {buttonText}
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/about"
              className="px-6 py-3.5 bg-purple-950/70 hover:bg-purple-900 text-white font-bold rounded-2xl text-xs border border-purple-700/80 transition-colors backdrop-blur-md"
            >
              Our Quality Promise
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
