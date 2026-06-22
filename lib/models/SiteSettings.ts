import mongoose, { Schema, type Document, type Model } from 'mongoose';
import { bilingualSchema } from './shared';
import type { BilingualText } from '@/lib/types';

export interface ISiteSettings extends Document {
  businessName: string;
  tagline: BilingualText;
  phone: string[];
  whatsapp: string;
  email: string;
  address: BilingualText;
  mapEmbedUrl: string;
  workingHours: BilingualText;
  logo: string;
  favicon: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    telegram: string;
    youtube: string;
    tiktok: string;
    linkedin: string;
  };
  heroTitle: BilingualText;
  heroSubtitle: BilingualText;
  heroCTAText: BilingualText;
  heroImage: string;
  stats: Array<{ label: BilingualText; value: string }>;
  whyUsPoints: Array<{ title: BilingualText; desc: BilingualText; icon: string }>;
  certifications: Array<{ name: string; logo: string }>;
  partnerLogos: string[];
  metaDescription: BilingualText;
  homeSections: Array<{ name: string; enabled: boolean; order: number }>;
}

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    businessName: { type: String, default: 'Smon' },
    tagline: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    phone: { type: [String], default: [] },
    whatsapp: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    mapEmbedUrl: { type: String, default: '' },
    workingHours: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      telegram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      tiktok: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    heroTitle: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    heroSubtitle: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    heroCTAText: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    heroImage: { type: String, default: '' },
    stats: {
      type: [
        {
          label: bilingualSchema,
          value: String,
        },
      ],
      default: [],
    },
    whyUsPoints: {
      type: [
        {
          title: bilingualSchema,
          desc: bilingualSchema,
          icon: String,
        },
      ],
      default: [],
    },
    certifications: {
      type: [{ name: String, logo: String }],
      default: [],
    },
    partnerLogos: { type: [String], default: [] },
    metaDescription: { type: bilingualSchema, default: () => ({ en: '', am: '' }) },
    homeSections: {
      type: [
        {
          name: String,
          enabled: Boolean,
          order: Number,
        },
      ],
      default: [
        { name: 'hero', enabled: true, order: 0 },
        { name: 'stats', enabled: true, order: 1 },
        { name: 'products', enabled: true, order: 2 },
        { name: 'whyus', enabled: true, order: 3 },
      ],
    },
  },
  { timestamps: true }
);

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ??
  mongoose.model<ISiteSettings>('SiteSettings', siteSettingsSchema);

export default SiteSettings;
