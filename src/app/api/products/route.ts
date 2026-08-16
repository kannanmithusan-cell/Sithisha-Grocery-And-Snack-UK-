import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || '';
    const categorySlug = searchParams.get('category') || '';
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '99999');
    const priceRange = searchParams.get('priceRange') || '';
    const inStock = searchParams.get('inStock') === 'true';
    const onSale = searchParams.get('onSale') === 'true';
    const featured = searchParams.get('featured') === 'true';
    const sortBy = searchParams.get('sortBy') || 'featured';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    // Build filter query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = { active: true };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { categoryName: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        filter.categoryId = category._id.toString();
      }
    }

    if (priceRange) {
      if (priceRange === 'under-5') {
        filter.price = { $lt: 5 };
      } else if (priceRange === '5-10') {
        filter.price = { $gte: 5, $lte: 10 };
      } else if (priceRange === '10-20') {
        filter.price = { $gte: 10, $lte: 20 };
      } else if (priceRange === '20-plus') {
        filter.price = { $gt: 20 };
      }
    } else if (minPrice > 0 || maxPrice < 99999) {
      filter.price = { $gte: minPrice, $lte: maxPrice };
    }

    if (inStock) {
      filter.stock = { $gt: 0 };
    }

    if (onSale) {
      filter.onSale = true;
    }

    if (featured) {
      filter.featured = true;
    }

    // Build sort options
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sortOptions: any = { featured: -1, createdAt: -1 };
    if (sortBy === 'newest') {
      sortOptions = { createdAt: -1 };
    } else if (sortBy === 'price-asc') {
      sortOptions = { price: 1 };
    } else if (sortBy === 'price-desc') {
      sortOptions = { price: -1 };
    } else if (sortBy === 'name-asc') {
      sortOptions = { name: 1 };
    } else if (sortBy === 'name-desc') {
      sortOptions = { name: -1 };
    } else if (sortBy === 'best-selling') {
      sortOptions = { bestSeller: -1, price: -1 };
    }

    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      Product.find(filter).sort(sortOptions).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          totalCount,
          totalPages,
          currentPage: page,
          limit,
        },
      },
    });
  } catch (error) {
    console.error('API /api/products GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const {
      name,
      description,
      shortDescription,
      price,
      originalPrice,
      categoryId,
      categoryName,
      images = [],
      cloudinaryPublicIds = [],
      stock,
      sku,
      tags = [],
      featured = false,
      bestSeller = false,
      onSale = false,
      active = true,
    } = body;

    // Strict Backend Image Count Check
    if (Array.isArray(images) && images.length > 4) {
      return NextResponse.json(
        { success: false, message: 'Maximum 4 images are allowed per product.' },
        { status: 400 }
      );
    }

    if (!name || !description || price === undefined || !categoryId) {
      return NextResponse.json(
        { success: false, message: 'Missing required product fields (name, description, price, categoryId).' },
        { status: 400 }
      );
    }

    // Auto generate slug
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') + `-${Date.now().toString().slice(-4)}`;

    const newProduct = await Product.create({
      name,
      slug,
      description,
      shortDescription,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : 0,
      categoryId,
      categoryName,
      images,
      cloudinaryPublicIds,
      stock: Number(stock || 0),
      sku,
      tags,
      featured,
      bestSeller,
      onSale,
      active,
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    console.error('API /api/products POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create product' },
      { status: 500 }
    );
  }
}
