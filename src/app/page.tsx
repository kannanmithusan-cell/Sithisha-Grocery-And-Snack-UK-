import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import HomepageConfig from '@/models/HomepageConfig';
import HeroSection from '@/components/HeroSection';
import MarqueeStrip from '@/components/MarqueeStrip';
import QuickCategoryStrip from '@/components/QuickCategoryStrip';
import ProductSpotlightSection from '@/components/ProductSpotlightSection';
import IngredientStorySection from '@/components/IngredientStorySection';
import DiscoverNewCTA from '@/components/DiscoverNewCTA';
import MakeTonightDeliciousSection from '@/components/MakeTonightDeliciousSection';
import BrandStorySection from '@/components/BrandStorySection';
import WhyChooseSithisha from '@/components/WhyChooseSithisha';
import WhatsAppCTA from '@/components/WhatsAppCTA';
import NewsletterSection from '@/components/NewsletterSection';
import AnimatedSection from '@/components/AnimatedSection';
import JsonLd, { getStoreSchema, getWebSiteSchema } from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sithishamasala.co.uk';

export const metadata: Metadata = {
  title: 'Authentic UK Masalas, Jaffna Snacks & Ceylon Spices | Sithisha',
  description:
    'Browse and order Sri Lankan hand-roasted masalas, authentic Jaffna mixture snacks, aged Basmati rice, and everyday South Asian groceries in Birmingham, UK.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Authentic UK Masalas, Jaffna Snacks & Ceylon Spices | Sithisha',
    description:
      'Browse and order Sri Lankan hand-roasted masalas, authentic Jaffna mixture snacks, aged Basmati rice, and everyday South Asian groceries in Birmingham, UK.',
    url: SITE_URL,
  },
};

async function getHomeData() {
  try {
    await connectToDatabase();

    const rawCategories = await Category.find({ active: true })
      .sort({ displayOrder: 1 })
      .lean();

    const categories = await Promise.all(
      rawCategories.map(async (cat: any) => {
        const productCount = await Product.countDocuments({
          categoryId: cat._id.toString(),
          active: true,
        });
        return { ...cat, productCount };
      })
    );

    // Products for TODAY'S FAVOURITES (ONLY place with traditional cards, capped at 6)
    let featuredProducts = await Product.find({ active: true, featured: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    if (featuredProducts.length < 4) {
      const existingIds = featuredProducts.map((p: any) => p._id.toString());
      const extraProducts = await Product.find({
        active: true,
        _id: { $nin: existingIds },
      })
        .sort({ createdAt: -1 })
        .limit(6 - featuredProducts.length)
        .lean();
      featuredProducts = [...featuredProducts, ...extraProducts];
    }

    // 2. Shelf Products (MUST BE 100% DIFFERENT FROM TODAY'S FAVOURITES)
    const featuredIds = featuredProducts.map((p: any) => p._id);
    let shelfProducts = await Product.find({
      active: true,
      _id: { $nin: featuredIds },
      bestSeller: true,
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    if (shelfProducts.length < 6) {
      const existingIds = [...featuredIds, ...shelfProducts.map((p: any) => p._id)];
      const extraProducts = await Product.find({
        active: true,
        _id: { $nin: existingIds },
      })
        .sort({ createdAt: -1 })
        .limit(6 - shelfProducts.length)
        .lean();
      shelfProducts = [...shelfProducts, ...extraProducts];
    }

    // Spotlight Product (single featured item for editorial spotlight ad)
    const spotlightProduct = featuredProducts[0] || shelfProducts[0] || null;

    const homepageConfigDoc = await HomepageConfig.findOne().lean();

    const sanitizeDbData = (data: any) => {
      if (!data) return data;
      const jsonStr = JSON.stringify(data)
        .replace(/grocery store/gi, 'masala & snack store')
        .replace(/groceries/gi, 'masalas')
        .replace(/grocery/gi, 'masala')
        .replace(/GROCERIES/g, 'MASALAS')
        .replace(/GROCERY/g, 'MASALA');
      return JSON.parse(jsonStr);
    };

    return {
      categories: sanitizeDbData(JSON.parse(JSON.stringify(categories))),
      featuredProducts: sanitizeDbData(JSON.parse(JSON.stringify(featuredProducts))),
      shelfProducts: sanitizeDbData(JSON.parse(JSON.stringify(shelfProducts))),
      spotlightProduct: spotlightProduct ? sanitizeDbData(JSON.parse(JSON.stringify(spotlightProduct))) : null,
      homepageConfig: homepageConfigDoc ? sanitizeDbData(JSON.parse(JSON.stringify(homepageConfigDoc))) : null,
    };
  } catch (error) {
    console.error('Home data fetch error:', error);
    return {
      categories: [],
      featuredProducts: [],
      shelfProducts: [],
      spotlightProduct: null,
      homepageConfig: null,
    };
  }
}

export default async function HomePage() {
  const { categories, featuredProducts, shelfProducts, spotlightProduct, homepageConfig } = await getHomeData();

  const storeSchema = getStoreSchema(SITE_URL);
  const websiteSchema = getWebSiteSchema(SITE_URL);

  return (
    <>
      <JsonLd data={storeSchema} />
      <JsonLd data={websiteSchema} />
      <div className="space-y-0 pb-20 overflow-hidden bg-slate-50/30">
      
      {/* 01 — HERO: Cinematic food photography auto-slider */}
      <HeroSection heroImages={homepageConfig?.heroImages} />

      {/* 02 — MARQUEE: Continuous brand keyword ticker */}
      <MarqueeStrip />

      {/* 03 — WHAT ARE YOU CRAVING?: Visual category compositions */}
      <QuickCategoryStrip categories={categories} />

      {/* 04 — TODAY'S CRAVING: Editorial single product magazine spotlight ad */}
      <ProductSpotlightSection
        product={spotlightProduct}
        editorialImages={homepageConfig?.editorialImages}
      />

      {/* 05 — TODAY'S FAVOURITES: Traditional product cards (ONLY HERE: 4-6 products) */}
      <div className="py-12 bg-gradient-to-b from-white to-amber-50/20">
        <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:text-left">
            <span className="text-xs font-black text-purple-800 uppercase tracking-widest block mb-1">
              CURATED SELECTION
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">
              TODAY&apos;S FAVOURITES
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Our top recommended authentic masalas and savouries for quick shopping.
            </p>
          </div>

          <ProductGrid products={featuredProducts.slice(0, 6)} />
        </AnimatedSection>
      </div>

      {/* 07 — A TASTE OF HOME: Emotional brand story */}
      <div className="py-8 bg-gradient-to-b from-purple-50/20 to-white">
        <BrandStorySection editorialImages={homepageConfig?.editorialImages} />
      </div>

      {/* 08 — INGREDIENT STORY: Where the flavour begins */}
      <div className="py-8 bg-gradient-to-b from-white to-amber-50/20">
        <IngredientStorySection editorialImages={homepageConfig?.editorialImages} />
      </div>

      {/* 09 — DISCOVER SOMETHING NEW: Giant arrival banner CTA */}
      <div className="py-8 bg-gradient-to-b from-amber-50/20 to-purple-50/20">
        <DiscoverNewCTA editorialImages={homepageConfig?.editorialImages} />
      </div>

      {/* 10 — FOOD MOOD: Lifestyle food moment */}
      <div className="py-8 bg-gradient-to-b from-purple-50/20 to-white">
        <MakeTonightDeliciousSection editorialImages={homepageConfig?.editorialImages} />
      </div>

      {/* WHY CHOOSE SITHISHA */}
      <div className="py-8 bg-gradient-to-b from-white to-purple-50/20">
        <WhyChooseSithisha />
      </div>

      {/* 11 — FINAL CTA: What's Going In Your Basket */}
      <div className="py-8 bg-gradient-to-b from-purple-50/20 to-white">
        <WhatsAppCTA ctaImage={homepageConfig?.ctaImage} />
      </div>

      {/* NEWSLETTER */}
      <div className="py-8">
        <NewsletterSection />
      </div>

    </div>
    </>
  );
}
