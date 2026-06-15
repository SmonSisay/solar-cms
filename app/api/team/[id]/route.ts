import { connectDB } from '@/lib/mongodb';
import TeamMember from '@/lib/models/TeamMember';
import { apiSuccess, apiError, requireAdmin } from '@/lib/api';
import { teamMemberSchema } from '@/lib/validations';

type RouteContext = { params: { id: string } };

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = teamMemberSchema.partial().safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid data');

    await connectDB();
    const member = await TeamMember.findByIdAndUpdate(params.id, { $set: parsed.data }, { new: true }).lean();
    if (!member) return apiError('Team member not found', 404);
    return apiSuccess(member);
  } catch (error) {
    return apiError('Failed to update team member', 500);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    await connectDB();
    const member = await TeamMember.findByIdAndDelete(params.id).lean();
    if (!member) return apiError('Team member not found', 404);
    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError('Failed to delete team member', 500);
  }
}
