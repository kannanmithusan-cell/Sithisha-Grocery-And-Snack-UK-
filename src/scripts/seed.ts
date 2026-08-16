import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import connectToDatabase from '../lib/db';
import Product from '../models/Product';
import Category from '../models/Category';
import Settings from '../models/Settings';
import User from '../models/User';
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
    name: 'Sweets & Biscuits',
    slug: 'sweets-biscuits',
    description: 'Traditional sweets, milk biscuits, jaggery treats, and tea biscuits.',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',
    displayOrder: 4,
    active: true,
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    description: 'Authentic ginger beer, herbal teas, fruit juices, and malt drinks.',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&auto=format&fit=crop&q=80',
    displayOrder: 5,
    active: true,
  },
  {
    name: 'Pickles & Sauces',
    slug: 'pickles-sauces',
    description: 'Spicy lime pickles, mango chutneys, sambals, and cooking pastes.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
    displayOrder: 6,
    active: true,
  },
];

const SAMPLE_PRODUCTS = [
  {
    name: 'Jaffna Special Mixture (350g)',
    slug: 'jaffna-special-mixture-350g',
    description: 'Handcrafted authentic spicy Jaffna mixture packed with roasted peanuts, curry leaves, fried chickpeas, and traditional sev. Perfect evening tea snack.',
    shortDescription: 'Spicy South Asian snack mixture with peanuts and curry leaves.',
    price: 3.99,
    originalPrice: 4.50,
    categorySlug: 'snacks-savouries',
    categoryName: 'Snacks & Savouries',
    images: [
      'https://images.unsplash.com/photo-1621996346565-e3d5d6281276?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 45,
    sku: 'SNK-JAF-350',
    tags: ['spicy', 'mixture', 'jaffna', 'snack', 'bestseller'],
    featured: true,
    bestSeller: true,
    onSale: true,
    active: true,
  },
  {
    name: 'Ceylon Roasted Curry Powder (250g)',
    slug: 'ceylon-roasted-curry-powder-250g',
    description: 'Authentic dark roasted Sri Lankan curry powder crafted from roasted coriander, cumin, fennel, and aromatic spices. Gives a rich mahogany hue to meat and vegetable curries.',
    shortDescription: 'Rich dark roasted aromatic curry powder.',
    price: 3.49,
    originalPrice: 3.99,
    categorySlug: 'spices-masalas',
    categoryName: 'Spices & Masalas',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 60,
    sku: 'SPC-CRCP-250',
    tags: ['spice', 'curry powder', 'ceylon', 'roasted'],
    featured: true,
    bestSeller: true,
    onSale: true,
    active: true,
  },
  {
    name: 'Crispy Tapioca Cassava Chips (200g)',
    slug: 'crispy-tapioca-cassava-chips-200g',
    description: 'Thinly sliced fried cassava chips tossed with chilli powder and sea salt. Unbeatable crunch and flavour.',
    shortDescription: 'Crunchy salted & spicy tapioca chips.',
    price: 2.49,
    originalPrice: 2.99,
    categorySlug: 'snacks-savouries',
    categoryName: 'Snacks & Savouries',
    images: [
      'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 30,
    sku: 'SNK-CAS-200',
    tags: ['cassava', 'tapioca', 'chips', 'crispy'],
    featured: false,
    bestSeller: true,
    onSale: true,
    active: true,
  },
  {
    name: 'Traditional Butter Murukku (250g)',
    slug: 'traditional-butter-murukku-250g',
    description: 'Melt-in-your-mouth spiral butter murukku made with rice flour, roasted gram, sesame seeds, and pure butter.',
    shortDescription: 'Melt in mouth spiral butter murukku.',
    price: 2.99,
    originalPrice: 3.49,
    categorySlug: 'snacks-savouries',
    categoryName: 'Snacks & Savouries',
    images: [
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 50,
    sku: 'SNK-MUR-250',
    tags: ['murukku', 'butter', 'savoury'],
    featured: true,
    bestSeller: false,
    onSale: false,
    active: true,
  },
  {
    name: 'Royal Basmati Rice Extra Long Grain (5kg)',
    slug: 'royal-basmati-rice-5kg',
    description: 'Premium aged extra-long grain Basmati rice. Delivers fluffy, aromatic rice perfect for biryani and daily meals.',
    shortDescription: 'Aged extra long grain Basmati rice 5kg pack.',
    price: 12.99,
    originalPrice: 14.99,
    categorySlug: 'rice-grains',
    categoryName: 'Rice & Grains',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 25,
    sku: 'GRA-BAS-5KG',
    tags: ['basmati', 'rice', 'grains', '5kg'],
    featured: true,
    bestSeller: true,
    onSale: true,
    active: true,
  },
  {
    name: 'Hot Extra Spicy Red Chilli Powder (400g)',
    slug: 'hot-extra-spicy-red-chilli-powder-400g',
    description: 'Sun-dried red chilli powder ground to perfection. Brings vibrant colour and authentic heat to every curry.',
    shortDescription: 'Sun-dried pure spicy red chilli powder.',
    price: 3.25,
    originalPrice: 3.75,
    categorySlug: 'spices-masalas',
    categoryName: 'Spices & Masalas',
    images: [
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 40,
    sku: 'SPC-CHL-400',
    tags: ['chilli', 'powder', 'hot', 'spice'],
    featured: false,
    bestSeller: false,
    onSale: true,
    active: true,
  },
  {
    name: 'Sparkling Elephant Ginger Beer (6 x 330ml)',
    slug: 'sparkling-elephant-ginger-beer-6pack',
    description: 'Fiery and refreshing Sri Lankan style ginger beer brewed with real ginger extract.',
    shortDescription: 'Fiery sparkling ginger beer 6-can pack.',
    price: 4.99,
    originalPrice: 5.99,
    categorySlug: 'beverages',
    categoryName: 'Beverages',
    images: [
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 35,
    sku: 'BEV-EGB-6PK',
    tags: ['ginger beer', 'beverage', 'sparkling', 'drinks'],
    featured: true,
    bestSeller: true,
    onSale: true,
    active: true,
  },
  {
    name: 'Hot Green Lime Pickle (400g Glass Jar)',
    slug: 'hot-green-lime-pickle-400g',
    description: 'Tangy and spicy green lime pickle matured in sesame oil and mustard seeds. A mouthwatering companion to rice and curry.',
    shortDescription: 'Traditional spicy tangy green lime pickle.',
    price: 2.85,
    originalPrice: 3.20,
    categorySlug: 'pickles-sauces',
    categoryName: 'Pickles & Sauces',
    images: [
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
    ],
    stock: 20,
    sku: 'PCK-LME-400',
    tags: ['pickle', 'lime', 'spicy', 'jar'],
    featured: false,
    bestSeller: false,
    onSale: true,
    active: true,
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await connectToDatabase();

    console.log('Clearing existing data...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Settings.deleteMany({});
    await User.deleteMany({});

    console.log('Seeding categories...');
    const createdCategories = await Category.insertMany(SAMPLE_CATEGORIES);
    const categoryMap: { [key: string]: string } = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id.toString();
    });

    console.log('Seeding products...');
    const productsToInsert = SAMPLE_PRODUCTS.map((prod) => ({
      name: prod.name,
      slug: prod.slug,
      description: prod.description,
      shortDescription: prod.shortDescription,
      price: prod.price,
      originalPrice: prod.originalPrice,
      categoryId: categoryMap[prod.categorySlug] || createdCategories[0]._id.toString(),
      categoryName: prod.categoryName,
      images: prod.images,
      cloudinaryPublicIds: [],
      stock: prod.stock,
      sku: prod.sku,
      tags: prod.tags,
      featured: prod.featured,
      bestSeller: prod.bestSeller,
      onSale: prod.onSale,
      active: prod.active,
    }));

    await Product.insertMany(productsToInsert);

    console.log('Seeding default store settings...');
    await Settings.create({
      storeName: 'Sithisha Masala&snacks',
      address: '120 Parsons Hill, Birmingham, B30 3QP, United Kingdom',
      phone: '+44 121 444 8899',
      email: 'info@sithisha.co.uk',
      whatsappNumber: process.env.WHATSAPP_NUMBER || '',
      deliveryFee: 3.0,
      freeDeliveryThreshold: 30.0,
      currency: 'GBP',
    });

    console.log('Seeding admin user...');
    const passwordHash = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Sithisha Admin',
      email: 'admin@sithisha.co.uk',
      passwordHash,
      role: 'admin',
    });

    console.log('✅ Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
