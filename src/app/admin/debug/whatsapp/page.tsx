'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface DebugData {
  found: boolean;
  environment: string;
  mongoUri: string;
  whatsappNumber: string;
  whatsappNumberFull?: string;
  phone: string;
  generatedUrl: string;
  settingsId?: string;
  message?: string;
}

export default function WhatsAppDebugPage() {
  const [debug, setDebug] = useState<DebugData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNumber, setNewNumber] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchDebug = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/whatsapp-debug', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setDebug(data.debug);
      } else {
        toast.error(data.message || 'Failed to fetch debug info');
      }
    } catch (err) {
      toast.error('Error fetching debug info');
    } finally {
      setLoading(false);
    }
  };

  const handleForceUpdate = async () => {
    if (!newNumber.trim()) {
      toast.error('Enter a WhatsApp number first');
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/whatsapp-debug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsappNumber: newNumber.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`✅ Updated! New number: ${data.whatsappNumber}`);
        setNewNumber('');
        fetchDebug();
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchDebug();
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">WhatsApp Debug</h1>
        <p className="text-xs text-red-600 font-bold mt-1">⚠️ Admin-only diagnostic. Do not share this page.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-400">
          Loading production settings from MongoDB...
        </div>
      ) : debug ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider block">Environment</span>
              <span className={`font-black text-sm ${debug.environment === 'production' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {debug.environment}
              </span>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider block">Settings Found</span>
              <span className={`font-black text-sm ${debug.found ? 'text-emerald-700' : 'text-red-700'}`}>
                {debug.found ? '✅ YES' : '❌ NO — Will use defaults!'}
              </span>
            </div>

            <div className="col-span-2 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider block">MongoDB URI (masked)</span>
              <span className="font-mono text-xs text-slate-700 break-all">{debug.mongoUri}</span>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider block">WhatsApp Number (masked)</span>
              <span className="font-black text-sm text-emerald-800">{debug.whatsappNumber}</span>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider block">Store Phone (masked)</span>
              <span className="font-black text-sm text-slate-700">{debug.phone}</span>
            </div>

            {debug.whatsappNumberFull && (
              <div className="col-span-2 space-y-1">
                <span className="font-bold text-red-500 uppercase tracking-wider block">⚠️ Full Number (REMOVE AFTER DEBUG)</span>
                <span className="font-black text-sm text-red-700">{debug.whatsappNumberFull}</span>
              </div>
            )}

            <div className="col-span-2 space-y-1">
              <span className="font-bold text-slate-500 uppercase tracking-wider block">Generated WhatsApp URL</span>
              <a
                href={debug.generatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-purple-700 underline break-all"
              >
                {debug.generatedUrl}
              </a>
            </div>

            {debug.settingsId && (
              <div className="col-span-2 space-y-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider block">Settings Document ID</span>
                <span className="font-mono text-xs text-slate-600">{debug.settingsId}</span>
              </div>
            )}
          </div>

          <button
            onClick={fetchDebug}
            className="text-xs font-bold text-purple-700 hover:underline"
          >
            ↻ Refresh
          </button>
        </div>
      ) : null}

      {/* Force Update Section */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-extrabold text-amber-900">Force Update Production WhatsApp Number</h2>
        <p className="text-xs text-amber-800">
          Use this to directly update the WhatsApp number in the production MongoDB database.
          Enter the number in international format (e.g. 447393139705).
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value.replace(/[^0-9+]/g, ''))}
            placeholder="e.g. 447393139705"
            className="flex-1 px-4 py-2.5 rounded-xl border border-amber-300 text-xs font-mono focus:outline-none focus:border-amber-600 bg-white"
          />
          <button
            onClick={handleForceUpdate}
            disabled={updating}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all"
          >
            {updating ? 'Updating...' : 'Force Update'}
          </button>
        </div>
      </div>
    </div>
  );
}
