'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ArrowLeft, User, MapPin, Phone, Mail, Clock, ShoppingBag, MessageCircle } from 'lucide-react';
import { IOrder, OrderStatus } from '@/types';
import toast from 'react-hot-toast';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export default function AdminOrderDetailPage() {
  const paramsHook = useParams();
  const id = paramsHook?.id as string;

  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('Pending');

  const fetchOrderDetail = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setOrder(data.data);
        setSelectedStatus(data.data.status);
      }
    } catch (err) {
      console.error('Fetch order error:', err);
      toast.error('Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update order status');
      }

      toast.success(`Order status updated to "${newStatus}"`);
      setOrder(data.data);
      setSelectedStatus(newStatus);
    } catch (err) {
      console.error('Update status error:', err);
      toast.error(err instanceof Error ? err.message : 'Status update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendWhatsAppUpdate = () => {
    if (!order) return;
    const msg = `Hello ${order.customerName}! 👋\nUpdate regarding your Sithisha Masala & Snacks Order #${order.orderNumber}:\n\nYour order status is now: *${order.status}*\n\nThank you for shopping with Sithisha Masala & Snacks!`;
    const whatsappUrl = buildWhatsAppUrl(order.phone, msg);
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading order details...</div>;
  }

  if (!order) {
    return <div className="p-8 text-center text-xs text-red-500">Order not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-xs font-bold text-purple-900 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders List
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-slate-500">Order Ref:</span>
          <span className="text-base font-black text-purple-900">#{order.orderNumber}</span>
        </div>
      </div>

      {/* Top Banner Status Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Current Order Status
          </span>
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-900 font-black text-xs rounded-full">
            {order.status}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-700 shrink-0">Update Status:</label>
          <select
            value={selectedStatus}
            disabled={isUpdating}
            onChange={(e) => handleUpdateStatus(e.target.value as OrderStatus)}
            className="px-3 py-2 rounded-xl border border-purple-200 text-xs font-extrabold text-purple-950 bg-purple-50 outline-none"
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button
            type="button"
            onClick={handleSendWhatsAppUpdate}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            title="Send WhatsApp update to customer"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Customer Info Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-purple-700" /> Customer Information
          </h3>
          <div className="space-y-1.5 text-xs text-slate-700 font-medium">
            <p><strong className="font-bold text-slate-900">Name:</strong> {order.customerName}</p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-purple-700" /> {order.phone}
            </p>
            <p className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-purple-700" /> {order.email}
            </p>
          </div>
        </div>

        {/* Delivery Info Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-700" /> Delivery Address
          </h3>
          <div className="space-y-1 text-xs text-slate-700 font-medium">
            <p>{order.address}</p>
            <p>{order.city}, <strong className="font-mono">{order.postcode}</strong></p>
            {order.deliveryInstructions && (
              <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg mt-2">
                💬 <strong>Instructions:</strong> {order.deliveryInstructions}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Itemized Order Items Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-purple-700" /> Order Items List
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <Image
                    src={item.image || 'https://images.unsplash.com/photo-1621996346565-e3d5d6281276?w=100'}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{item.productName}</h4>
                  <span className="text-slate-500">{item.quantity} × £{item.price.toFixed(2)}</span>
                </div>
              </div>
              <span className="font-extrabold text-purple-950">£{item.subtotal.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Totals Summary */}
        <div className="pt-4 border-t border-slate-200 space-y-1 text-xs text-right">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal:</span>
            <span className="font-bold text-slate-900">£{order.subtotal?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Delivery Fee:</span>
            <span className="font-bold text-slate-900">
              {order.deliveryFee === 0 ? 'FREE' : `£${order.deliveryFee?.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-base font-black text-purple-950 pt-2 border-t border-slate-200">
            <span>Grand Total:</span>
            <span>£{order.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
