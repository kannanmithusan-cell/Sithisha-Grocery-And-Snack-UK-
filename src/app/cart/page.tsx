'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    freeDeliveryThreshold,
    total,
  } = useCart();

  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto text-purple-600">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900">Your Cart is Currently Empty</h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Discover delicious Jaffna snacks, spices, rice, and masalas from our store catalog.
          </p>
        </div>
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-purple-900 hover:bg-purple-800 text-white rounded-2xl font-extrabold text-xs tracking-wider uppercase transition-all shadow-md"
          >
            Explore Product Catalogue <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Shopping Cart ({cart.length} items)
        </h1>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Item Table */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.product._id}
              className="bg-white rounded-2xl border border-purple-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <Image
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1621996346565-e3d5d6281276?w=200'}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-purple-700 uppercase">
                    {item.product.categoryName}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                    {item.product.name}
                  </h3>
                  <span className="text-xs font-extrabold text-purple-900 block sm:hidden">
                    £{item.product.price.toFixed(2)} each
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-0 pt-3 sm:pt-0 border-purple-50">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product._id!, item.quantity - 1)}
                    className="p-2 text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-xs text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product._id!, item.quantity + 1)}
                    className="p-2 text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-purple-950 block">
                    £{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.product._id!)}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  title="Delete Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-purple-100 p-6 space-y-6 shadow-md sticky top-24">
            <h2 className="text-base font-extrabold text-slate-900 pb-3 border-b border-purple-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">£{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span className="font-bold text-slate-900">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    `£${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>

              {remainingForFreeDelivery > 0 && (
                <p className="text-[11px] text-purple-700 bg-purple-50 p-2.5 rounded-xl font-medium">
                  Add <strong className="font-bold">£{remainingForFreeDelivery.toFixed(2)}</strong> more for free delivery!
                </p>
              )}

              <div className="flex justify-between text-base font-black text-purple-950 pt-3 border-t border-purple-100">
                <span>Total Amount</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full py-3.5 px-6 bg-purple-900 hover:bg-purple-800 text-white rounded-2xl font-extrabold text-xs tracking-wider uppercase text-center shadow-md hover:shadow-purple-subtle transition-all flex items-center justify-center gap-2 block"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2 justify-center text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Direct WhatsApp confirmation on checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
