import mongoose, { Schema, type Document, type Model } from 'mongoose';
import { bilingualSchema } from './shared';
import type { BilingualText } from '@/lib/types';
import { slugify } from '@/lib/utils';

export interface IPage extends Document {
  title: BilingualText;
  slug: string;
  content: BilingualText;
  featuredImage: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishedAt?: Date | null;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  metaTitle?: BilingualText;
  metaDescription?: BilingualText;
  keywords?: BilingualText;
  createdAt: Date;
  updatedAt: Date;
}

const pageSchema = new Schema<IPage>(
  {
    title: { type: bilingualSchema, required: true },
    slug: { type: String, unique: true },
    content: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    featuredImage: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled', 'archived'],
      default: 'draft',
    },
    publishedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    metaTitle: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    metaDescription: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    keywords: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
  },
  { timestamps: true }
);

pageSchema.index({ slug: 1 }, { unique: true });
pageSchema.index({ status: 1 });
pageSchema.index({ deletedAt: 1 });

pageSchema.pre('save', function () {
  if (!this.slug && this.title?.en) {
    this.slug = slugify(this.title.en);
  }
});

const Page: Model<IPage> =
  mongoose.models.Page ?? mongoose.model<IPage>('Page', pageSchema);

export default Page;
