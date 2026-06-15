import { connectDB } from '@/lib/mongodb';
import TeamMember from '@/lib/models/TeamMember';
import { apiSuccess, apiError, requireAdmin } from '@/lib/api';
import { teamMemberSchema } from '@/lib/validations';

export async function GET() {
  try {
    await connectDB();
    const members = await TeamMember.find().sort({ order: 1 }).lean();
    return apiSuccess(members);
  } catch (error) {
    return apiError('Failed to fetch team', 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = teamMemberSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid data');

    await connectDB();
    const member = await TeamMember.create(parsed.data);
    return apiSuccess(member, 201);
  } catch (error) {
    return apiError('Failed to create team member', 500);
  }
}
