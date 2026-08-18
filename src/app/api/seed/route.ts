import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Settings from '@/models/Settings';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const SAMPLE_CATEGORIES = [
  {
    name: 'Snacks & Savouries',
    slug: 'snacks-savouries',
    description: 'Crispy mixtures, murukku, cassava chips, and authentic South Asian snacks.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281276?w=600&auto=format&fit=crop&q=80',
    displayOrder: 1,
    active: true,
  },
  {
    name: 'Spices & Masalas',
    slug: 'spices-masalas',
    description: 'Pure single spices, curry powders, roasted masalas, and whole aromatic spices.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
    displayOrder: 2,
    active: true,
  },
  {
    name: 'Rice & Grains',
    slug: 'rice-grains',
    description: 'Premium Basmati, Red Rice, Samba rice, dal, and pulse varieties.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    displayOrder: 3,
    active: true,
  },
  {
    name: 'Beverages & Soft Drinks',
    slug: 'beverages',
    description: 'Traditional ginger beer, fruit cordials, milk packets, and tea blends.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    displayOrder: 4,
    active: true,
  },
  {
    name: 'Pickles & Sambals',
    slug: 'pickles-sauces',
    description: 'Traditional lime pickle, mango chutney, chili paste, and katta sambal.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    displayOrder: 5,
    active: true,
  },
];

const SAMPLE_PRODUCTS = [
  {
    name: 'Jaffna Special Spicy Mixture 500g',
    slug: 'jaffna-spicy-mixture-500g',
    description: 'Handcrafted traditional crunchy mixture loaded with roasted peanuts, fried curry leaves, spicy chickpea flour noodles, and authentic northern spices.',
    price: 3.99,
    originalPrice: 4.99,
    categoryName: 'Snacks & Savouries',
    unit: '500g',
    stock: 45,
    images: ['https://images.unsplash.com/photo-1621996346565-e3d5d6281276?w=800&auto=format&fit=crop&q=80'],
    featured: true,
    bestSeller: true,
    onSale: true,
    active: true,
  },
  {
    name: 'Ceylon Roasted Curry Powder 250g',
    slug: 'ceylon-roasted-curry-powder-250g',
    description: 'Dark roasted blend of coriander, cumin, fennel, cardamoms, and cloves for rich authentic dark meat & vegetable curries.',
    price: 2.75,
    originalPrice: 3.25,
    categoryName: 'Spices & Masalas',
    unit: '250g',
    stock: 60,
    images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80'],
    featured: true,
    bestSeller: true,
    onSale: false,
    active: true,
  },
  {
    name: 'Premium Royal Basmati Rice 5kg',
    slug: 'royal-basmati-rice-5kg',
    description: 'Long-grain extra aromatic aged Basmati rice ideal for biryanis, pilafs, and daily meals.',
    price: 11.99,
    originalPrice: 13.99,
    categoryName: 'Rice & Grains',
    unit: '5kg',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'],
    featured: true,
    bestSeller: true,
    onSale: true,
    active: true,
  },
  {
    name: 'Traditional Elephant Ginger Beer 330ml Can',
    slug: 'elephant-ginger-beer-330ml',
    description: 'Sparkling authentic ginger beer beverage with a spicy natural ginger kick.',
    price: 0.99,
    originalPrice: 1.20,
    categoryName: 'Beverages & Soft Drinks',
    unit: '330ml',
    stock: 120,
    images: ['https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80'],
    featured: false,
    bestSeller: true,
    onSale: false,
    active: true,
  },
  {
    name: 'Spicy Ceylon Lime Pickle 350g Jar',
    slug: 'spicy-lime-pickle-350g',
    description: 'Sun-cured spiced salted limes preserved with chili flakes, mustard, and sesame oil.',
    price: 3.25,
    originalPrice: 3.75,
    categoryName: 'Pickles & Sambals',
    unit: '350g',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80'],
    featured: false,
    bestSeller: false,
    onSale: false,
    active: true,
  },
  {
    name: 'Crunchy Butter Murukku 300g',
    slug: 'crunchy-butter-murukku-300g',
    description: 'Melt-in-mouth savoury butter coils seasoned with cumin seeds and asafoetida.',
    price: 2.49,
    originalPrice: 2.99,
    categoryName: 'Snacks & Savouries',
    unit: '300g',
    stock: 50,
    images: ['https://images.unsplash.com/photo-1621996346565-e3d5d6281276?w=800&auto=format&fit=crop&q=80'],
    featured: true,
    bestSeller: false,
    onSale: true,
    active: true,
  },
  {
    name: 'Whole Cardamom Pods 100g',
    slug: 'whole-cardamom-pods-100g',
    description: 'Fragrant green cardamom pods for sweets, curries, and spiced teas.',
    price: 4.50,
    originalPrice: 5.25,
    categoryName: 'Spices & Masalas',
    unit: '100g',
    stock: 40,
    images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80'],
    featured: true,
    bestSeller: false,
    onSale: false,
    active: true,
  },
  {
    name: 'Red Raw Rice 2kg Bag',
    slug: 'red-raw-rice-2kg',
    description: 'Nutritious unpolished red rice rich in natural fiber and iron.',
    price: 4.25,
    originalPrice: 4.99,
    categoryName: 'Rice & Grains',
    unit: '2kg',
    stock: 35,
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'],
    featured: false,
    bestSeller: false,
    onSale: true,
    active: true,
  },
];

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();

    // Clear existing
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Seed categories
    const createdCategories = await Category.insertMany(SAMPLE_CATEGORIES);

    const categoryMap: Record<string, string> = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id.toString();
    });

    // Seed products
    const productsToInsert = SAMPLE_PRODUCTS.map((prod) => ({
      ...prod,
      categoryId: categoryMap[prod.categoryName] || createdCategories[0]._id.toString(),
    }));

    await Product.insertMany(productsToInsert);

    // Seed Settings
    await Settings.deleteMany({});
    await Settings.create({
      storeName: 'Sithisha Masala&snacks',
      address: '120 Parsons Hill, Birmingham, B30 3QP, United Kingdom',
      phone: '07393139705',
      email: 'Kannanmithusan@gmail.com',
      whatsappNumber: '447393139705',
      deliveryFee: 3.0,
      freeDeliveryThreshold: 30.0,
      currency: 'GBP',
    });

    // Seed Admin User
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('Sithisha@05', 10);
    await User.create({
      name: 'Store Administrator',
      email: 'admin@sithisha',
      passwordHash,
      role: 'admin',
    });

    return NextResponse.json({
      success: true,
      message: 'Atlas Database seeded successfully!',
      counts: {
        categories: createdCategories.length,
        products: productsToInsert.length,
      },
    });
  } catch (error) {
    console.error('API Seed error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Seed failed' },
      { status: 500 }
    );
  }
}
