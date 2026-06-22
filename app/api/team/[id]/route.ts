import { connectDB } from '@/lib/mongodb';
import TeamMember from '@/lib/models/TeamMember';
import { apiSuccess, apiError, requirePermission } from '@/lib/api';
import { teamMemberSchema } from '@/lib/validations';
import { NotFoundError } from '@/lib/errors';

type RouteContext = { params: { id: string } };

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const session = await requirePermission('manage_team');
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = teamMemberSchema.partial().parse(body);

    await connectDB();
    const member = await TeamMember.findByIdAndUpdate(params.id, { $set: parsed }, { new: true }).lean();
    if (!member) throw new NotFoundError('Team member not found');
    return apiSuccess(member);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const session = await requirePermission('manage_team');
    if (!session) return apiError('Unauthorized', 401);

    await connectDB();
    const member = await TeamMember.findByIdAndDelete(params.id).lean();
    if (!member) throw new NotFoundError('Team member not found');
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError(error);
  }
}
