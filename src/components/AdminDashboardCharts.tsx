'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

const SAMPLE_CHART_DATA = [
  { day: 'Mon', sales: 240, orders: 8 },
  { day: 'Tue', sales: 380, orders: 12 },
  { day: 'Wed', sales: 450, orders: 15 },
  { day: 'Thu', sales: 310, orders: 9 },
  { day: 'Fri', sales: 590, orders: 18 },
  { day: 'Sat', sales: 780, orders: 24 },
  { day: 'Sun', sales: 620, orders: 20 },
];

export default function AdminDashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
      {/* Weekly Revenue Sales Area Chart */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weekly Revenue (£)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SAMPLE_CHART_DATA}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip formatter={(val: any) => [`£${val || 0}`, 'Revenue']} />
              <Area type="monotone" dataKey="sales" stroke="#6d28d9" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Volume Bar Chart */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Daily Orders Count</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SAMPLE_CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip formatter={(val: any) => [val || 0, 'Orders']} />
              <Bar dataKey="orders" fill="#4c1d95" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
