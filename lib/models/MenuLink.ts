import mongoose, { Schema, type Document, type Model } from 'mongoose';
import { bilingualSchema } from './shared';
import type { BilingualText } from '@/lib/types';

export interface IMenuLink extends Document {
  label: BilingualText;
  url: string;
  location: 'header' | 'footer';
  order: number;
  published: boolean;
  parentId?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const menuLinkSchema = new Schema<IMenuLink>(
  {
    label: { type: bilingualSchema, required: true },
    url: { type: String, required: true },
    location: {
      type: String,
      enum: ['header', 'footer'],
      required: true,
      index: true,
    },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true, index: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'MenuLink', default: null },
  },
  { timestamps: true }
);

const MenuLink: Model<IMenuLink> =
  mongoose.models.MenuLink ?? mongoose.model<IMenuLink>('MenuLink', menuLinkSchema);

export default MenuLink;
