import mongoose, { Schema, type Document, type Model } from 'mongoose';
import { bilingualSchema } from './shared';
import type { BilingualText } from '@/lib/types';

export interface IProject extends Document {
  name: BilingualText;
  slug: string;
  clientName: string;
  location: BilingualText;
  capacity: string;
  description: BilingualText;
  completionDate?: Date;
  images: string[];
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: bilingualSchema, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    clientName: { type: String, default: '' },
    location: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    capacity: { type: String, default: '' },
    description: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    completionDate: { type: Date },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Project: Model<IProject> =
  mongoose.models.Project ?? mongoose.model<IProject>('Project', projectSchema);

export default Project;
