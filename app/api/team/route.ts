import { connectDB } from '@/lib/mongodb';
import TeamMember from '@/lib/models/TeamMember';
import { apiSuccess, apiError, requirePermission } from '@/lib/api';
import { teamMemberSchema } from '@/lib/validations';

export async function GET() {
  try {
    await connectDB();
    const members = await TeamMember.find().sort({ order: 1 }).lean();
    return apiSuccess(members);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission('manage_team');
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = teamMemberSchema.parse(body);

    await connectDB();
    const member = await TeamMember.create(parsed);
    return apiSuccess(member, 201);
  } catch (error) {
    return apiError(error);
  }
}
