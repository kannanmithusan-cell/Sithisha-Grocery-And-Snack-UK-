import React from 'react';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Settings from '@/models/Settings';
import Link from 'next/link';
import { Package, Layers, AlertTriangle, ArrowRight, Store, CheckCircle, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getDashboardMetrics() {
  try {
    await connectToDatabase();

    const [
      totalProducts,
      totalCategories,
      lowStockProducts,
      settings,
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Product.find({ stock: { $lte: 5 } }).lean(),
      Settings.findOne().lean(),
    ]);

    return {
      totalProducts,
      totalCategories,
      lowStockCount: lowStockProducts.length,
      lowStockProducts: JSON.parse(JSON.stringify(lowStockProducts)),
      settings: settings ? JSON.parse(JSON.stringify(settings)) : null,
    };
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    return {
      totalProducts: 0,
      totalCategories: 0,
      lowStockCount: 0,
      lowStockProducts: [],
      settings: null,
    };
  }
}

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();

  const kpis = [
    {
      title: 'Total Products in Catalog',
      value: metrics.totalProducts,
      icon: Package,
      color: 'bg-purple-50 text-purple-900 border-purple-200',
      href: '/admin/products',
    },
    {
      title: 'Active Product Categories',
      value: metrics.totalCategories,
      icon: Layers,
      color: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      href: '/admin/categories',
    },
    {
      title: 'Low Stock Items (≤5 units)',
      value: metrics.lowStockCount,
      icon: AlertTriangle,
      color: metrics.lowStockCount > 0 ? 'bg-rose-50 text-rose-900 border-rose-200' : 'bg-emerald-50 text-emerald-900 border-emerald-200',
      href: '/admin/products',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Catalog Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage product items, Cloudinary image galleries, categories, and store contact settings.
        </p>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={kpi.title}
              href={kpi.href}
              className={`p-6 rounded-3xl border ${kpi.color} shadow-sm space-y-4 hover:shadow-md transition-all group block`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">{kpi.title}</span>
                <div className="p-2.5 rounded-xl bg-white/80 border border-current/20">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-black">{kpi.value}</div>
              <div className="text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Manage Section <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Active WhatsApp & Store Config Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Active WhatsApp & Contact Settings</h2>
              <p className="text-xs text-slate-500">Live store phone and WhatsApp order parameters.</p>
            </div>
          </div>
          <Link
            href="/admin/settings"
            className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Edit Settings
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">WhatsApp Order Number</span>
            <span className="font-black text-emerald-800 text-sm">{metrics.settings?.whatsappNumber || metrics.settings?.phone || ''}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Display Store Phone</span>
            <span className="font-bold text-slate-900 text-sm">{metrics.settings?.phone || '07393139705'}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Free Delivery Threshold</span>
            <span className="font-bold text-slate-900 text-sm">£{metrics.settings?.freeDeliveryThreshold || '30.00'}</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Store Support Email</span>
            <span className="font-bold text-slate-900 truncate block">{metrics.settings?.email || 'Kannanmithusan@gmail.com'}</span>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts Section */}
      {metrics.lowStockProducts.length > 0 && (
        <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" /> Low Stock Inventory Items
            </h2>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-purple-900 hover:underline flex items-center gap-1"
            >
              Update Inventory <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {metrics.lowStockProducts.map((p: { _id: string; name: string; stock: number; price: number }) => (
              <div key={p._id} className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">{p.name}</h4>
                  <span className="text-slate-500 font-medium">£{p.price?.toFixed(2)}</span>
                </div>
                <span className="px-2.5 py-1 bg-rose-600 text-white font-extrabold rounded-lg text-[11px]">
                  {p.stock} Left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
