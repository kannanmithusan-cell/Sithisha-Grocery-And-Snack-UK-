import type { Metadata } from 'next';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, Award, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import JsonLd, { getStoreSchema, getBreadcrumbSchema } from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sithishamasala.co.uk';

export const metadata: Metadata = {
  title: 'About Us | Sithisha Masala & Snacks Birmingham UK',
  description:
    'Discover the story of Sithisha Masala & Snacks. Located at 120 Parsons Hill, Birmingham, bringing authentic South Asian spices, Jaffna snacks, and local delivery to the UK.',
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: 'About Us | Sithisha Masala & Snacks Birmingham UK',
    description:
      'Located at 120 Parsons Hill, Birmingham. Bringing authentic South Asian spices, Jaffna savouries, and everyday provisions to UK homes.',
    url: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  const storeSchema = getStoreSchema(SITE_URL);
  const breadcrumbSchema = getBreadcrumbSchema(
    [
      { name: 'Home', url: '/' },
      { name: 'About Us', url: '/about' },
    ],
    SITE_URL
  );

  return (
    <>
      <JsonLd data={storeSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden text-center sm:text-left">
        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
            OUR HERITAGE & MISSION
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            About Sithisha Masala & Snacks
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 font-medium leading-relaxed">
            Bringing authentic South Asian flavours, hand-roasted curry powders, crispy Jaffna savouries, and everyday Jaffna & Indian masalas to your kitchen table.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs font-extrabold text-purple-700 uppercase tracking-widest block">
            THE SITHISHA PROMISE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Serving Birmingham with Passion & Quality
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Located at <strong>120 Parsons Hill, Birmingham B30 3QP</strong>, Sithisha Masala & Snacks was built on a simple promise: providing our UK community with authentic, high-quality ingredients at fair everyday prices.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            From handcrafted crispy Jaffna mixture to fragrant aged Basmati rice and whole aromatic spices, every single product on our shelves is chosen with care. We take pride in fast local service, direct WhatsApp ordering convenience, and personal attention to detail.
          </p>

          <div className="pt-4 grid grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-1">
              <Award className="w-5 h-5 text-purple-700" />
              <h4 className="font-bold text-slate-900 text-xs">Authentic Sourcing</h4>
              <p className="text-[11px] text-slate-500">Genuine spices & South Asian brands.</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-1">
              <Heart className="w-5 h-5 text-rose-500" />
              <h4 className="font-bold text-slate-900 text-xs">Customer First</h4>
              <p className="text-[11px] text-slate-500">Friendly local store service.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative aspect-video sm:aspect-square w-full rounded-3xl overflow-hidden shadow-2xl border border-purple-100">
            <Image
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1000&auto=format&fit=crop&q=80"
              alt="Sithisha Store Spices"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Store Location Banner */}
      <div className="bg-white rounded-3xl border border-purple-100 p-8 sm:p-12 shadow-md grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="space-y-2 lg:col-span-2">
          <h3 className="text-xl font-black text-slate-900">Visit Our Store in Birmingham</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Drop by our physical store or place your order online for quick local delivery across Birmingham and the surrounding UK areas.
          </p>
          <div className="pt-2 text-xs font-semibold text-purple-900 space-y-1">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-700" /> 120 Parsons Hill, Birmingham, B30 3QP, United Kingdom
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-purple-700" /> +44 7393 139705
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-700" /> Kannanmithusan@gmail.com
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/shop"
            className="w-full sm:w-auto px-8 py-4 bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all text-center flex items-center justify-center gap-2"
          >
            Shop Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
