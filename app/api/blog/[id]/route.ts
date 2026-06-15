import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
import { apiSuccess, apiError, requireAdmin } from '@/lib/api';
import { blogPostSchema } from '@/lib/validations';

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await connectDB();
    const post = await BlogPost.findById(params.id).lean();
    if (!post) return apiError('Post not found', 404);
    return apiSuccess(post);
  } catch (error) {
    return apiError('Failed to fetch post', 500);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = blogPostSchema.partial().safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid data');

    await connectDB();
    const data = { ...parsed.data };
    if (data.published && !data.publishedAt) {
      data.publishedAt = new Date().toISOString();
    }

    const post = await BlogPost.findByIdAndUpdate(params.id, { $set: data }, { new: true }).lean();
    if (!post) return apiError('Post not found', 404);
    return apiSuccess(post);
  } catch (error) {
    return apiError('Failed to update post', 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    await connectDB();
    const post = await BlogPost.findByIdAndDelete(params.id).lean();
    if (!post) return apiError('Post not found', 404);
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError('Failed to delete post', 500);
  }
}
