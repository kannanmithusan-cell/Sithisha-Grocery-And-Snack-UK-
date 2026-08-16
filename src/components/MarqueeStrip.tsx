'use client';

import React from 'react';

const MARQUEE_ITEMS = [
  'SNACKS',
  'CEYLON SPICES',
  'TRADITIONAL SWEETS',
  'AUTHENTIC MASALAS',
  'AGED BASMATI RICE',
  'SAVOURY MIXTURES',
  'CURRY POWDERS',
];

export default function MarqueeStrip() {
  return (
    <div className="w-full bg-purple-950 text-amber-300 py-3.5 overflow-hidden border-y border-purple-900 shadow-inner">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 mx-4 text-xs font-black tracking-widest uppercase">
            <span>{item}</span>
            <span className="text-amber-400/50 text-base">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
