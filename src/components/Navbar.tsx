'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import SearchModal from './SearchModal';
import AnnouncementBar from './AnnouncementBar';
import ScrollProgress from './ScrollProgress';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop Catalog', href: '/shop' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return null; // Admin has custom layout
  }

  return (
    <>
      {/* Top Scroll Indicator */}
      <ScrollProgress />

      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Sticky Main Navigation Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-purple-100/80'
            : 'bg-white border-b border-purple-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-full overflow-hidden shadow-md group-hover:scale-105 transition-transform border-2 border-amber-400 shrink-0 bg-purple-950">
                <Image
                  src="/logo.jpg"
                  alt="Sithisha Masala & Snacks Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-tight">
                  Sithisha
                </span>
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-widest leading-none">
                  Masala&snacks
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-semibold transition-colors relative py-1 ${
                      isActive
                        ? 'text-purple-700 font-bold'
                        : 'text-slate-700 hover:text-purple-700'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-700 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons: Search & Cart */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-slate-700 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors flex items-center gap-2"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-semibold text-slate-500">
                  Search...
                </span>
              </button>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-purple-900 text-white hover:bg-purple-800 rounded-xl shadow-sm hover:shadow-purple-subtle transition-all flex items-center gap-2"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-bold">Cart</span>
                {totalItems > 0 && (
                  <span className="bg-amber-400 text-purple-950 font-black text-xs min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-purple-100 bg-white px-4 pt-3 pb-6 space-y-2 mt-3 shadow-lg">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-purple-50 text-purple-900 font-bold'
                      : 'text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Instant Search Modal */}
      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
    </>
  );
};

export default Navbar;
