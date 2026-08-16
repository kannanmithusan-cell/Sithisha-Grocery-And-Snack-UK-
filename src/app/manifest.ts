import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sithisha Masala & Snacks UK',
    short_name: 'Sithisha',
    description:
      'Authentic South Asian masalas, Jaffna mixture snacks, Ceylon spices & everyday groceries in Birmingham, UK.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fcfbfe',
    theme_color: '#4c1d95',
    icons: [
      {
        src: '/logo-circle.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo-circle.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
