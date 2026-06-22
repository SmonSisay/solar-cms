import { connectDB } from '@/lib/mongodb';
import Testimonial from '@/lib/models/Testimonial';
import { apiSuccess, apiError, requirePermission } from '@/lib/api';
import { testimonialSchema } from '@/lib/validations';
import { NotFoundError } from '@/lib/errors';

type RouteContext = { params: { id: string } };

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const session = await requirePermission('manage_testimonials');
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = testimonialSchema.partial().parse(body);

    await connectDB();
    const item = await Testimonial.findByIdAndUpdate(params.id, { $set: parsed }, { new: true }).lean();
    if (!item) throw new NotFoundError('Testimonial not found');
    return apiSuccess(item);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const session = await requirePermission('manage_testimonials');
    if (!session) return apiError('Unauthorized', 401);

    await connectDB();
    const item = await Testimonial.findByIdAndDelete(params.id).lean();
    if (!item) throw new NotFoundError('Testimonial not found');
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError(error);
  }
}
