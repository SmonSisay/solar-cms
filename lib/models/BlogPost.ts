import mongoose, { Schema, type Document, type Model } from 'mongoose';
import { bilingualSchema } from './shared';
import type { BilingualText } from '@/lib/types';
import { slugify } from '@/lib/utils';

export interface IBlogPost extends Document {
  title: BilingualText;
  slug: string;
  excerpt: BilingualText;
  content: BilingualText;
  coverImage: string;
  category: string;
  author: string;
  tags: string[];
  seoTitle: BilingualText;
  seoDescription: BilingualText;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishedAt: Date | null;
  scheduledAt?: Date | null;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
  createdAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: bilingualSchema, required: true },
    slug: { type: String, unique: true },
    excerpt: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    content: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    coverImage: { type: String, default: '' },
    category: { type: String, default: 'general' },
    author: { type: String, default: 'Smon Team' },
    tags: { type: [String], default: [] },
    seoTitle: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    seoDescription: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled', 'archived'],
      default: 'draft',
    },
    // Keep 'published' as a virtual for backward compatibility
    publishedAt: { type: Date, default: null },
    scheduledAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ status: 1 });
blogPostSchema.index({ deletedAt: 1 });

blogPostSchema.pre('save', function () {
  if (!this.slug && this.title?.en) {
    this.slug = slugify(this.title.en);
  }
});

const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost ?? mongoose.model<IBlogPost>('BlogPost', blogPostSchema);

export default BlogPost;
