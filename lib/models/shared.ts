import { Schema } from 'mongoose';
import type { BilingualText } from '@/lib/types';

export const bilingualSchema = new Schema<BilingualText>(
  {
    en: { type: String, required: true, default: '' },
    am: { type: String, default: '' },
  },
  { _id: false }
);
