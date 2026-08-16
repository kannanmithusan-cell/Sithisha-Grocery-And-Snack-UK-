import type { Metadata } from 'next';
import React from 'react';
import ContactForm from '@/components/ContactForm';
import JsonLd, { getStoreSchema, getBreadcrumbSchema } from '@/components/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sithishamasala.co.uk';

export const metadata: Metadata = {
  title: 'Contact Us | Sithisha Masala & Snacks Birmingham UK',
  description:
    'Get in touch with Sithisha Masala & Snacks in Birmingham, UK. Contact us for product inquiries, bulk Jaffna snack orders, delivery info, or WhatsApp support.',
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: 'Contact Us | Sithisha Masala & Snacks Birmingham UK',
    description:
      'Contact Sithisha Masala & Snacks at 120 Parsons Hill, Birmingham, B30 3QP or via WhatsApp at 0741530377.',
    url: `${SITE_URL}/contact`,
  },
};

export default function ContactPage() {
  const storeSchema = getStoreSchema(SITE_URL);
  const breadcrumbSchema = getBreadcrumbSchema(
    [
      { name: 'Home', url: '/' },
      { name: 'Contact Us', url: '/contact' },
    ],
    SITE_URL
  );

  return (
    <>
      <JsonLd data={storeSchema} />
      <JsonLd data={breadcrumbSchema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950 rounded-3xl p-8 sm:p-14 text-white shadow-xl text-center sm:text-left">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
            WE ARE HERE TO HELP
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Contact Sithisha Masala & Snacks
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 font-medium mt-2 max-w-xl">
            Have a question about product availability, bulk ordering, or delivery? Reach out to us directly.
          </p>
        </div>

        <ContactForm />
      </div>
    </>
  );
}
