import React from 'react';

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function getStoreSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'GroceryStore',
    '@id': `${siteUrl}/#store`,
    name: 'Sithisha Masala & Snacks',
    alternateName: 'Sithisha Grocery & Snack UK',
    url: siteUrl,
    logo: `${siteUrl}/logo.jpg`,
    image: `${siteUrl}/hero-showcase.png`,
    description:
      'Authentic South Asian masalas, Jaffna mixture savouries, Ceylon spices, and everyday UK groceries in Birmingham.',
    telephone: '+44741530377',
    email: 'info@sithisha.co.uk',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '120 Parsons Hill',
      addressLocality: 'Birmingham',
      postalCode: 'B30 3QP',
      addressCountry: 'GB',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 52.4087,
      longitude: -1.9298,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '08:00',
        closes: '20:00',
      },
    ],
    priceRange: '£',
    currenciesAccepted: 'GBP',
    paymentAccepted: 'Cash, Credit Card, Direct WhatsApp',
    sameAs: [
      'https://wa.me/44741530377',
    ],
  };
}

export function getWebSiteSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: 'Sithisha Masala & Snacks UK',
    url: siteUrl,
    publisher: {
      '@id': `${siteUrl}/#store`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/shop?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getProductSchema(product: {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  images?: string[];
  price: number;
  stock: number;
  sku?: string;
  categoryName?: string;
}, siteUrl: string) {
  const images = product.images && product.images.length > 0
    ? product.images
    : [`${siteUrl}/logo.jpg`];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: images,
    description: product.description || product.shortDescription || product.name,
    sku: product.sku || product.slug,
    brand: {
      '@type': 'Brand',
      name: 'Sithisha',
    },
    category: product.categoryName || 'Masala & Snacks',
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/product/${product.slug}`,
      priceCurrency: 'GBP',
      price: product.price.toFixed(2),
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Sithisha Masala & Snacks',
      },
    },
  };
}

export function getBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
  siteUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}
