import mongoose, { Schema, type Document, type Model } from 'mongoose';
import { bilingualSchema } from './shared';
import type { BilingualText, FAQCategory } from '@/lib/types';

export interface IFAQ extends Document {
  question: BilingualText;
  answer: BilingualText;
  category: FAQCategory;
  order: number;
  published: boolean;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
}

const faqSchema = new Schema<IFAQ>(
  {
    question: { type: bilingualSchema, required: true },
    answer: { type: bilingualSchema, required: true },
    category: {
      type: String,
      enum: ['general', 'installation', 'cost', 'warranty', 'maintenance', 'technical'],
      default: 'general',
    },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

faqSchema.index({ published: 1, order: 1 });
faqSchema.index({ deletedAt: 1 });

const FAQ: Model<IFAQ> = mongoose.models.FAQ ?? mongoose.model<IFAQ>('FAQ', faqSchema);

export default FAQ;
