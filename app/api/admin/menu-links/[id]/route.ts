import { connectDB } from '@/lib/mongodb';
import { MenuLink } from '@/lib/models';
import { apiSuccess, apiError, requirePermission } from '@/lib/api';
import { menuLinkSchema } from '@/lib/validations';
import { NotFoundError } from '@/lib/errors';

type RouteContext = { params: { id: string } };

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const session = await requirePermission('manage_menus');
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = menuLinkSchema.partial().parse(body);

    await connectDB();
    const link = await MenuLink.findByIdAndUpdate(params.id, { $set: parsed }, { new: true }).lean();
    if (!link) throw new NotFoundError('Menu link not found');
    return apiSuccess(link);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const session = await requirePermission('manage_menus');
    if (!session) return apiError('Unauthorized', 401);

    await connectDB();
    const link = await MenuLink.findByIdAndDelete(params.id).lean();
    if (!link) throw new NotFoundError('Menu link not found');
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError(error);
  }
}
