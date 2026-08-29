import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

async function handleReset() {
  try {
    await connectToDatabase();

    const newEmail = 'admin@sithisha';
    const newPassword = 'Sithisha@052026';
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Clean up any existing admin or matching email records
    await User.deleteMany({ role: 'admin' });
    await User.deleteMany({ email: newEmail });

    // Create new Admin User with specified credentials
    const adminUser = await User.create({
      name: 'Store Administrator',
      email: newEmail,
      passwordHash,
      role: 'admin',
    });

    return NextResponse.json({
      success: true,
      message: 'Admin credentials updated successfully!',
      credentials: {
        username: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error('Reset admin credentials error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update credentials',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return handleReset();
}

export async function POST() {
  return handleReset();
}
