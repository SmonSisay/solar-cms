import { connectDB } from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { apiSuccess, apiError, requireAdmin } from '@/lib/api';
import { productSchema } from '@/lib/validations';
import { slugify, escapeRegex } from '@/lib/utils';
import type { ProductCategory } from '@/lib/types';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const inStock = searchParams.get('inStock');

    const filter: Record<string, unknown> = {};

    if (category && category !== 'all') {
      filter.category = category as ProductCategory;
    }
    if (featured === 'true') {
      filter.featured = true;
    }
    if (inStock === 'true') {
      filter.inStock = true;
    }
    if (search) {
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { 'name.en': { $regex: safeSearch, $options: 'i' } },
        { 'name.am': { $regex: safeSearch, $options: 'i' } },
        { brand: { $regex: safeSearch, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
    return apiSuccess(products);
  } catch (error) {
    console.error('GET /api/products:', error);
    return apiError('Failed to fetch products', 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? 'Invalid data');
    }

    await connectDB();

    const data = { ...parsed.data };
    if (!data.slug) {
      data.slug = slugify(data.name.en);
    }

    const existing = await Product.findOne({ slug: data.slug });
    if (existing) {
      data.slug = `${data.slug}-${Date.now()}`;
    }

    const product = await Product.create(data);
    return apiSuccess(product, 201);
  } catch (error) {
    console.error('POST /api/products:', error);
    return apiError('Failed to create product', 500);
  }
}
