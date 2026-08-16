'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const DEFAULT_GALLERY_ITEMS = [
  {
    title: 'Authentic Jaffna Savouries',
    category: 'Snacks & Savouries',
    img: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281276?w=800&auto=format&fit=crop&q=80',
    link: '/shop?category=snacks-savouries',
    tag: 'Crispy & Spicy',
  },
  {
    title: 'Ceylon Dark Roasted Curry Powder',
    category: 'Spices & Masalas',
    img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
    link: '/shop?category=spices-masalas',
    tag: 'Aromatic & Pure',
  },
  {
    title: 'Royal Aged Extra Long Basmati',
    category: 'Rice & Grains',
    img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    link: '/shop?category=rice-grains',
    tag: 'Premium Aged 5kg',
  },
  {
    title: 'Fiery Elephant Ginger Beer',
    category: 'Beverages & Drinks',
    img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&auto=format&fit=crop&q=80',
    link: '/shop?category=beverages',
    tag: 'Refreshing Brew',
  },
  {
    title: 'Traditional Spicy Green Lime Pickle',
    category: 'Pickles & Sambals',
    img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
    link: '/shop?category=pickles-sauces',
    tag: 'Tangy & Spicy',
  },
];

interface GroceryGallerySectionProps {
  galleryImages?: {
    url: string;
    title?: string;
    category?: string;
    active: boolean;
    displayOrder: number;
  }[];
}

export default function GroceryGallerySection({ galleryImages = [] }: GroceryGallerySectionProps) {
  const activeGallery = galleryImages.filter((g) => g.active);
  const items =
    activeGallery.length > 0
      ? activeGallery.map((g) => ({
          title: g.title || 'Sithisha Masala & Snacks Showcase',
          category: g.category || 'Store Essentials',
          img: g.url,
          link: '/shop',
          tag: 'Fresh Arrival',
        }))
      : DEFAULT_GALLERY_ITEMS;

  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-gradient-to-b from-purple-50/50 via-white to-amber-50/30 rounded-3xl p-8 sm:p-12 border border-purple-100 shadow-xs relative overflow-hidden">
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-4 left-6 w-12 h-12 rounded-full bg-amber-400/20 blur-xl animate-float-slow pointer-events-none" />
        <div className="absolute bottom-6 right-8 w-16 h-16 rounded-full bg-purple-500/20 blur-xl animate-float-reverse pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-extrabold text-purple-800 uppercase tracking-widest block mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> FLAVOURS & MOMENTS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              A Taste of Sithisha
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Explore authentic Sri Lankan & South Asian ingredients carefully packed for your family.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-purple-800 hover:text-purple-950 flex items-center gap-1.5 group shrink-0"
          >
            <ShoppingBag className="w-4 h-4" /> Browse Complete Gallery{' '}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Colorful Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Item 1 - Large Feature Left */}
          {items[0] && (
            <Link
              href={items[0].link}
              className="md:col-span-7 group relative h-72 sm:h-96 rounded-3xl overflow-hidden border border-purple-100 shadow-sm hover:shadow-purple-subtle transition-all duration-500 flex flex-col justify-end p-6"
            >
              <Image
                src={items[0].img}
                alt={items[0].title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

              <span className="absolute top-4 left-4 bg-amber-400 text-purple-950 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md animate-float-slow">
                {items[0].tag}
              </span>

              <div className="relative z-10 space-y-1">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                  {items[0].category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300 transition-colors">
                  {items[0].title}
                </h3>
              </div>
            </Link>
          )}

          {/* Item 2 - Feature Right */}
          {items[1] && (
            <Link
              href={items[1].link}
              className="md:col-span-5 group relative h-72 sm:h-96 rounded-3xl overflow-hidden border border-purple-100 shadow-sm hover:shadow-purple-subtle transition-all duration-500 flex flex-col justify-end p-6"
            >
              <Image
                src={items[1].img}
                alt={items[1].title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

              <span className="absolute top-4 left-4 bg-purple-900 text-amber-300 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md border border-purple-700">
                {items[1].tag}
              </span>

              <div className="relative z-10 space-y-1">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                  {items[1].category}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                  {items[1].title}
                </h3>
              </div>
            </Link>
          )}

          {/* Additional Items */}
          {items.slice(2).map((item, idx) => (
            <Link
              key={idx}
              href={item.link}
              className="md:col-span-4 group relative h-64 rounded-3xl overflow-hidden border border-purple-100 shadow-xs hover:shadow-purple-subtle transition-all duration-500 flex flex-col justify-end p-5"
            >
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-purple-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs border border-purple-100">
                {item.tag}
              </span>

              <div className="relative z-10 space-y-0.5">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                  {item.category}
                </span>
                <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </AnimatedSection>
  );
}
