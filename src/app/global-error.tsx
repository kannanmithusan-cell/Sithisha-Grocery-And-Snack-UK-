'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-purple-950 text-white flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-purple-900/90 border border-purple-800 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <h2 className="text-2xl font-black tracking-tight text-white uppercase">Something went wrong!</h2>
          <p className="text-xs text-purple-200 leading-relaxed font-medium">
            {error?.message || 'An unexpected application error occurred.'}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
