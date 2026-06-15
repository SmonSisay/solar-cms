import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IRateLimit extends Document {
  key: string;
  count: number;
  windowStart: Date;
}

const rateLimitSchema = new Schema<IRateLimit>({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 1 },
  windowStart: { type: Date, default: Date.now },
});

rateLimitSchema.index({ key: 1 }, { unique: true });
rateLimitSchema.index({ windowStart: 1 }, { expireAfterSeconds: 3600 }); // Expire after 1 hour

const RateLimit: Model<IRateLimit> =
  mongoose.models.RateLimit ?? mongoose.model<IRateLimit>('RateLimit', rateLimitSchema);

export default RateLimit;

