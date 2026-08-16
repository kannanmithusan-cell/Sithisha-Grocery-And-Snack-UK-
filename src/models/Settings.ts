import mongoose, { Schema, Document, Model } from 'mongoose';
import { ISettings } from '@/types';

export interface ISettingsDocument extends Omit<ISettings, '_id'>, Document {}

const SettingsSchema: Schema<ISettingsDocument> = new Schema(
  {
    storeName: { type: String, default: 'Sithisha Masala&snacks' },
    address: { type: String, default: '120 Parsons Hill, Birmingham, B30 3QP, United Kingdom' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    deliveryFee: { type: Number, default: 3.0 },
    freeDeliveryThreshold: { type: Number, default: 30.0 },
    currency: { type: String, default: 'GBP' },
  },
  {
    timestamps: true,
  }
);

const Settings: Model<ISettingsDocument> =
  mongoose.models.Settings || mongoose.model<ISettingsDocument>('Settings', SettingsSchema);

export default Settings;
