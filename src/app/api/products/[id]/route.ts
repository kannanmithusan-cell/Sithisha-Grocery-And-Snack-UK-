import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Product from '@/models/Product';
import { deleteImageFromCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const product = await Product.findOne({
      $or: [{ _id: id }, { slug: id }],
    }).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('API /api/products/[id] GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    const { images = [] } = body;

    // Enforce strict 4 image limit backend check
    if (Array.isArray(images) && images.length > 4) {
      return NextResponse.json(
        { success: false, message: 'Maximum 4 images are allowed per product.' },
        { status: 400 }
      );
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Clean up removed Cloudinary images if public IDs changed
    if (body.cloudinaryPublicIds && Array.isArray(body.cloudinaryPublicIds)) {
      const existingPublicIds: string[] = existingProduct.cloudinaryPublicIds || [];
      const removedPublicIds = existingPublicIds.filter(
        (publicId: string) => !body.cloudinaryPublicIds.includes(publicId)
      );
      for (const pid of removedPublicIds) {
        await deleteImageFromCloudinary(pid);
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error('API /api/products/[id] PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete associated Cloudinary images
    if (product.cloudinaryPublicIds && product.cloudinaryPublicIds.length > 0) {
      for (const publicId of product.cloudinaryPublicIds) {
        await deleteImageFromCloudinary(publicId);
      }
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('API /api/products/[id] DELETE error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
