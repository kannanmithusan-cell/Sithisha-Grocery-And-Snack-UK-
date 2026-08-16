'use client';

import React from 'react';
import AnimatedSection from './AnimatedSection';

const STATS = [
  {
    value: '100+',
    label: 'Products',
    subtitle: 'Curated masalas & savouries',
  },
  {
    value: '10+',
    label: 'Categories',
    subtitle: 'Spices, grains, drinks & snacks',
  },
  {
    value: '24/7',
    label: 'Online Ordering',
    subtitle: 'Instant WhatsApp cart checkout',
  },
  {
    value: '100%',
    label: 'Customer Focus',
    subtitle: 'Dedicated Birmingham service',
  },
];

export default function TrustStatistics() {
  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-gradient-to-b from-purple-50/80 via-white to-purple-50/80 rounded-3xl p-8 sm:p-12 border border-purple-100 shadow-xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-purple-100">
          {STATS.map((stat, idx) => (
            <div key={idx} className={`${idx !== 0 ? 'pt-6 sm:pt-0' : ''} space-y-1.5 px-2`}>
              <div className="text-3xl sm:text-5xl font-black text-purple-900 tracking-tight font-mono">
                {stat.value}
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                {stat.label}
              </h3>
              <p className="text-[11px] text-slate-600 font-medium">
                {stat.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
