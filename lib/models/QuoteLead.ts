import mongoose, { Schema, type Document, type Model } from 'mongoose';
import type { LeadStatus } from '@/lib/types';

export interface IQuoteLeadNote {
  text: string;
  author: string;
  createdAt: Date;
}

export interface IQuoteLead extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  productRef: string;
  source: string;
  status: LeadStatus;
  adminNote: string;
  notes: IQuoteLeadNote[];
  followUpDate?: Date;
  assignedUser?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
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
      enum: ['new', 'contacted', 'qualified', 'won', 'lost'],
      default: 'new',
    },
    adminNote: { type: String, default: '' },
    notes: [
      {
        text: { type: String, required: true },
        author: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    followUpDate: { type: Date },
    assignedUser: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

quoteLeadSchema.index({ status: 1, createdAt: -1 });
quoteLeadSchema.index({ assignedUser: 1 });

const QuoteLead: Model<IQuoteLead> =
  mongoose.models.QuoteLead ?? mongoose.model<IQuoteLead>('QuoteLead', quoteLeadSchema);

export default QuoteLead;
