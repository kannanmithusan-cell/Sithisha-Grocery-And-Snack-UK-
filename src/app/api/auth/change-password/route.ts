import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sithisha-super-secret-jwt-key-birmingham-2026';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('sithisha_admin_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let decodedToken: any = null;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired session. Please sign in again.' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Current password and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Find the admin user
    let user = null;
    if (decodedToken.userId) {
      user = await User.findById(decodedToken.userId);
    }
    if (!user && decodedToken.email) {
      user = await User.findOne({ email: decodedToken.email });
    }
    if (!user) {
      user = await User.findOne({ role: 'admin' });
    }

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, message: 'Admin account not found.' },
        { status: 404 }
      );
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect.' },
        { status: 400 }
      );
    }

    // Hash new password and save
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = newPasswordHash;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Admin password changed successfully!',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to change password. Please try again.' },
      { status: 500 }
    );
  }
}
