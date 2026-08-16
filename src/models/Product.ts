import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProduct } from '@/types';

export interface IProductDocument extends Omit<IProduct, '_id'>, Document {}

const ProductSchema: Schema<IProductDocument> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: 0 },
    categoryId: { type: String, required: true, index: true },
    categoryName: { type: String, default: '' },
    images: {
      type: [String],
      required: true,
      validate: [
        (val: string[]) => val.length <= 4,
        'Product images count cannot exceed 4 images.',
      ],
    },
    cloudinaryPublicIds: {
      type: [String],
      default: [],
      validate: [
        (val: string[]) => val.length <= 4,
        'Cloudinary public IDs count cannot exceed 4 images.',
      ],
    },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, default: '' },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false, index: true },
    bestSeller: { type: Boolean, default: false },
    onSale: { type: Boolean, default: false },
    active: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

// MongoDB text search index for name, description, category, and tags
ProductSchema.index({ name: 'text', description: 'text', categoryName: 'text', tags: 'text' });

const Product: Model<IProductDocument> =
  mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);

export default Product;
