'use client';

import React from 'react';
import { Sparkles, ShieldCheck, HeartHandshake, ShoppingBag, Star } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

export default function WhyChooseSithisha() {
  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="surface-cream rounded-[3rem] p-8 sm:p-14 border border-amber-200/80 shadow-sm relative overflow-hidden">
        
        {/* Central Visual Typography Composition */}
        <div className="text-center max-w-3xl mx-auto space-y-10">
          <div>
            <span className="text-xs font-black text-purple-800 uppercase tracking-widest block mb-2 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> OUR PROMISE TO YOU
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">
              WHY FOOD LOVERS CHOOSE <span className="text-purple-800">SITHISHA</span>
            </h2>
          </div>

          {/* Central Visual Composition */}
          <div className="relative py-8">
            {/* Vertical Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-purple-200/80 -translate-x-1/2 hidden sm:block" />
            {/* Horizontal Line */}
            <div className="absolute top-1/2 left-12 right-12 h-px bg-purple-200/80 -translate-y-1/2 hidden sm:block" />

            {/* Central Brand Name */}
            <div className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full bg-gradient-to-b from-purple-950 to-purple-900 flex items-center justify-center shadow-2xl border-4 border-amber-400">
              <div className="text-center">
                <span className="text-lg sm:text-xl font-black text-white block tracking-tight">SITHISHA</span>
                <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">MASALA & SNACKS</span>
              </div>
            </div>

            {/* 4 Surrounding Feature Nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
              <div className="flex flex-col items-center text-center space-y-3 group">
                <div className="w-16 h-16 rounded-full surface-orange border border-amber-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-7 h-7 text-purple-900" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">CAREFULLY SELECTED</h3>
                  <p className="text-[11px] text-slate-600 mt-1 font-medium leading-relaxed">
                    Quality masala and snack selections handpicked for taste and freshness.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 group">
                <div className="w-16 h-16 rounded-full surface-red border border-rose-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <Star className="w-7 h-7 text-purple-900 fill-amber-400" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">AUTHENTIC FLAVOURS</h3>
                  <p className="text-[11px] text-slate-600 mt-1 font-medium leading-relaxed">
                    Products that bring familiar tastes closer to home.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 group">
                <div className="w-16 h-16 rounded-full surface-green border border-emerald-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-7 h-7 text-purple-900" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">EASY SHOPPING</h3>
                  <p className="text-[11px] text-slate-600 mt-1 font-medium leading-relaxed">
                    Browse and order without unnecessary complexity.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center space-y-3 group">
                <div className="w-16 h-16 rounded-full surface-berry border border-pink-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <HeartHandshake className="w-7 h-7 text-purple-900" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">CUSTOMER FIRST</h3>
                  <p className="text-[11px] text-slate-600 mt-1 font-medium leading-relaxed">
                    A shopping experience built around convenience.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AnimatedSection>
  );
}
