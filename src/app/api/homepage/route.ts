import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import HomepageConfig from '@/models/HomepageConfig';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    let config = await HomepageConfig.findOne().lean();

    if (!config) {
      config = await HomepageConfig.create({
        heroImages: [],
        editorialImages: [],
        ctaImage: { url: '', publicId: '', active: true },
      });
    }

    const configJson = JSON.parse(JSON.stringify(config));
    const sanitizedStr = JSON.stringify(configJson)
      .replace(/grocery store/gi, 'masala & snack store')
      .replace(/groceries/gi, 'masalas')
      .replace(/grocery/gi, 'masala')
      .replace(/GROCERIES/g, 'MASALAS')
      .replace(/GROCERY/g, 'MASALA');

    return NextResponse.json({ success: true, config: JSON.parse(sanitizedStr) });
  } catch (error: any) {
    console.error('Error fetching homepage config:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    let config = await HomepageConfig.findOne();

    if (!config) {
      config = new HomepageConfig(body);
    } else {
      if (body.heroImages !== undefined) config.heroImages = body.heroImages;
      if (body.editorialImages !== undefined) config.editorialImages = body.editorialImages;
      if (body.ctaImage !== undefined) config.ctaImage = body.ctaImage;
    }

    await config.save();

    return NextResponse.json({
      success: true,
      message: 'Homepage configuration updated successfully',
      config: JSON.parse(JSON.stringify(config)),
    });
  } catch (error: any) {
    console.error('Error updating homepage config:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
