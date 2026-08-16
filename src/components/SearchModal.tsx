'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { IProduct } from '@/types';
import { useCart } from '@/context/CartContext';

interface SearchModalProps {
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`);
        const data = await res.json();
        if (data.success) {
          setResults(data.data.products || []);
        }
      } catch (err) {
        console.error('Search query error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-16 px-4 animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-purple-100">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-purple-100 flex items-center gap-3 bg-purple-50/50">
          <Search className="w-5 h-5 text-purple-700 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search masalas, Jaffna snacks, spices, rice..."
            autoFocus
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-base outline-none font-medium"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {isLoading && (
            <div className="py-8 text-center text-slate-500 text-sm font-medium">
              Searching catalogue...
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="py-8 text-center text-slate-500">
              <p className="font-semibold text-slate-700">No products found</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for &quot;mixture&quot;, &quot;curry powder&quot;, or &quot;basmati&quot;</p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                Matching Products ({results.length})
              </div>
              <div className="grid gap-2">
                {results.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-2.5 hover:bg-purple-50 rounded-xl transition-colors group"
                  >
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <Image
                          src={product.images[0] || 'https://images.unsplash.com/photo-1621996346565-e3d5d6281276?w=200'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 truncate">
                          {product.name}
                        </h4>
                        <span className="text-xs text-purple-700 font-semibold">
                          £{product.price.toFixed(2)}
                        </span>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        addToCart(product, 1);
                        onClose();
                      }}
                      className="p-2 bg-purple-900 hover:bg-purple-800 text-white rounded-lg transition-colors ml-2"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100 text-center">
                <Link
                  href={`/shop?search=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900"
                >
                  View all results in shop <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {!query && (
            <div className="py-6 text-center text-slate-400 text-xs">
              Type above to search our full catalog of authentic UK masalas & snacks.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
