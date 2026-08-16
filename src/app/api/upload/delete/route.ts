import { NextRequest, NextResponse } from 'next/server';
import { deleteImageFromCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { publicId } = await req.json();
    if (!publicId) {
      return NextResponse.json({ success: false, message: 'No publicId provided' }, { status: 400 });
    }
    const deleted = await deleteImageFromCloudinary(publicId);
    return NextResponse.json({ success: true, deleted });
  } catch (error: any) {
    console.error('Cloudinary deletion endpoint error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
