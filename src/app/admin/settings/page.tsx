'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Save, Store, Phone, Mail, MessageCircle, Truck, Lock, Key, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '@/context/SettingsContext';

export default function AdminSettingsPage() {
  const { refreshSettings } = useSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const COUNTRY_CODES = [
    { code: '+94', label: '🇱🇰 +94 (Sri Lanka)' },
    { code: '+44', label: '🇬🇧 +44 (UK)' },
    { code: '+91', label: '🇮🇳 +91 (India)' },
    { code: '+1',  label: '🇺🇸 +1  (USA/Canada)' },
    { code: '+61', label: '🇦🇺 +61 (Australia)' },
    { code: '+971', label: '🇦🇪 +971 (UAE)' },
  ];

  const [waCountryCode, setWaCountryCode] = useState('+94');
  const [waLocalNumber, setWaLocalNumber] = useState('');

  const [formData, setFormData] = useState({
    storeName: '',
    address: '',
    phone: '',
    email: '',
    deliveryFee: '3.00',
    freeDeliveryThreshold: '30.00',
    currency: 'GBP',
  });

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const s = data.data;
          // Parse stored whatsappNumber into countryCode + localNumber
          const rawWa = (s.whatsappNumber || s.phone || '').trim();
          const knownCodes = ['+971', '+94', '+44', '+91', '+61', '+1'];
          let detectedCode = '+94';
          let detectedLocal = rawWa.replace(/^\+/, '');
          for (const c of knownCodes) {
            const digits = c.replace('+', '');
            if (detectedLocal.startsWith(digits)) {
              detectedCode = c;
              detectedLocal = detectedLocal.slice(digits.length);
              break;
            }
          }
          setWaCountryCode(detectedCode);
          setWaLocalNumber(detectedLocal);
          setFormData({
            storeName: s.storeName || 'Sithisha Masala&snacks',
            address: s.address || '120 Parsons Hill, Birmingham, B30 3QP, United Kingdom',
            phone: s.phone || '',
            email: s.email || '',
            deliveryFee: s.deliveryFee !== undefined ? s.deliveryFee.toString() : '3.00',
            freeDeliveryThreshold: s.freeDeliveryThreshold !== undefined ? s.freeDeliveryThreshold.toString() : '30.00',
            currency: s.currency || 'GBP',
          });
        }
      })
      .catch((err) => console.error('Fetch settings error:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const storeName = formData.storeName.trim();
    if (!storeName) {
      toast.error('Store Name is required.');
      return;
    }
    if (storeName.length > 80) {
      toast.error('Store Name cannot exceed 80 characters.');
      return;
    }

    const address = formData.address.trim();
    if (!address) {
      toast.error('Store Address is required.');
      return;
    }
    if (address.length > 150) {
      toast.error('Address cannot exceed 150 characters.');
      return;
    }

    const storePhone = formData.phone.trim();
    const localDigits = waLocalNumber.replace(/\D/g, '');
    if (!localDigits) {
      toast.error('WhatsApp number is required.');
      return;
    }
    const whatsappNumber = waCountryCode + localDigits;

    if (formData.email.trim()) {
      if (formData.email.length > 80) {
        toast.error('Email cannot exceed 80 characters.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        toast.error('Please enter a valid email address.');
        return;
      }
    }

    const fee = parseFloat(formData.deliveryFee);
    if (isNaN(fee) || fee < 0) {
      toast.error('Delivery Fee must be a positive number.');
      return;
    }

    const threshold = parseFloat(formData.freeDeliveryThreshold);
    if (isNaN(threshold) || threshold < 0) {
      toast.error('Free Delivery Threshold must be a positive number.');
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        storeName,
        address,
        phone: storePhone,
        email: formData.email.trim(),
        whatsappNumber: whatsappNumber,
        deliveryFee: fee,
        freeDeliveryThreshold: threshold,
        currency: formData.currency,
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update settings');
      }

      await refreshSettings();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('settings-updated'));
      }
      toast.success('Store settings saved successfully!');
    } catch (err) {
      console.error('Settings save error:', err);
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwords.currentPassword) {
      toast.error('Current password is required.');
      return;
    }
    if (!passwords.newPassword) {
      toast.error('New password is required.');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setIsChangingPass(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update password');
      }

      toast.success('Admin password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Password change error:', err);
      toast.error(err instanceof Error ? err.message : 'Password change failed');
    } finally {
      setIsChangingPass(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading store settings...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Store Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Configure store details, WhatsApp phone number, and delivery fee thresholds.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Store Profile */}
        <div className="space-y-4">
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Store className="w-4 h-4 text-purple-700" /> Store Profile & Address
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-slate-700">Store Name</label>
              <input
                type="text"
                required
                maxLength={80}
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-slate-700">Store Physical Address</label>
              <input
                type="text"
                required
                maxLength={150}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp & Contact Config */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp & Contact Channels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>WhatsApp Order Phone Number *</span>
                <span className="text-[10px] text-emerald-700 font-semibold">(Direct number used for all WhatsApp order links)</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={waCountryCode}
                  onChange={(e) => setWaCountryCode(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-emerald-50/50 text-emerald-950 outline-none focus:border-emerald-600 shrink-0"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  maxLength={15}
                  value={waLocalNumber}
                  onChange={(e) => setWaLocalNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="7393139705"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold bg-emerald-50/50 text-emerald-950 outline-none focus:border-emerald-600"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Will be saved as: <span className="font-bold text-emerald-700">{waCountryCode}{waLocalNumber.replace(/\D/g, '') || 'xxxxxxxxx'}</span>
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Store Display Phone Number</label>
              <input
                type="text"
                maxLength={25}
                value={formData.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9+\s-]/g, '');
                  setFormData({ ...formData, phone: val });
                }}
                placeholder="e.g. 07393139705"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Store Support Email</label>
              <input
                type="email"
                maxLength={80}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Delivery Rates */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-purple-700" /> Delivery Fee Settings
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Standard Delivery Fee (£)</label>
              <input
                type="text"
                inputMode="decimal"
                value={formData.deliveryFee}
                onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value.replace(/[^0-9.]/g, '') })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Free Delivery Threshold (£)</label>
              <input
                type="text"
                inputMode="decimal"
                value={formData.freeDeliveryThreshold}
                onChange={(e) => setFormData({ ...formData, freeDeliveryThreshold: e.target.value.replace(/[^0-9.]/g, '') })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

      {/* Admin Account Security & Password Change */}
      <form onSubmit={handlePasswordSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-700" /> Admin Account Security
          </h2>
          <p className="text-xs text-slate-500">Update your administrator password for accessing the control panel.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="sm:col-span-2 space-y-1">
            <label className="block text-xs font-bold text-slate-700">Current Password *</label>
            <div className="relative">
              <input
                type={showCurrentPass ? 'text' : 'password'}
                required
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                placeholder="Enter current password"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none focus:border-purple-700 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">New Password *</label>
            <div className="relative">
              <input
                type={showNewPass ? 'text' : 'password'}
                required
                minLength={6}
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none focus:border-purple-700 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Confirm New Password *</label>
            <input
              type={showNewPass ? 'text' : 'password'}
              required
              minLength={6}
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              placeholder="Re-enter new password"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 outline-none focus:border-purple-700"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Password hashed & encrypted in MongoDB Atlas
          </span>
          <button
            type="submit"
            disabled={isChangingPass}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Lock className="w-4 h-4" /> {isChangingPass ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
