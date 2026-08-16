import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroImage {
  _id?: string;
  url: string;
  publicId?: string;
  badge?: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  active: boolean;
  displayOrder: number;
}

export interface IEditorialImage {
  _id?: string;
  url: string;
  publicId?: string;
  section:
    | 'todays-craving'
    | 'brand-story'
    | 'ingredient-story'
    | 'discover-new'
    | 'make-tonight'
    | 'shelves-to-home';
  title?: string;
  subtitle?: string;
  price?: number;
  link?: string;
  tag?: string;
  active: boolean;
  displayOrder: number;
}

export interface ICtaImage {
  url: string;
  publicId?: string;
  active: boolean;
}

export interface IHomepageConfig extends Document {
  heroImages: IHeroImage[];
  editorialImages: IEditorialImage[];
  ctaImage: ICtaImage;
  updatedAt: Date;
}

const HeroImageSchema = new Schema({
  url: { type: String, required: true },
  publicId: { type: String, default: '' },
  badge: { type: String, default: '' },
  title: { type: String, default: '' },
  titleHighlight: { type: String, default: '' },
  description: { type: String, default: '' },
  primaryCtaText: { type: String, default: '' },
  primaryCtaHref: { type: String, default: '' },
  active: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
});

const EditorialImageSchema = new Schema({
  url: { type: String, required: true },
  publicId: { type: String, default: '' },
  section: { type: String, required: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  price: { type: Number, default: 0 },
  link: { type: String, default: '/shop' },
  tag: { type: String, default: '' },
  active: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
});

const CtaImageSchema = new Schema({
  url: { type: String, default: '' },
  publicId: { type: String, default: '' },
  active: { type: Boolean, default: true },
});

const HomepageConfigSchema = new Schema(
  {
    heroImages: [HeroImageSchema],
    editorialImages: [EditorialImageSchema],
    ctaImage: { type: CtaImageSchema, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.HomepageConfig ||
  mongoose.model<IHomepageConfig>('HomepageConfig', HomepageConfigSchema);
