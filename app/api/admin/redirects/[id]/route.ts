import { connectDB } from '@/lib/mongodb';
import { Redirect } from '@/lib/models';
import { apiSuccess, apiError, requirePermission } from '@/lib/api';
import { redirectSchema } from '@/lib/validations';
import { NotFoundError } from '@/lib/errors';

type RouteContext = { params: { id: string } };

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const session = await requirePermission('manage_redirects');
    if (!session) return apiError('Forbidden', 403);

    const body = await request.json();
    const parsed = redirectSchema.partial().parse(body);

    // Normalize paths if provided
    if (parsed.source) {
      if (!parsed.source.startsWith('/')) {
        parsed.source = '/' + parsed.source;
      }
    }
    if (parsed.destination) {
      if (!parsed.destination.startsWith('/') && !parsed.destination.startsWith('http')) {
        parsed.destination = '/' + parsed.destination;
      }
    }

    await connectDB();
    const item = await Redirect.findByIdAndUpdate(params.id, { $set: parsed }, { new: true }).lean();
    if (!item) throw new NotFoundError('Redirect rule not found');
    return apiSuccess(item);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const session = await requirePermission('manage_redirects');
    if (!session) return apiError('Forbidden', 403);

    await connectDB();
    const item = await Redirect.findByIdAndDelete(params.id).lean();
    if (!item) throw new NotFoundError('Redirect rule not found');
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError(error);
  }
}
