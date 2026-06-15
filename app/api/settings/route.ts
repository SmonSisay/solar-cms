import { connectDB } from '@/lib/mongodb';
import SiteSettings from '@/lib/models/SiteSettings';
import { apiSuccess, apiError, requireAdmin } from '@/lib/api';
import { siteSettingsSchema } from '@/lib/validations';

export async function GET() {
  try {
    await connectDB();
    let settings = await SiteSettings.findOne().lean();

    if (!settings) {
      settings = await SiteSettings.create({ businessName: 'Smon' });
    }

    return apiSuccess(settings);
  } catch (error) {
    console.error('GET /api/settings:', error);
    return apiError('Failed to fetch settings', 500);
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = siteSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? 'Invalid data');
    }

    await connectDB();

    const settings = await SiteSettings.findOneAndUpdate(
      {},
      { $set: parsed.data },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    return apiSuccess(settings);
  } catch (error) {
    console.error('PUT /api/settings:', error);
    return apiError('Failed to update settings', 500);
  }
}
