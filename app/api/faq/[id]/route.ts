import { connectDB } from '@/lib/mongodb';
import FAQ from '@/lib/models/FAQ';
import { apiSuccess, apiError, requirePermission } from '@/lib/api';
import { faqSchema } from '@/lib/validations';
import { NotFoundError } from '@/lib/errors';

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    await connectDB();
    const faq = await FAQ.findById(params.id).lean();
    if (!faq) throw new NotFoundError('FAQ not found');
    return apiSuccess(faq);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const session = await requirePermission('manage_faq');
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = faqSchema.partial().parse(body);

    await connectDB();
    const faq = await FAQ.findByIdAndUpdate(params.id, { $set: parsed }, { new: true }).lean();
    if (!faq) throw new NotFoundError('FAQ not found');
    return apiSuccess(faq);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const session = await requirePermission('manage_faq');
    if (!session) return apiError('Unauthorized', 401);

    await connectDB();
    const faq = await FAQ.findByIdAndDelete(params.id).lean();
    if (!faq) throw new NotFoundError('FAQ not found');
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError(error);
  }
}
