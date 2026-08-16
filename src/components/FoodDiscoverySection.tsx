'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

export default function FoodDiscoverySection() {
  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-purple-100 min-h-[420px] sm:min-h-[480px] flex items-center bg-slate-950 text-white group">
        
        {/* Large Editorial Background Food Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80"
            alt="Made for Your Cravings - Authentic Sithisha Food"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 opacity-50"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/95 via-purple-950/80 to-purple-900/40" />
        </div>

        {/* Surrounding Floating Product Cutout Badges */}
        <motion.div
          animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute top-8 right-12 z-20 hidden md:flex items-center gap-2 bg-purple-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-400/80 text-amber-300 text-xs font-black shadow-xl"
        >
          🍪 Crisp Jaffna Savouries
        </motion.div>

        <motion.div
          animate={{ y: [10, -10, 10], rotate: [3, -3, 3] }}
          transition={{ duration: 7.5, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute bottom-10 right-24 z-20 hidden md:flex items-center gap-2 bg-purple-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-emerald-400/80 text-emerald-300 text-xs font-black shadow-xl"
        >
          🌶️ Ceylon Roasted Curry Powder
        </motion.div>

        {/* Content Box */}
        <div className="relative z-10 p-8 sm:p-16 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/90 border border-purple-700/60 text-amber-300 text-xs font-black uppercase tracking-wider shadow-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" /> EDITORIAL DISCOVERY
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            Made for Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-purple-200">Cravings.</span>
          </h2>

          <p className="text-sm sm:text-base text-purple-100 leading-relaxed font-medium">
            Whether you&apos;re longing for tea-time savouries, hand-ground curry spices, or extra-long Basmati rice for family Sunday dinners — discover something truly delicious today.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="px-8 py-4 bg-amber-400 hover:bg-amber-300 text-purple-950 font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-amber-400/20 flex items-center gap-2 group/btn"
            >
              <ShoppingBag className="w-4 h-4" /> Discover Delicious Products
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </AnimatedSection>
  );
}
