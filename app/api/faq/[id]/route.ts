import { connectDB } from '@/lib/mongodb';
import FAQ from '@/lib/models/FAQ';
import { apiSuccess, apiError, requireAdmin } from '@/lib/api';
import { faqSchema } from '@/lib/validations';

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await connectDB();
    const faq = await FAQ.findById(params.id).lean();
    if (!faq) return apiError('FAQ not found', 404);
    return apiSuccess(faq);
  } catch (error) {
    return apiError('Failed to fetch FAQ', 500);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = faqSchema.partial().safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid data');

    await connectDB();
    const faq = await FAQ.findByIdAndUpdate(params.id, { $set: parsed.data }, { new: true }).lean();
    if (!faq) return apiError('FAQ not found', 404);
    return apiSuccess(faq);
  } catch (error) {
    return apiError('Failed to update FAQ', 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    await connectDB();
    const faq = await FAQ.findByIdAndDelete(params.id).lean();
    if (!faq) return apiError('FAQ not found', 404);
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError('Failed to delete FAQ', 500);
  }
}
