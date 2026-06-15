import mongoose, { Schema, type Document, type Model } from 'mongoose';
import { bilingualSchema } from './shared';
import type { BilingualText } from '@/lib/types';

export interface ITeamMember extends Document {
  name: string;
  role: BilingualText;
  bio: BilingualText;
  photo: string;
  order: number;
  deletedAt?: Date | null;
  deletedBy?: mongoose.Types.ObjectId | null;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true },
    role: { type: bilingualSchema, required: true },
    bio: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    photo: { type: String, default: '' },
    order: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

teamMemberSchema.index({ deletedAt: 1 });

const TeamMember: Model<ITeamMember> =
  mongoose.models.TeamMember ?? mongoose.model<ITeamMember>('TeamMember', teamMemberSchema);

export default TeamMember;
