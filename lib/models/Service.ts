import mongoose, { Schema, type Document, type Model } from 'mongoose';
import { bilingualSchema } from './shared';
import type { BilingualText } from '@/lib/types';

export interface IService extends Document {
  title: BilingualText;
  description: BilingualText;
  icon: string;
  features: BilingualText[];
  order: number;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishedAt?: Date | null;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
}

const serviceSchema = new Schema<IService>(
  {
    title: { type: bilingualSchema, required: true },
    description: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    icon: { type: String, default: 'sun' },
    features: { type: [bilingualSchema], default: [] },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled', 'archived'],
      default: 'published',
    },
    publishedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

serviceSchema.index({ status: 1 });
serviceSchema.index({ deletedAt: 1 });

const Service: Model<IService> =
  mongoose.models.Service ?? mongoose.model<IService>('Service', serviceSchema);

export default Service;
