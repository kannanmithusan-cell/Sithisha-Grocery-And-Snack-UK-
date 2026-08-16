'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, Truck, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ANNOUNCEMENTS = [
  {
    icon: Sparkles,
    text: 'Quality Masala & Snacks • Easy WhatsApp Ordering • Birmingham',
  },
  {
    icon: Sparkles,
    text: 'Fresh Picks, Everyday Essentials • Sithisha Masala & Snacks',
  },
  {
    icon: Truck,
    text: 'Free UK Delivery on Orders Over £30 • Fast & Reliable Dispatch',
  },
  {
    icon: MessageCircle,
    text: 'Order Easily Through WhatsApp • Fast Customer Assistance',
  },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const CurrentIcon = ANNOUNCEMENTS[index].icon;

  return (
    <div className="bg-purple-950 text-purple-100 text-xs py-2 px-4 border-b border-purple-900/50 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="hidden lg:flex items-center gap-2 text-[11px] font-medium text-purple-300">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>120 Parsons Hill, Birmingham B30 3QP</span>
        </div>

        {/* Rotating Announcement Message */}
        <div className="flex-1 flex justify-center items-center text-center h-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300"
            >
              <CurrentIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{ANNOUNCEMENTS[index].text}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[11px]">
          <span className="bg-purple-800/90 text-amber-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-purple-700/60">
            AUTHENTIC QUALITY
          </span>
        </div>
      </div>
    </div>
  );
}
