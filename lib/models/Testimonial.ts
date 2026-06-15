import mongoose, { Schema, type Document, type Model } from 'mongoose';
import { bilingualSchema } from './shared';
import type { BilingualText } from '@/lib/types';

export interface ITestimonial extends Document {
  author: BilingualText;
  location: string;
  text: BilingualText;
  rating: number;
  avatar: string;
  featured: boolean;
  order: number;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    author: { type: bilingualSchema, required: true },
    location: { type: String, default: '' },
    text: { type: bilingualSchema, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    avatar: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

testimonialSchema.index({ deletedAt: 1 });

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ??
  mongoose.model<ITestimonial>('Testimonial', testimonialSchema);

export default Testimonial;
