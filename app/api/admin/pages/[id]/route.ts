import { connectDB } from '@/lib/mongodb';
import { Page } from '@/lib/models';
import { apiSuccess, apiError, requirePermission } from '@/lib/api';
import { pageSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';
import { NotFoundError } from '@/lib/errors';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('manage_pages');
    if (!session) return apiError('Forbidden', 403);

    const body = await request.json();
    const parsed = pageSchema.partial().parse(body);

    await connectDB();

    const page = await Page.findOne({ _id: params.id, deletedAt: null });
    if (!page) {
      throw new NotFoundError('Page not found');
    }

    const data = parsed;

    if (data.title && !data.slug && data.title.en) {
      data.slug = slugify(data.title.en);
    }

    if (data.slug && data.slug !== page.slug) {
      const existing = await Page.findOne({ slug: data.slug, deletedAt: null });
      if (existing) {
        data.slug = `${data.slug}-${Date.now()}`;
      }
    }

    Object.assign(page, data);
    await page.save();

    return apiSuccess(page);
  } catch (error) {
    console.error('PUT /api/admin/pages/[id] error:', error);
    return apiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requirePermission('manage_pages');
    if (!session) return apiError('Forbidden', 403);

    const currentUserId = (session.user as any).id;

    await connectDB();

    const page = await Page.findOne({ _id: params.id, deletedAt: null });
    if (!page) {
      throw new NotFoundError('Page not found');
    }

    // Soft delete
    page.deletedAt = new Date();
    page.deletedBy = currentUserId;
    await page.save();

    return apiSuccess({ message: 'Page soft deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/admin/pages/[id] error:', error);
    return apiError(error);
  }
}
