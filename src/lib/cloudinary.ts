import { v2 as cloudinary } from 'cloudinary';

export async function uploadImageToCloudinary(
  fileBase64: string,
  folder = 'sithisha-products'
): Promise<{ url: string; publicId: string }> {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret && apiKey !== '123456789012345') {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });

      const result = await cloudinary.uploader.upload(fileBase64, {
        folder,
        transformation: [
          { width: 800, height: 800, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
        ],
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }
  } catch (error) {
    console.warn('Cloudinary upload warning (using base64 fallback):', error);
  }

  // Fallback to image base64 data URL if Cloudinary credentials are not set
  return {
    url: fileBase64,
    publicId: '',
  };
}

export async function deleteImageFromCloudinary(publicId: string): Promise<boolean> {
  if (!publicId) return false;
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    }
    return false;
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    return false;
  }
}

export default cloudinary;
