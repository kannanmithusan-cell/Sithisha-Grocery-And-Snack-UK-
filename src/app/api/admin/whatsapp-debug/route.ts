import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Settings from '@/models/Settings';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sithisha-super-secret-jwt-key-birmingham-2026';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Admin-only: verify JWT token
    const token = req.cookies.get('sithisha_admin_token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();
    const settings = await Settings.findOne().lean();

    if (!settings) {
      return NextResponse.json({
        success: true,
        debug: {
          found: false,
          message: 'No settings document exists in this database',
          mongoUri: process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@') : 'NOT SET',
          environment: process.env.NODE_ENV || 'unknown',
        }
      });
    }

    const wa = (settings as { whatsappNumber?: string }).whatsappNumber || '';
    const phone = (settings as { phone?: string }).phone || '';

    return NextResponse.json({
      success: true,
      debug: {
        found: true,
        environment: process.env.NODE_ENV || 'unknown',
        mongoUri: process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@') : 'NOT SET',
        whatsappNumber: wa ? `${'*'.repeat(Math.max(0, wa.length - 4))}${wa.slice(-4)}` : '(empty)',
        whatsappNumberFull: wa, // Remove this after debugging!
        phone: phone ? `${'*'.repeat(Math.max(0, phone.length - 4))}${phone.slice(-4)}` : '(empty)',
        generatedUrl: wa ? `https://wa.me/${wa.replace(/\D/g, '')}` : '(no number)',
        settingsId: (settings as { _id: unknown })._id?.toString(),
      }
    });
  } catch (error) {
    console.error('Whatsapp debug error:', error);
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}

/**
 * POST: Force-update the production WhatsApp number directly
 * Body: { whatsappNumber: "447XXXXXXXXX", secret: "ADMIN_OVERRIDE" }
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('sithisha_admin_token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { whatsappNumber } = body;

    if (!whatsappNumber) {
      return NextResponse.json({ success: false, message: 'whatsappNumber is required' }, { status: 400 });
    }

    const cleanNumber = whatsappNumber.trim().replace(/[^0-9+]/g, '');
    if (cleanNumber.length < 10) {
      return NextResponse.json({ success: false, message: 'Invalid phone number' }, { status: 400 });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({
        storeName: 'Sithisha Masala&snacks',
        address: '120 Parsons Hill, Birmingham, B30 3QP, United Kingdom',
        phone: cleanNumber,
        email: 'info@sithisha.co.uk',
        whatsappNumber: cleanNumber,
        deliveryFee: 3.0,
        freeDeliveryThreshold: 30.0,
        currency: 'GBP',
      });
    } else {
      settings.whatsappNumber = cleanNumber;
    }

    await settings.save();

    return NextResponse.json({
      success: true,
      message: 'WhatsApp number updated in production database',
      whatsappNumber: cleanNumber,
      generatedUrl: `https://wa.me/${cleanNumber.replace(/\D/g, '')}`,
    });
  } catch (error) {
    console.error('Whatsapp debug POST error:', error);
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}
