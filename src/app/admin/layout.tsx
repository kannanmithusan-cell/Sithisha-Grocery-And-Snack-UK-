'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
  Sliders,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // If on login page, skip admin layout shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products Catalogue', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Homepage Management', href: '/admin/homepage', icon: Sliders },
    { name: 'Store Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-slate-900">
      {/* Mobile Top Navbar Header */}
      <div className="lg:hidden bg-purple-950 text-white p-4 flex items-center justify-between shadow-md border-b border-purple-900/50">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-amber-400 shrink-0 bg-purple-950">
            <Image
              src="/logo.jpg"
              alt="Sithisha Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-extrabold text-sm tracking-tight">SITHISHA ADMIN</span>
        </div>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-purple-200 hover:text-white"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-purple-950 text-white flex flex-col justify-between transition-transform duration-300 border-r border-purple-900/40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-8">
          {/* Admin Logo Brand */}
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-full overflow-hidden shadow-lg border-2 border-amber-400 shrink-0 bg-purple-950 group-hover:scale-105 transition-transform">
              <Image
                src="/logo.jpg"
                alt="Sithisha Masala & Snacks Logo"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-black text-base tracking-tight leading-none text-white">
                SITHISHA
              </h2>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block mt-1">
                Admin Control
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-400 text-purple-950 shadow-md font-extrabold'
                      : 'text-purple-200 hover:bg-purple-900/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: Back to Main Site & Logout */}
        <div className="p-6 border-t border-purple-900/60 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-purple-200 hover:bg-purple-900 hover:text-white transition-colors"
          >
            <Store className="w-4 h-4" /> View Customer Website
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-950/60 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Admin Page Content View */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-6 py-4 hidden lg:flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <span>Sithisha Operations</span>
            <span>/</span>
            <span className="text-purple-900 font-bold capitalize">
              {pathname.replace('/admin', '') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> System Live
            </span>
            <span className="font-bold text-slate-700">Admin Account</span>
          </div>
        </header>

        <div className="p-6 sm:p-8 flex-1">{children}</div>
      </div>
    </div>
  );
}
