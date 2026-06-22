import { connectDB } from '@/lib/mongodb';
import { Product, BlogPost, Service } from '@/lib/models';
import { apiSuccess, apiError } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim();

    if (!q || q.length < 2) {
      return apiSuccess({ products: [], blogs: [], services: [] });
    }

    await connectDB();

    // Escape regex special characters
    const safeQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const [products, blogs, services] = await Promise.all([
      Product.find({
        deletedAt: null,
        $or: [
          { 'name.en': { $regex: safeQuery, $options: 'i' } },
          { 'name.am': { $regex: safeQuery, $options: 'i' } },
          { 'shortDescription.en': { $regex: safeQuery, $options: 'i' } },
          { category: { $regex: safeQuery, $options: 'i' } },
          { brand: { $regex: safeQuery, $options: 'i' } },
        ],
      })
        .select('name slug category images')
        .limit(6)
        .lean(),

      BlogPost.find({
        deletedAt: null,
        published: true,
        $or: [
          { 'title.en': { $regex: safeQuery, $options: 'i' } },
          { 'title.am': { $regex: safeQuery, $options: 'i' } },
          { 'excerpt.en': { $regex: safeQuery, $options: 'i' } },
          { category: { $regex: safeQuery, $options: 'i' } },
        ],
      })
        .select('title slug excerpt coverImage category')
        .limit(6)
        .lean(),

      Service.find({
        deletedAt: null,
        $or: [
          { 'title.en': { $regex: safeQuery, $options: 'i' } },
          { 'title.am': { $regex: safeQuery, $options: 'i' } },
          { 'description.en': { $regex: safeQuery, $options: 'i' } },
        ],
      })
        .select('title description icon')
        .limit(6)
        .lean(),
    ]);

    return apiSuccess({ products, blogs, services });
  } catch (error) {
    console.error('GET /api/search:', error);
    return apiError('Search failed', 500);
  }
}
