'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { useSettings } from '@/context/SettingsContext';

export default function ContactForm() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.name.trim();
    if (!name) {
      toast.error('Please enter your full name.');
      return;
    }

    if (name.length > 60) {
      toast.error('Name cannot exceed 60 characters.');
      return;
    }

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

    if (formData.subject.length > 100) {
      toast.error('Subject cannot exceed 100 characters.');
      return;
    }

    const message = formData.message.trim();
    if (!message) {
      toast.error('Please enter your message.');
      return;
    }

    if (message.length > 1000) {
      toast.error('Message cannot exceed 1000 characters.');
      return;
    }

    toast.success('Thank you! Your message has been sent to our team.');
    setSubmitted(true);
  };

  const handleWhatsAppContact = () => {
    const text = `Hello Sithisha Masala & Snacks team! 👋\nI have an inquiry regarding masala & snacks.\nName: ${formData.name || 'Customer'}\nMessage: ${formData.message || 'General inquiry'}`;
    const whatsappNum = settings.whatsappNumber || settings.phone;
    const url = buildWhatsAppUrl(whatsappNum, text);
    window.open(url, '_blank');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Left Contact Information Cards */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Store Information</h3>

          <div className="space-y-4 text-xs font-medium text-slate-700">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 text-purple-700 rounded-xl shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Our Address</h4>
                <p className="text-slate-500 mt-0.5">120 Parsons Hill, Birmingham, B30 3QP, United Kingdom</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 text-purple-700 rounded-xl shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Phone Contact</h4>
                <p className="text-slate-500 mt-0.5">0741530377</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-50 text-purple-700 rounded-xl shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Email Address</h4>
                <p className="text-slate-500 mt-0.5">info@sithisha.co.uk</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-purple-100">
            <button
              type="button"
              onClick={handleWhatsAppContact}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp Now
            </button>
          </div>
        </div>
      </div>

      {/* Right Contact Form */}
      <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-purple-100 shadow-sm space-y-6">
        <h2 className="text-lg font-extrabold text-slate-900">Send Us a Message</h2>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
            <p className="text-xs text-slate-500">We will respond to your inquiry as soon as possible.</p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="px-4 py-2 bg-purple-900 text-white font-bold text-xs rounded-xl"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Your Name *</label>
                <input
                  type="text"
                  required
                  maxLength={60}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 outline-none focus:border-purple-700"
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  maxLength={80}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 outline-none focus:border-purple-700"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Subject</label>
              <input
                type="text"
                maxLength={100}
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 outline-none focus:border-purple-700"
                placeholder="Order Inquiry / Product Availability"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Your Message *</label>
              <textarea
                rows={4}
                required
                maxLength={1000}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 outline-none focus:border-purple-700"
                placeholder="Type your message here..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
