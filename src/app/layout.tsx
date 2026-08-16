import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { SettingsProvider } from '@/context/SettingsContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { Toaster } from 'react-hot-toast';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sithishamasala.co.uk';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Sithisha Masala & Snacks — Authentic UK Masalas, Jaffna Snacks & Spices',
    template: '%s | Sithisha Grocery & Snack UK',
  },
  description:
    'Order authentic South Asian masalas, handcrafted Jaffna mixture snacks, Ceylon spices, Basmati rice, and everyday provisions in Birmingham, UK. Fast local delivery and direct WhatsApp ordering.',
  keywords: [
    'Sithisha Masala & Snacks',
    'Jaffna Mixture UK',
    'UK Masala & Snacks',
    'Birmingham Sri Lankan Store',
    'Parsons Hill Asian Grocery',
    'South Asian Savouries',
    'Ceylon Spices UK',
    'Handcrafted Curry Powders',
    'Sri Lankan Grocery Online UK',
    'Order Jaffna Snacks Birmingham',
  ],
  authors: [{ name: 'Sithisha Masala & Snacks' }],
  creator: 'Sithisha Masala & Snacks',
  publisher: 'Sithisha Masala & Snacks',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE_URL,
    siteName: 'Sithisha Masala & Snacks UK',
    title: 'Sithisha Masala & Snacks — Authentic UK Masalas, Jaffna Snacks & Spices',
    description:
      'Order authentic South Asian masalas, Jaffna mixture snacks, Ceylon spices, and everyday household essentials in Birmingham, UK. Fast delivery and direct WhatsApp ordering.',
    images: [
      {
        url: '/hero-showcase.png',
        width: 1200,
        height: 630,
        alt: 'Sithisha Masala & Snacks UK - Authentic Sri Lankan & South Asian Grocery Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sithisha Masala & Snacks — Authentic UK Masalas, Jaffna Snacks & Spices',
    description:
      'Authentic South Asian masalas, Jaffna mixture snacks, Ceylon spices & everyday groceries in Birmingham, UK.',
    images: ['/hero-showcase.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#fcfbfe] text-slate-900 antialiased selection:bg-purple-900 selection:text-white">
        <SettingsProvider>
          <CartProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: '#4c1d95',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '600',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(76, 29, 149, 0.3)',
                },
                success: {
                  iconTheme: {
                    primary: '#fbbf24',
                    secondary: '#4c1d95',
                  },
                },
              }}
            />
            <Navbar />
            <CartDrawer />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
