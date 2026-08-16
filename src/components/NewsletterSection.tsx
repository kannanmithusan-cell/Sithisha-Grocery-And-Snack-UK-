'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedSection from './AnimatedSection';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    toast.success('Thank you for subscribing to Sithisha updates!');
    setEmail('');
  };

  return (
    <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-gradient-to-r from-purple-50/90 via-white to-purple-50/90 text-slate-900 rounded-3xl p-8 sm:p-12 border border-purple-100 shadow-sm relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-6 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-black uppercase tracking-wider border border-purple-200">
              <Mail className="w-3.5 h-3.5" /> STORE UPDATES & DEALS
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
              Stay in the Loop
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Get updates about new authentic masala arrivals, fresh Jaffna snack batches, seasonal offers, and store announcements.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="bg-white p-6 rounded-2xl border border-emerald-400/50 text-center space-y-2 shadow-xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-extrabold text-base text-slate-900">You&apos;re Subscribed!</h3>
                <p className="text-xs text-slate-600">
                  Thank you for joining. We&apos;ll keep you posted on new masala stocks and special offers.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="w-5 h-5 text-purple-600 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-purple-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-100 text-xs sm:text-sm transition-all shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-purple-900 hover:bg-purple-800 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
