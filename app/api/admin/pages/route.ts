import { connectDB } from '@/lib/mongodb';
import { Page } from '@/lib/models';
import { apiSuccess, apiError, requirePermission } from '@/lib/api';
import { pageSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const session = await requirePermission('manage_pages');
    if (!session) return apiError('Forbidden', 403);

    await connectDB();
    const pages = await Page.find({ deletedAt: null }).sort({ createdAt: -1 }).lean();
    return apiSuccess(pages);
  } catch (error) {
    console.error('GET /api/admin/pages error:', error);
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission('manage_pages');
    if (!session) return apiError('Forbidden', 403);

    const body = await request.json();
    const parsed = pageSchema.parse(body);

    await connectDB();

    const data = { ...parsed };
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
    console.error('POST /api/admin/pages error:', error);
    return apiError(error);
  }
}
