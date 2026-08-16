import { MetadataRoute } from 'next';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sithishamasalaandsnacks.com';

  // Base static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  try {
    await connectToDatabase();

    // Fetch active categories
    const categories = await Category.find({ active: true }).lean();
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat: any) => ({
      url: `${baseUrl}/shop?category=${cat.slug}`,
      lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Fetch active products
    const products = await Product.find({ active: true })
      .select('slug updatedAt createdAt')
      .lean();
    const productRoutes: MetadataRoute.Sitemap = products.map((product: any) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticRoutes;
  }
}
