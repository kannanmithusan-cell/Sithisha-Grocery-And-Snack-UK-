'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { IEditorialImage } from '@/models/HomepageConfig';

const DEFAULT_COLLAGE = [
  { title: 'Pure Single Spices & Chilli', subtitle: 'Hand-ground for rich curry color.', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80', link: '/shop?category=spices-masalas', tag: '🌶️ Pure Spices', span: 'md:col-span-8 h-80 sm:h-96' },
  { title: 'Crispy Jaffna Snacks', subtitle: 'Crunchy tea-time savouries.', img: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281276?w=800&auto=format&fit=crop&q=80', link: '/shop?category=snacks-savouries', tag: '🍪 Crisp Savouries', span: 'md:col-span-4 h-80 sm:h-96' },
  { title: 'Aged Basmati & Samba Rice', subtitle: 'Fragrant grains for family meals.', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80', link: '/shop?category=rice-grains', tag: '🌾 Royal Basmati', span: 'md:col-span-4 h-64 sm:h-72' },
  { title: 'Fiery Brews & Refreshment', subtitle: 'Traditional sparkling drinks.', img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&auto=format&fit=crop&q=80', link: '/shop?category=beverages', tag: '🥤 Drinks & Brews', span: 'md:col-span-8 h-64 sm:h-72' },
];

interface FoodColorSectionProps {
  editorialImages?: IEditorialImage[];
}

export default function FoodColorSection({ editorialImages = [] }: FoodColorSectionProps) {
  const foodColorImages = editorialImages.filter((img) => img.section.startsWith('food-color') && img.active);

  const collageItems = DEFAULT_COLLAGE.map((item, idx) => {
    const sectionKey = `food-color-${idx + 1}`;
    const adminImg = foodColorImages.find((img) => img.section === sectionKey);
    return {
      ...item,
      title: adminImg?.title || item.title,
      subtitle: adminImg?.subtitle || item.subtitle,
      img: adminImg?.url || item.img,
      link: adminImg?.link || item.link,
      tag: adminImg?.tag || item.tag,
    };
  });

  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black text-purple-800 uppercase tracking-widest block mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> EDITORIAL FOOD MAGAZINE
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">
              BRING HOME THE FLAVOUR
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Vibrant spices, golden savouries, and fragrant Basmati rice — curated for authentic kitchens.
            </p>
          </div>
          <Link href="/shop" className="text-xs font-extrabold text-purple-800 hover:text-purple-950 flex items-center gap-1.5 group shrink-0">
            <ShoppingBag className="w-4 h-4" /> Explore Food Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {collageItems.map((item, idx) => (
            <Link key={idx} href={item.link} className={`group relative ${item.span} rounded-3xl overflow-hidden border border-purple-100 shadow-sm hover:shadow-purple-subtle transition-all duration-500 flex flex-col justify-end p-6`}>
              <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
              <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-purple-950 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md">{item.tag}</span>
              <div className="relative z-10 space-y-1">
                <h3 className="text-lg sm:text-2xl font-black text-white group-hover:text-amber-300 transition-colors">{item.title}</h3>
                <p className="text-xs text-purple-200 font-medium">{item.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
