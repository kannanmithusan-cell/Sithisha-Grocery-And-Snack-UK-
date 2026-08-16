import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Settings from '@/models/Settings';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const status = searchParams.get('status');
    const search = searchParams.get('search');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { postcode: { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('API /api/orders GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const {
      customerName,
      phone,
      email,
      address,
      city,
      postcode = '',
      deliveryInstructions = '',
      items = [],
    } = body;

    if (
      !customerName ||
      !phone ||
      !email ||
      !address ||
      !city ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        { success: false, message: 'Missing required order fields or items list.' },
        { status: 400 }
      );
    }

    // Get active store settings for delivery fee calculations
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        storeName: 'Sithisha Masala&snacks',
        deliveryFee: 3.0,
        freeDeliveryThreshold: 30.0,
      });
    }

    // Server-side validation of item prices & stock availability
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      let dbProduct = null;
      if (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) {
        dbProduct = await Product.findById(item.productId);
      }
      if (!dbProduct && item.productName) {
        dbProduct = await Product.findOne({ name: item.productName });
      }

      if (!dbProduct || !dbProduct.active) {
        return NextResponse.json(
          { success: false, message: `Product "${item.productName || 'Item'}" is no longer available.` },
          { status: 400 }
        );
      }

      if (dbProduct.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient stock for "${dbProduct.name}". Only ${dbProduct.stock} available.`,
          },
          { status: 400 }
        );
      }

      const itemPrice = dbProduct.price;
      const itemSubtotal = itemPrice * item.quantity;
      calculatedSubtotal += itemSubtotal;

      validatedItems.push({
        productId: dbProduct._id.toString(),
        productName: dbProduct.name,
        image: dbProduct.images[0] || '',
        quantity: item.quantity,
        price: itemPrice,
        subtotal: itemSubtotal,
      });

      // Deduct product stock
      dbProduct.stock -= item.quantity;
      await dbProduct.save();
    }

    const calculatedDeliveryFee =
      calculatedSubtotal >= settings.freeDeliveryThreshold || calculatedSubtotal === 0
        ? 0
        : settings.deliveryFee;

    const calculatedTotal = calculatedSubtotal + calculatedDeliveryFee;

    // Generate unique order reference number e.g. SITH-10245
    const count = await Order.countDocuments();
    const orderNumber = `SITH-${(10000 + count + 1).toString()}`;

    const newOrder = await Order.create({
      orderNumber,
      customerName,
      phone,
      email,
      address,
      city,
      postcode,
      deliveryInstructions,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      deliveryFee: calculatedDeliveryFee,
      total: calculatedTotal,
      status: 'Pending',
      whatsappSent: true,
    });

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error) {
    console.error('API /api/orders POST error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to create order' },
      { status: 500 }
    );
  }
}
