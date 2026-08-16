'use client';

import React from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white border border-purple-100 rounded-3xl p-8 space-y-4 shadow-md">
        <h2 className="text-2xl font-black text-slate-900 uppercase">Something went wrong</h2>
        <p className="text-xs text-slate-600 font-medium">
          {error?.message || 'An unexpected error occurred while loading this page.'}
        </p>
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 py-3 bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="flex-1 py-3 bg-white border border-purple-200 text-purple-900 font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-purple-50 transition-all"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
