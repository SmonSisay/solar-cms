import mongoose, { Schema, type Document, type Model } from 'mongoose';
import type { LeadStatus } from '@/lib/types';

export interface IQuoteLead extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  productRef: string;
  source: string;
  status: LeadStatus;
  adminNote: string;
  createdAt: Date;
}

const quoteLeadSchema = new Schema<IQuoteLead>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, default: '' },
    productRef: { type: String, default: '' },
    source: { type: String, default: 'quote' },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
    },
    adminNote: { type: String, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

quoteLeadSchema.index({ status: 1, createdAt: -1 });

const QuoteLead: Model<IQuoteLead> =
  mongoose.models.QuoteLead ?? mongoose.model<IQuoteLead>('QuoteLead', quoteLeadSchema);

export default QuoteLead;
