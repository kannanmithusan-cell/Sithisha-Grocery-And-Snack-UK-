'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ISettingsData {
  storeName: string;
  address: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  currency: string;
}

interface SettingsContextType {
  settings: ISettingsData;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const DEFAULT_SETTINGS: ISettingsData = {
  storeName: 'Sithisha Masala&snacks',
  address: '120 Parsons Hill, Birmingham, B30 3QP, United Kingdom',
  phone: '0741530377',
  email: 'info@sithisha.co.uk',
  whatsappNumber: '0741530377',
  deliveryFee: 3.0,
  freeDeliveryThreshold: 30.0,
  currency: 'GBP',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ISettingsData>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.data) {
        const phoneVal = data.data.phone || DEFAULT_SETTINGS.phone;
        const whatsappVal = data.data.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber;

        setSettings({
          storeName: data.data.storeName || DEFAULT_SETTINGS.storeName,
          address: data.data.address || DEFAULT_SETTINGS.address,
          phone: phoneVal,
          email: data.data.email || DEFAULT_SETTINGS.email,
          whatsappNumber: whatsappVal,
          deliveryFee: data.data.deliveryFee !== undefined ? data.data.deliveryFee : DEFAULT_SETTINGS.deliveryFee,
          freeDeliveryThreshold: data.data.freeDeliveryThreshold !== undefined ? data.data.freeDeliveryThreshold : DEFAULT_SETTINGS.freeDeliveryThreshold,
          currency: data.data.currency || DEFAULT_SETTINGS.currency,
        });
      }
    } catch (err) {
      console.error('SettingsProvider fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    const handleUpdate = () => {
      fetchSettings();
    };

    window.addEventListener('settings-updated', handleUpdate);
    window.addEventListener('focus', handleUpdate);
    document.addEventListener('visibilitychange', handleUpdate);

    return () => {
      window.removeEventListener('settings-updated', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
      document.removeEventListener('visibilitychange', handleUpdate);
    };
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
