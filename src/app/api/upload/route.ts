import { NextRequest, NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let imageBase64 = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, message: 'No file provided in form data' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimeType = file.type || 'image/jpeg';
      imageBase64 = `data:${mimeType};base64,${buffer.toString('base64')}`;
    } else {
      const body = await req.json();
      imageBase64 = body.imageBase64 || body.file || '';
    }

    if (!imageBase64) {
      return NextResponse.json(
        { success: false, message: 'No image payload provided' },
        { status: 400 }
      );
    }

    const { url, publicId } = await uploadImageToCloudinary(imageBase64);

    return NextResponse.json({
      success: true,
      url,
      publicId,
      public_id: publicId,
      data: { url, publicId },
    });
  } catch (error: any) {
    console.error('API /api/upload error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
