'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { generateWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp';
import toast from 'react-hot-toast';
import { ShieldCheck, MessageCircle, ArrowLeft, Lock } from 'lucide-react';

import { useSettings } from '@/context/SettingsContext';

export default function CheckoutPage() {
  const { cart, subtotal, deliveryFee, total, clearCart } = useCart();
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Birmingham',
    postcode: '',
    deliveryInstructions: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errs: Record<string, string> = {};

    const name = formData.customerName.trim();
    if (!name) {
      errs.customerName = 'Full Name is required.';
    } else if (name.length > 60) {
      errs.customerName = 'Full Name cannot exceed 60 characters.';
    }

    const phone = formData.phone.trim();
    if (!phone) {
      errs.phone = 'Mobile Phone Number is required.';
    } else if (!/^[0-9+\s-]{10,15}$/.test(phone)) {
      errs.phone = 'Please enter a valid phone number (10–15 digits).';
    }

    const email = formData.email.trim();
    if (!email) {
      errs.email = 'Email Address is required.';
    } else if (email.length > 80) {
      errs.email = 'Email Address cannot exceed 80 characters.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    const address = formData.address.trim();
    if (!address) {
      errs.address = 'Delivery Address is required.';
    } else if (address.length > 120) {
      errs.address = 'Address cannot exceed 120 characters.';
    }

    const city = formData.city.trim();
    if (!city) {
      errs.city = 'City is required.';
    } else if (city.length > 50) {
      errs.city = 'City cannot exceed 50 characters.';
    }

    const postcode = formData.postcode.trim();
    if (!postcode) {
      errs.postcode = 'Postcode is required.';
    } else if (postcode.length > 12) {
      errs.postcode = 'Postcode cannot exceed 12 characters.';
    }

    if (formData.deliveryInstructions.length > 250) {
      errs.deliveryInstructions = 'Delivery instructions cannot exceed 250 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    // Strict numeric filtering for phone field
    if (name === 'phone') {
      sanitizedValue = value.replace(/[^0-9+\s-]/g, '');
    }

    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix form validation errors before proceeding');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Prepare backend payload
      const orderPayload = {
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        postcode: formData.postcode.trim(),
        deliveryInstructions: formData.deliveryInstructions.trim(),
        items: cart.map((item) => ({
          productId: item.product._id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
      };

      // 2. Save order to MongoDB via API endpoint
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit order');
      }

      const createdOrder = result.data;

      toast.success('Order created! Opening WhatsApp...');

      // 3. Generate WhatsApp message string
      const whatsappMessage = generateWhatsAppMessage(createdOrder);

      // 4. Get live WhatsApp number directly from database settings
      let whatsappNum = settings.whatsappNumber || '';
      try {
        const settingsRes = await fetch('/api/settings', { cache: 'no-store' });
        const settingsData = await settingsRes.json();
        if (settingsData.success && settingsData.data?.whatsappNumber) {
          whatsappNum = settingsData.data.whatsappNumber;
        }
      } catch (settingsErr) {
        console.warn('Could not fetch settings, falling back to context settings', settingsErr);
      }

      const whatsappUrl = buildWhatsAppUrl(whatsappNum, whatsappMessage);

      // 5. Clear cart
      clearCart();

      // 6. Open WhatsApp deep link
      const opened = window.open(whatsappUrl, '_blank');
      if (!opened) {
        window.location.href = whatsappUrl;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-black text-slate-900">Your cart is empty</h1>
        <p className="text-xs text-slate-500">Please add items to cart before proceeding to checkout.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-purple-900 text-white rounded-xl font-bold text-xs"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Cart
        </Link>
      </div>

      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
            FINAL STEP
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Checkout Order</h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-purple-200 bg-purple-900/60 px-3.5 py-1.5 rounded-full border border-purple-700/60">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Secure WhatsApp Confirmation</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Customer Information Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-purple-100 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="pb-4 border-b border-purple-100">
            <h2 className="text-base font-extrabold text-slate-900">1. Customer Details</h2>
            <p className="text-xs text-slate-500">Provide your contact info so we can confirm your order.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customerName"
                maxLength={60}
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="e.g. John Smith"
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.customerName ? 'border-red-500' : 'border-slate-200'
                } text-xs font-medium focus:outline-none focus:border-purple-700 bg-slate-50`}
              />
              {errors.customerName && (
                <p className="text-[11px] text-red-500 font-semibold">{errors.customerName}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Mobile Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                maxLength={15}
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g. 07123456789"
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.phone ? 'border-red-500' : 'border-slate-200'
                } text-xs font-medium focus:outline-none focus:border-purple-700 bg-slate-50`}
              />
              {errors.phone && (
                <p className="text-[11px] text-red-500 font-semibold">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                maxLength={80}
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.email ? 'border-red-500' : 'border-slate-200'
                } text-xs font-medium focus:outline-none focus:border-purple-700 bg-slate-50`}
              />
              {errors.email && (
                <p className="text-[11px] text-red-500 font-semibold">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-purple-100 pb-2">
            <h2 className="text-base font-extrabold text-slate-900">2. Delivery Address</h2>
            <p className="text-xs text-slate-500">Where should we deliver your order?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                maxLength={120}
                value={formData.address}
                onChange={handleInputChange}
                placeholder="120 Parsons Hill, Apt 4"
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.address ? 'border-red-500' : 'border-slate-200'
                } text-xs font-medium focus:outline-none focus:border-purple-700 bg-slate-50`}
              />
              {errors.address && (
                <p className="text-[11px] text-red-500 font-semibold">{errors.address}</p>
              )}
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Town / City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                maxLength={50}
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Birmingham"
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.city ? 'border-red-500' : 'border-slate-200'
                } text-xs font-medium focus:outline-none focus:border-purple-700 bg-slate-50`}
              />
              {errors.city && (
                <p className="text-[11px] text-red-500 font-semibold">{errors.city}</p>
              )}
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Postcode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="postcode"
                maxLength={12}
                value={formData.postcode}
                onChange={handleInputChange}
                placeholder="B30 3QP"
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  errors.postcode ? 'border-red-500' : 'border-slate-200'
                } text-xs font-medium focus:outline-none focus:border-purple-700 bg-slate-50`}
              />
              {errors.postcode && (
                <p className="text-[11px] text-red-500 font-semibold">{errors.postcode}</p>
              )}
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Delivery Instructions (Optional)
              </label>
              <textarea
                name="deliveryInstructions"
                maxLength={250}
                rows={2}
                value={formData.deliveryInstructions}
                onChange={handleInputChange}
                placeholder="Please leave at the side porch or ring doorbell."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-purple-700 bg-slate-50"
              />
              {errors.deliveryInstructions && (
                <p className="text-[11px] text-red-500 font-semibold">{errors.deliveryInstructions}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Order Summary Breakdown & WhatsApp CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-purple-100 p-6 space-y-6 shadow-md sticky top-24">
            <h2 className="text-base font-extrabold text-slate-900 pb-3 border-b border-purple-100">
              Your Order Review ({cart.length} items)
            </h2>

            {/* Itemized List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product._id} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <Image
                        src={item.product.images[0] || 'https://images.unsplash.com/photo-1621996346565-e3d5d6281276?w=100'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-slate-900 truncate">{item.product.name}</h4>
                      <span className="text-slate-500">{item.quantity} × £{item.product.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-purple-950">
                    £{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-4 border-t border-purple-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span className="font-bold text-slate-900">
                  {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `£${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-purple-950 pt-2 border-t border-purple-100">
                <span>Total to Pay</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-amber-700" /> Please review your order before continuing.
              </p>
              <p className="text-[11px] text-amber-800">
                Clicking the button below will save your order and open WhatsApp with your formatted receipt to complete your order with our store team.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              {isSubmitting ? 'Creating Order...' : 'Continue to WhatsApp'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
