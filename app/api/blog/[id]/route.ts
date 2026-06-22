import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
import { apiSuccess, apiError, requirePermission } from '@/lib/api';
import { blogPostSchema } from '@/lib/validations';
import { NotFoundError } from '@/lib/errors';

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await connectDB();
    const post = await BlogPost.findById(params.id).lean();
    if (!post) throw new NotFoundError('Post not found');
    return apiSuccess(post);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const session = await requirePermission('manage_blog');
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = blogPostSchema.partial().parse(body);

    await connectDB();
    const data = { ...parsed };
    if (data.published && !data.publishedAt) {
      data.publishedAt = new Date().toISOString();
    }

    const post = await BlogPost.findByIdAndUpdate(params.id, { $set: data }, { new: true }).lean();
    if (!post) throw new NotFoundError('Post not found');
    return apiSuccess(post);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const session = await requirePermission('manage_blog');
    if (!session) return apiError('Unauthorized', 401);

    await connectDB();
    const post = await BlogPost.findByIdAndDelete(params.id).lean();
    if (!post) throw new NotFoundError('Post not found');
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError(error);
  }
}
