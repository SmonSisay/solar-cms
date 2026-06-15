import mongoose, { Schema, type Document, type Model } from 'mongoose';
import { bilingualSchema } from './shared';
import type { BilingualText, ProductCategory } from '@/lib/types';
import { slugify } from '@/lib/utils';

export interface IProduct extends Document {
  name: BilingualText;
  slug: string;
  shortDescription: BilingualText;
  description: BilingualText;
  category: ProductCategory;
  subcategory: string;
  brand: string;
  price: number;
  priceOnRequest: boolean;
  images: string[];
  specs: Array<{ key: string; value: string }>;
  datasheet: string;
  inStock: boolean;
  featured: boolean;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishedAt?: Date | null;
  scheduledAt?: Date | null;
  metaDescription: BilingualText;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: bilingualSchema, required: true },
    slug: { type: String, unique: true },
    shortDescription: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    description: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    category: {
      type: String,
      enum: ['panels', 'inverters', 'batteries', 'accessories', 'systems', 'other'],
      default: 'other',
    },
    subcategory: { type: String, default: '' },
    brand: { type: String, default: '' },
    price: { type: Number, default: 0 },
    priceOnRequest: { type: Boolean, default: false },
    images: { type: [String], default: [] },
    specs: {
      type: [{ key: String, value: String }],
      default: [],
    },
    datasheet: { type: String, default: '' },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled', 'archived'],
      default: 'published',
    },
    publishedAt: { type: Date, default: null },
    scheduledAt: { type: Date, default: null },
    metaDescription: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ status: 1 });
productSchema.index({ deletedAt: 1 });

productSchema.pre('save', function () {
  if (!this.slug && this.name?.en) {
    this.slug = slugify(this.name.en);
  }
});

const Product: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>('Product', productSchema);

export default Product;
