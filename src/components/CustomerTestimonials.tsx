'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedSection from './AnimatedSection';

const TESTIMONIALS = [
  {
    name: 'Priya K.',
    location: 'Birmingham',
    initials: 'PK',
    rating: 5,
    text: 'The Jaffna mixture was crisp and full of authentic spice! Ordering via WhatsApp was incredibly convenient, and delivery to Solihull was super quick.',
  },
  {
    name: 'David M.',
    location: 'Coventry',
    initials: 'DM',
    rating: 5,
    text: 'Best Ceylon roasted curry powder in the UK. Rich aroma and excellent quality basmati rice. Sithisha is my go-to store for weekly masalas & snacks.',
  },
  {
    name: 'Suresh R.',
    location: 'Leicester',
    initials: 'SR',
    rating: 5,
    text: 'Friendly customer service, prompt WhatsApp updates on order status, and carefully packaged items. Highly recommended masala & snack store!',
  },
  {
    name: 'Anitha T.',
    location: 'Birmingham',
    initials: 'AT',
    rating: 5,
    text: 'Super fresh tapioca chips and butter murukku. Reminds me of home! The WhatsApp checkout makes ordering effortless.',
  },
  {
    name: 'Kavitha S.',
    location: 'Wolverhampton',
    initials: 'KS',
    rating: 5,
    text: 'Excellent range of spices and grains. Great prices compared to other Asian supermarkets, and the staff are always polite and helpful.',
  },
];

export default function CustomerTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
      }
    }, 5000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div
        className="bg-white rounded-3xl p-8 sm:p-12 border border-purple-100 shadow-sm relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-extrabold text-purple-700 uppercase tracking-widest block mb-1">
              WHAT OUR CUSTOMERS SAY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Trusted Across Birmingham & The UK
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2.5 rounded-full bg-purple-50 hover:bg-purple-900 text-purple-900 hover:text-white transition-colors border border-purple-100"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2.5 rounded-full bg-purple-50 hover:bg-purple-900 text-purple-900 hover:text-white transition-colors border border-purple-100"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Testimonials Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative min-h-[220px]">
          {/* Display 3 cards sliding or centered */}
          {[0, 1, 2].map((offset) => {
            const index = (currentIndex + offset) % TESTIMONIALS.length;
            const item = TESTIMONIALS[index];

            return (
              <AnimatePresence mode="wait" key={`${index}-${offset}`}>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4, delay: offset * 0.1 }}
                  className="bg-purple-50/40 p-6 rounded-2xl border border-purple-100/80 flex flex-col justify-between space-y-4 hover:border-purple-300 transition-colors shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-400 gap-0.5">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <Quote className="w-6 h-6 text-purple-300/60" />
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      &quot;{item.text}&quot;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-purple-100/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-900 text-amber-300 font-extrabold text-xs flex items-center justify-center border border-purple-700 shrink-0">
                        {item.initials}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900">{item.name}</h4>
                        <span className="text-[10px] text-purple-700 font-semibold">{item.location}</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Verified Order
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            );
          })}
        </div>

        {/* Carousel Dot Indicators */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx ? 'w-8 bg-purple-700' : 'w-2 bg-purple-200 hover:bg-purple-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
