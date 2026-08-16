'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { IProduct } from '@/types';
import { IEditorialImage } from '@/models/HomepageConfig';
import { useCart } from '@/context/CartContext';
import toast from 'react-hot-toast';

interface ProductSpotlightSectionProps {
  product?: IProduct | null;
  editorialImages?: IEditorialImage[];
}

export default function ProductSpotlightSection({ product, editorialImages = [] }: ProductSpotlightSectionProps) {
  const { addToCart } = useCart();
  const adminImg = editorialImages.find((img) => img.section === 'todays-craving' && img.active);

  const displayImage =
    adminImg?.url ||
    product?.images[0] ||
    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80';

  const rawTitle = adminImg?.title || product?.name || 'A LITTLE SOMETHING WORTH SHARING';
  const displayTitle = rawTitle.replace(/grocery|groceries/gi, 'Masala');
  const rawDescription =
    adminImg?.subtitle ||
    product?.description ||
    'Authentic Ceylon recipe prepared with traditional care and pure ingredients.';
  const displayDescription = rawDescription.replace(/grocery|groceries/gi, 'masala');
  // Admin-set price takes priority, then live product price
  const displayPrice = (adminImg?.price && adminImg.price > 0) ? adminImg.price : (product?.price || 4.99);


  const handleAdd = () => {
    if (product) {
      addToCart(product, 1);
      toast.success(`Added ${product.name} to basket`);
    } else {
      toast.success('Added item to basket');
    }
  };

  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 text-white p-8 sm:p-14 border border-purple-800 shadow-2xl">
        
        {/* Background Subtle Pattern & Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* Left Text & Editorial Layout */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/90 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400" /> TODAY&apos;S CRAVING
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight uppercase">
              {displayTitle}
            </h2>

            <p className="text-xs sm:text-base text-purple-100 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
              {displayDescription}
            </p>

            {/* Price & Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <div className="text-center sm:text-left">
                <span className="text-[10px] text-purple-300 font-bold uppercase block">Special Price</span>
                <span className="text-3xl font-black text-amber-400">£{displayPrice.toFixed(2)}</span>
              </div>

              <button
                onClick={handleAdd}
                className="w-full sm:w-auto px-8 py-4 bg-amber-400 hover:bg-amber-300 text-purple-950 font-black rounded-2xl text-xs uppercase tracking-wider shadow-lg hover:shadow-amber-400/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" /> Add To Basket
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {product && (
                <Link
                  href={`/product/${product.slug}`}
                  className="text-xs font-bold text-purple-200 hover:text-white underline underline-offset-4"
                >
                  View Details
                </Link>
              )}
            </div>

          </div>

          {/* Right Product Image Spotlight - Fixed Uniform Container */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-b from-purple-900/60 to-purple-950/80 border border-purple-700/50 shadow-2xl flex items-center justify-center group">
              <Image
                src={displayImage}
                alt={displayTitle}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>

        </div>

      </div>
    </AnimatedSection>
  );
}
