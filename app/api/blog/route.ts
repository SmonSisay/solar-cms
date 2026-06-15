import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
import { apiSuccess, apiError, requireAdmin } from '@/lib/api';
import { blogPostSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const category = searchParams.get('category');

    const filter: Record<string, unknown> = {};
    if (published === 'true') filter.published = true;
    if (category) filter.category = category;

    const posts = await BlogPost.find(filter).sort({ publishedAt: -1 }).lean();
    return apiSuccess(posts);
  } catch (error) {
    console.error('GET /api/blog:', error);
    return apiError('Failed to fetch blog posts', 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = blogPostSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid data');

    await connectDB();
    const data = { ...parsed.data };
    if (!data.slug) data.slug = slugify(data.title.en);

    const existing = await BlogPost.findOne({ slug: data.slug });
    if (existing) data.slug = `${data.slug}-${Date.now()}`;

    if (data.published && !data.publishedAt) {
      data.publishedAt = new Date().toISOString();
    }

    const post = await BlogPost.create(data);
    return apiSuccess(post, 201);
  } catch (error) {
    console.error('POST /api/blog:', error);
    return apiError('Failed to create blog post', 500);
  }
}
