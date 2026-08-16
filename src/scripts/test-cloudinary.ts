import dotenv from 'dotenv';
import path from 'path';
import { uploadImageToCloudinary } from '../lib/cloudinary';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testUpload() {
  const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  console.log('Testing Cloudinary upload for account:', process.env.CLOUDINARY_CLOUD_NAME);

  try {
    const result = await uploadImageToCloudinary(sampleBase64);
    console.log('✅ Cloudinary upload successful!');
    console.log('Cloudinary Image URL:', result.url);
    console.log('Cloudinary Public ID:', result.publicId);
  } catch (err) {
    console.error('❌ Upload error:', err);
  }
}

testUpload();
