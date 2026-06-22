import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IRedirect extends Document {
  source: string;
  destination: string;
  type: 301 | 302;
  active: boolean;
  hitCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const redirectSchema = new Schema<IRedirect>(
  {
    source: { type: String, required: true, unique: true, index: true },
    destination: { type: String, required: true },
    type: { type: Number, enum: [301, 302], default: 301 },
    active: { type: Boolean, default: true, index: true },
    hitCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Redirect: Model<IRedirect> =
  mongoose.models.Redirect ?? mongoose.model<IRedirect>('Redirect', redirectSchema);

export default Redirect;
