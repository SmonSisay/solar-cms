import { connectDB } from '@/lib/mongodb';
import SiteSettings from '@/lib/models/SiteSettings';
import SettingsForm from '@/components/admin/SettingsForm';
import type { BilingualText } from '@/lib/types';

import { requireSuperAdmin } from '@/lib/api';

const emptyBilingual = (): BilingualText => ({ en: '', am: '' });

export default async function AdminSettingsPage() {
  const allowed = await requireSuperAdmin();
  if (!allowed) {
    return (
      <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-components text-sm">
        Access Denied: You do not have the required permissions to view this page.
      </div>
    );
  }

  await connectDB();

  let settings = await SiteSettings.findOne().lean();

  if (!settings) {
    settings = await SiteSettings.create({ businessName: 'Smon' });
  }

  const initial = {
    businessName: settings.businessName ?? 'Smon',
    tagline: settings.tagline ?? emptyBilingual(),
    phone: settings.phone ?? [],
    whatsapp: settings.whatsapp ?? '',
    email: settings.email ?? '',
    address: settings.address ?? emptyBilingual(),
    mapEmbedUrl: settings.mapEmbedUrl ?? '',
    workingHours: settings.workingHours ?? emptyBilingual(),
    logo: settings.logo ?? '',
    heroTitle: settings.heroTitle ?? emptyBilingual(),
    heroSubtitle: settings.heroSubtitle ?? emptyBilingual(),
    heroCTAText: settings.heroCTAText ?? emptyBilingual(),
    heroImage: settings.heroImage ?? '',
    stats: settings.stats ?? [],
    whyUsPoints: settings.whyUsPoints ?? [],
    socialLinks: settings.socialLinks ?? {
      facebook: '',
      instagram: '',
      telegram: '',
      youtube: '',
      tiktok: '',
      linkedin: '',
    },
    metaDescription: settings.metaDescription ?? emptyBilingual(),
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Site Settings</h2>
        <p className="text-slate-500 text-sm mt-1">
          Manage business info, hero section, and contact details.
        </p>
      </div>
      <SettingsForm initial={JSON.parse(JSON.stringify(initial))} />
    </div>
  );
}
