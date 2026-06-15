import { connectDB } from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { apiSuccess, apiError, requireAdmin } from '@/lib/api';
import { productSchema } from '@/lib/validations';

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { id } = params;
    await connectDB();

    const product = await Product.findById(id).lean();
    if (!product) return apiError('Product not found', 404);

    return apiSuccess(product);
  } catch (error) {
    console.error('GET /api/products/[id]:', error);
    return apiError('Failed to fetch product', 500);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    const { id } = params;
    const body = await request.json();
    const parsed = productSchema.partial().safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? 'Invalid data');
    }

    await connectDB();

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true, runValidators: true }
    ).lean();

    if (!product) return apiError('Product not found', 404);

    return apiSuccess(product);
  } catch (error) {
    console.error('PUT /api/products/[id]:', error);
    return apiError('Failed to update product', 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    const { id } = params;
    await connectDB();

    const product = await Product.findByIdAndDelete(id).lean();
    if (!product) return apiError('Product not found', 404);

    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error('DELETE /api/products/[id]:', error);
    return apiError('Failed to delete product', 500);
  }
}
