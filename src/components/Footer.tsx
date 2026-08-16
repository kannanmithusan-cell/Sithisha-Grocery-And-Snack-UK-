'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Heart, ShieldCheck, Truck, RefreshCw, ShoppingBag } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

const Footer: React.FC = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-purple-950 text-purple-100 border-t border-purple-900 pt-16 pb-8">
      {/* Customer Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-purple-900/60">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-purple-900/40 border border-purple-800/50 hover:border-amber-400/40 transition-colors">
            <Truck className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm text-white">Fast UK Delivery</h4>
              <p className="text-xs text-purple-300">Free delivery on orders over £30</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-purple-900/40 border border-purple-800/50 hover:border-amber-400/40 transition-colors">
            <ShieldCheck className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm text-white">Authentic Quality</h4>
              <p className="text-xs text-purple-300">Fresh masala & traditional spices</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-purple-900/40 border border-purple-800/50 hover:border-amber-400/40 transition-colors">
            <ShoppingBag className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm text-white">Easy Online Ordering</h4>
              <p className="text-xs text-purple-300">Browse & order directly to your door</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-purple-900/40 border border-purple-800/50 hover:border-amber-400/40 transition-colors">
            <RefreshCw className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-extrabold text-sm text-white">Dedicated Support</h4>
              <p className="text-xs text-purple-300">Local Birmingham family store</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-purple-900/60">
        {/* Column 1: Brand Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-amber-400 shrink-0 bg-purple-950">
              <Image
                src="/logo.jpg"
                alt="Sithisha Masala & Snacks Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-white tracking-tight">Sithisha</span>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                Masala & Snacks
              </span>
            </div>
          </div>
          <p className="text-xs text-purple-300 leading-relaxed max-w-sm font-medium">
            Your premier UK destination for authentic South Asian masalas, crispy Jaffna savouries, aromatic Ceylon spices, Basmati rice, and daily household essentials delivered with care.
          </p>
        </div>

        {/* Column 2: Shop Navigation */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Shop Navigation</h4>
          <ul className="space-y-2 text-xs text-purple-300">
            <li>
              <Link href="/shop" className="hover:text-amber-300 transition-colors">All Products</Link>
            </li>
            <li>
              <Link href="/shop?category=snacks-savouries" className="hover:text-amber-300 transition-colors">Snacks & Savouries</Link>
            </li>
            <li>
              <Link href="/shop?category=spices-masalas" className="hover:text-amber-300 transition-colors">Spices & Masalas</Link>
            </li>
            <li>
              <Link href="/shop?category=rice-grains" className="hover:text-amber-300 transition-colors">Basmati Rice & Grains</Link>
            </li>
            <li>
              <Link href="/shop?category=sweets-biscuits" className="hover:text-amber-300 transition-colors">Sweets & Biscuits</Link>
            </li>
            <li>
              <Link href="/shop?bestSeller=true" className="hover:text-amber-300 transition-colors font-semibold text-amber-300">Popular Best Sellers</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Customer Support */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Customer Support</h4>
          <ul className="space-y-2 text-xs text-purple-300">
            <li>
              <Link href="/contact" className="hover:text-amber-300 transition-colors">Contact Us</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-amber-300 transition-colors">Delivery Information</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-amber-300 transition-colors">Store FAQs</Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-amber-300 transition-colors">View Cart</Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Visit Us & Address */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-xs text-white uppercase tracking-wider">Visit Our Store</h4>
          <div className="space-y-2.5 text-xs text-purple-300">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Sithisha Masala & Snacks</strong><br />
                120 Parsons Hill<br />
                Birmingham, B30 3QP<br />
                United Kingdom
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{settings.phone || '+44 121 444 8899'}</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{settings.email || 'info@sithisha.co.uk'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-purple-400">
        <p>© {new Date().getFullYear()} Sithisha Masala & Snacks. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Birmingham & UK
          </p>
          <span className="text-purple-800">•</span>
          <Link href="/admin/login" className="hover:text-amber-300 transition-colors opacity-60 hover:opacity-100 text-[11px]">
            Staff Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
