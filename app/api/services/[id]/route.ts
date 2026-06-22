import { connectDB } from '@/lib/mongodb';
import Service from '@/lib/models/Service';
import { apiSuccess, apiError, requirePermission } from '@/lib/api';
import { serviceSchema } from '@/lib/validations';
import { NotFoundError } from '@/lib/errors';

type RouteContext = { params: { id: string } };

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const session = await requirePermission('manage_services');
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = serviceSchema.partial().parse(body);

    await connectDB();
    const service = await Service.findByIdAndUpdate(params.id, { $set: parsed }, { new: true }).lean();
    if (!service) throw new NotFoundError('Service not found');
    return apiSuccess(service);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const session = await requirePermission('manage_services');
    if (!session) return apiError('Unauthorized', 401);

    await connectDB();
    const service = await Service.findByIdAndDelete(params.id).lean();
    if (!service) throw new NotFoundError('Service not found');
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError(error);
  }
}
