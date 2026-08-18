import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Settings from '@/models/Settings';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sithisha-super-secret-jwt-key-birmingham-2026';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await Settings.findOne().lean();

    if (!settings) {
      settings = await Settings.create({
        storeName: 'Sithisha Masala&snacks',
        address: '120 Parsons Hill, Birmingham, B30 3QP, United Kingdom',
        phone: '07393139705',
        email: 'Kannanmithusan@gmail.com',
        whatsappNumber: '447393139705',
        deliveryFee: 3.0,
        freeDeliveryThreshold: 30.0,
        currency: 'GBP',
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('API /api/settings GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('sithisha_admin_token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

    if (body.whatsappNumber) {
      const waTrimmed = body.whatsappNumber.trim();
      if (!/^[0-9+\s-]{10,25}$/.test(waTrimmed)) {
        return NextResponse.json({ success: false, message: 'Please enter a valid WhatsApp number.' }, { status: 400 });
      }
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(body);
    } else {
      Object.assign(settings, body);
    }

    await settings.save();

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('API /api/settings PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
