'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, ShoppingBag, ShieldCheck, HeartHandshake, Star } from 'lucide-react';
import { IHeroImage } from '@/models/HomepageConfig';

const DEFAULT_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1621996346565-e3d5d6281276?w=1600&auto=format&fit=crop&q=80',
];

interface HeroSectionProps {
  heroImages?: IHeroImage[];
}

export default function HeroSection({ heroImages = [] }: HeroSectionProps) {
  const activeHeroes = heroImages.filter((img) => img.active);
  
  // Ensure we always have exactly 4 transforming hero images
  const adminUrls = activeHeroes.map((h) => h.url);
  const combinedUrls = [...adminUrls];
  
  for (let i = 0; combinedUrls.length < 4 && i < DEFAULT_HERO_IMAGES.length; i++) {
    if (!combinedUrls.includes(DEFAULT_HERO_IMAGES[i])) {
      combinedUrls.push(DEFAULT_HERO_IMAGES[i]);
    }
  }
  
  const imageUrls = combinedUrls.slice(0, 4);

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
  }, [imageUrls.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000); // Auto transform every 4 seconds
    return () => clearInterval(interval);
  }, [nextSlide]);

  const currentHero = activeHeroes[currentIndex] || null;
  const rawHeadline = currentHero?.title || 'A LITTLE TASTE';
  const headline = rawHeadline.replace(/grocery|groceries/gi, 'Masala');
  const rawHeadlineHighlight = currentHero?.titleHighlight || 'OF HOME.';
  const headlineHighlight = rawHeadlineHighlight.replace(/grocery|groceries/gi, 'Masala');
  const rawBadge = currentHero?.badge || 'Authentic Jaffna & Indian Masala & Snacks';
  const badge = rawBadge.replace(/grocery|groceries/gi, 'Masala');
  const rawDescription =
    currentHero?.description ||
    'Discover delicious snacks, authentic flavours and everyday masala favourites — carefully selected for food lovers.';
  const description = rawDescription.replace(/grocery|groceries/gi, 'masala');

  return (
    <section className="relative overflow-hidden bg-purple-950 text-white min-h-[520px] sm:min-h-[600px] lg:min-h-[650px] flex items-center">
      
      {/* Auto-Transforming Background Images */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={imageUrls[currentIndex]}
            alt="Sithisha Hero Visual"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-950/92 via-purple-950/75 to-purple-950/50" />
        </motion.div>
      </AnimatePresence>

      {/* Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none z-[1]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none z-[1]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-24">
        <div className="max-w-3xl space-y-6">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-800/90 border border-purple-700/60 text-amber-300 text-xs font-black uppercase tracking-widest shadow-sm backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> {badge}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white uppercase"
          >
            {headline}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-purple-200 block">
              {headlineHighlight}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm sm:text-base lg:text-lg text-purple-100 max-w-2xl font-medium leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Primary CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="pt-2"
          >
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-400 hover:bg-amber-300 text-purple-950 font-black rounded-2xl text-xs uppercase tracking-wider shadow-lg hover:shadow-amber-400/20 transition-all group"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="pt-6 border-t border-white/10 flex flex-wrap gap-6 text-xs font-semibold text-purple-200"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <span>100% Authentic</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Family Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
              <span>4.9 Customer Rating</span>
            </div>
          </motion.div>
        </div>

        {/* 4 Transform Slide Indicators */}
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 flex items-center gap-2 z-20">
          {imageUrls.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                idx === currentIndex ? 'bg-amber-400 w-8' : 'bg-white/40 hover:bg-white/70 w-2.5'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
