import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IMediaAsset extends Document {
  url: string;
  publicId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  folder: string;
  uploadedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const mediaAssetSchema = new Schema<IMediaAsset>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true, unique: true, index: true },
    fileName: { type: String, required: true, index: true },
    fileType: { type: String, required: true, index: true },
    fileSize: { type: Number, required: true },
    folder: { type: String, default: 'general', index: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const MediaAsset: Model<IMediaAsset> =
  mongoose.models.MediaAsset ?? mongoose.model<IMediaAsset>('MediaAsset', mediaAssetSchema);

export default MediaAsset;
