import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  action: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'restore' | 'publish' | 'settings_change';
  module: string;
  targetId?: string;
  targetName?: string;
  details?: string;
  ipAddress?: string;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    action: {
      type: String,
      enum: ['login', 'logout', 'create', 'update', 'delete', 'restore', 'publish', 'settings_change'],
      required: true,
      index: true,
    },
    module: { type: String, required: true, index: true },
    targetId: { type: String, default: '' },
    targetName: { type: String, default: '' },
    details: { type: String, default: '' },
    ipAddress: { type: String, default: '' },
  },
  { timestamps: true }
);

// TTL: auto-delete logs older than 90 days
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog ?? mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);

export default ActivityLog;
