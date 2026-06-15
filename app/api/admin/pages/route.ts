import { connectDB } from '@/lib/mongodb';
import { Page } from '@/lib/models';
import { apiSuccess, apiError, requireRole } from '@/lib/api';
import { pageSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';

const ALLOWED_ROLES = ['super_admin', 'admin', 'editor', 'content_manager'];

export async function GET() {
  try {
    const session = await requireRole(ALLOWED_ROLES);
    if (!session) return apiError('Forbidden', 403);

    await connectDB();
    const pages = await Page.find({ deletedAt: null }).sort({ createdAt: -1 }).lean();
    return apiSuccess(pages);
  } catch (error) {
    console.error('GET /api/admin/pages:', error);
    return apiError('Failed to fetch pages', 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireRole(ALLOWED_ROLES);
    if (!session) return apiError('Forbidden', 403);

    const body = await request.json();
    const parsed = pageSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? 'Invalid data');
    }

    await connectDB();

    const data = { ...parsed.data };
    if (!data.slug && data.title?.en) {
      data.slug = slugify(data.title.en);
    }

    if (!data.slug) {
      return apiError('Slug is required or must be generated from title');
    }

    const existing = await Page.findOne({ slug: data.slug, deletedAt: null });
    if (existing) {
      data.slug = `${data.slug}-${Date.now()}`;
    }

    const page = await Page.create(data);
    return apiSuccess(page, 201);
  } catch (error) {
    console.error('POST /api/admin/pages:', error);
    return apiError('Failed to create page', 500);
  }
}
