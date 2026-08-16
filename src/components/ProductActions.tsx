'use client';

import React, { useState } from 'react';
import { IProduct } from '@/types';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, MessageCircle, Plus, Minus } from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

import { useSettings } from '@/context/SettingsContext';

interface ProductActionsProps {
  product: IProduct;
}

const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { settings } = useSettings();

  const isOutOfStock = product.stock <= 0;

  const handleQuantityIncrease = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleDirectWhatsApp = () => {
    const quickMessage = `Hello Sithisha Masala&snacks! 👋\nI would like to order:\n\n*${product.name}*\nPrice: £${product.price.toFixed(2)}\nQuantity: ${quantity}\nTotal: £${(product.price * quantity).toFixed(2)}\n\nPlease let me know availability and delivery options. Thank you!`;
    const whatsappNum = settings.whatsappNumber || settings.phone;
    const url = buildWhatsAppUrl(whatsappNum, quickMessage);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold text-slate-700">Quantity:</span>
        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
          <button
            type="button"
            disabled={isOutOfStock || quantity <= 1}
            onClick={handleQuantityDecrease}
            className="p-2.5 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-extrabold text-sm text-slate-900">
            {quantity}
          </span>
          <button
            type="button"
            disabled={isOutOfStock || quantity >= product.stock}
            onClick={handleQuantityIncrease}
            className="p-2.5 text-slate-600 hover:bg-slate-200 disabled:opacity-40 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dual CTA Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => addToCart(product, quantity)}
          className="py-3.5 px-6 bg-purple-900 hover:bg-purple-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-extrabold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-purple-subtle flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" /> Add to Shopping Cart
        </button>

        <button
          type="button"
          onClick={handleDirectWhatsApp}
          className="py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" /> Order via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ProductActions;
