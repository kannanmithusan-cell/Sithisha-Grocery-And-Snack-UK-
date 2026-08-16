'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IProduct, CartItem } from '@/types';
import toast from 'react-hot-toast';
import { useSettings } from '@/context/SettingsContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: IProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'sithisha_shopping_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { settings } = useSettings();

  // Dynamic Settings values
  const configuredFee = settings?.deliveryFee !== undefined ? settings.deliveryFee : 3.0;
  const configuredThreshold = settings?.freeDeliveryThreshold !== undefined ? settings.freeDeliveryThreshold : 30.0;

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to parse cart from localStorage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage on updates
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (product: IProduct, quantity = 1) => {
    if (!product._id) return;

    const existingItem = cart.find((item) => item.product._id === product._id);
    const currentQty = existingItem ? existingItem.quantity : 0;
    const newQuantity = currentQty + quantity;

    // Enforce stock limits
    if (newQuantity > product.stock) {
      toast.error(`Sorry, only ${product.stock} units available in stock.`);
      return;
    }

    if (existingItem) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product._id === product._id ? { ...item, quantity: newQuantity } : item
        )
      );
      toast.success(`Updated quantity for ${product.name}`);
    } else {
      setCart((prevCart) => [...prevCart, { product, quantity }]);
      toast.success(`Added ${product.name} to cart`);
    }

    // Auto-open drawer on add
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    const itemToRemove = cart.find((i) => i.product._id === productId);
    if (itemToRemove) {
      toast.success(`Removed ${itemToRemove.product.name} from cart`);
    }
    setCart((prevCart) => prevCart.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const itemToUpdate = cart.find((i) => i.product._id === productId);
    if (itemToUpdate && quantity > itemToUpdate.product.stock) {
      toast.error(`Cannot add more. Only ${itemToUpdate.product.stock} in stock.`);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Delivery Fee logic: FREE if fee set to 0, or if subtotal meets free threshold or subtotal is 0
  const deliveryFee = configuredFee === 0 || subtotal >= configuredThreshold || subtotal === 0 ? 0 : configuredFee;

  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
        deliveryFee,
        freeDeliveryThreshold: configuredThreshold,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
