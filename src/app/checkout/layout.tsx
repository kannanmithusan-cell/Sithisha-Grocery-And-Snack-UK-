import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | Sithisha Masala & Snacks UK',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
