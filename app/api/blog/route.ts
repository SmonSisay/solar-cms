import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
import { apiSuccess, apiError, requirePermission } from '@/lib/api';
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
    console.error('GET /api/blog error:', error);
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission('manage_blog');
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    // Validate with Zod; let catch block handle formatting
    const parsed = blogPostSchema.parse(body);

    await connectDB();
    const data = { ...parsed };
    if (!data.slug) data.slug = slugify(data.title.en);

    const existing = await BlogPost.findOne({ slug: data.slug });
    if (existing) data.slug = `${data.slug}-${Date.now()}`;

    if (data.published && !data.publishedAt) {
      data.publishedAt = new Date().toISOString();
    }

    const post = await BlogPost.create(data);
    return apiSuccess(post, 201);
  } catch (error) {
    console.error('POST /api/blog error:', error);
    return apiError(error);
  }
}
