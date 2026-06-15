import { connectDB } from '@/lib/mongodb';
import Testimonial from '@/lib/models/Testimonial';
import { apiSuccess, apiError, requireAdmin } from '@/lib/api';
import { testimonialSchema } from '@/lib/validations';

type RouteContext = { params: { id: string } };

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = testimonialSchema.partial().safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid data');

    await connectDB();
    const item = await Testimonial.findByIdAndUpdate(params.id, { $set: parsed.data }, { new: true }).lean();
    if (!item) return apiError('Testimonial not found', 404);
    return apiSuccess(item);
  } catch (error) {
    return apiError('Failed to update testimonial', 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    await connectDB();
    const item = await Testimonial.findByIdAndDelete(params.id).lean();
    if (!item) return apiError('Testimonial not found', 404);
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError('Failed to delete testimonial', 500);
  }
}
