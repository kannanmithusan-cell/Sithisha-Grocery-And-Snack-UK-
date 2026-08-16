import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white border border-purple-100 rounded-3xl p-8 space-y-4 shadow-md">
        <h2 className="text-3xl font-black text-purple-950 uppercase">404 — Page Not Found</h2>
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <div>
          <Link
            href="/"
            className="inline-block py-3 px-6 bg-purple-900 hover:bg-purple-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
