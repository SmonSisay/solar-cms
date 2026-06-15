import { connectDB } from '@/lib/mongodb';
import Service from '@/lib/models/Service';
import { apiSuccess, apiError, requireAdmin } from '@/lib/api';
import { serviceSchema } from '@/lib/validations';

type RouteContext = { params: { id: string } };

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = serviceSchema.partial().safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid data');

    await connectDB();
    const service = await Service.findByIdAndUpdate(params.id, { $set: parsed.data }, { new: true }).lean();
    if (!service) return apiError('Service not found', 404);
    return apiSuccess(service);
  } catch (error) {
    return apiError('Failed to update service', 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    await connectDB();
    const service = await Service.findByIdAndDelete(params.id).lean();
    if (!service) return apiError('Service not found', 404);
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError('Failed to delete service', 500);
  }
}
