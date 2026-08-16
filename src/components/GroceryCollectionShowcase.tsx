'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Sparkles, ShoppingBag } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const MINI_COLLECTIONS = [
  { name: 'Pantry Essentials', href: '/shop?category=pickles-sauces', desc: 'Flours, lentils, oils & coconut milk' },
  { name: 'Crispy Snacks', href: '/shop?category=snacks-savouries', desc: 'Jaffna mixture, cassava & murukku' },
  { name: 'Spices & Masalas', href: '/shop?category=spices-masalas', desc: 'Roasted curry powders & red chilli' },
  { name: 'Rice & Grains', href: '/shop?category=rice-grains', desc: 'Extra long Basmati & samba rice' },
  { name: 'Sweets & Treats', href: '/shop?category=sweets-biscuits', desc: 'Traditional sweets & tea biscuits' },
];

export default function GroceryCollectionShowcase() {
  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-purple-50/90 via-white to-purple-50/90 text-slate-900 rounded-3xl p-8 sm:p-12 lg:p-14 border border-purple-100 shadow-sm overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* LEFT: Rich Visual Grocery Image Composition */}
          <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-md aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden border-2 border-purple-200 shadow-xl group bg-purple-50">
              <Image
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80"
                alt="Sithisha Kitchen Showcase"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              {/* Floating Badge 1 */}
              <div className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-purple-100 shadow-lg text-xs font-bold text-purple-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Hand-Selected Masala & Pantry
              </div>

              {/* Floating Info Overlay */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-purple-100 shadow-xl text-slate-900">
                <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest block mb-0.5">
                  KITCHEN SPECIALS
                </span>
                <h4 className="font-extrabold text-sm text-slate-900">Authentic South Asian Pantry</h4>
                <p className="text-xs text-slate-600 mt-0.5">Fresh shipments arriving weekly in Birmingham.</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Text Content & Collection Links */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black uppercase tracking-wider border border-purple-200">
              CURATED SELECTION
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
              Everything Your <span className="text-purple-700">Kitchen Needs</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              From everyday pantry staples to delicious crispy snacks, explore our comprehensive collection selected specially for authentic home cooking and tea-time enjoyment.
            </p>

            {/* Collection Mini Links */}
            <div className="space-y-2.5 pt-1">
              {MINI_COLLECTIONS.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="group flex items-center justify-between p-3.5 rounded-xl bg-white hover:bg-purple-50/80 border border-purple-100 hover:border-purple-300 transition-all duration-300 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {item.desc}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-900 hover:bg-purple-800 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-purple-subtle group"
              >
                <ShoppingBag className="w-4 h-4" /> Shop All Products
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </AnimatedSection>
  );
}
