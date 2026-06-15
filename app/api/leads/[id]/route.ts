import { connectDB } from '@/lib/mongodb';
import QuoteLead from '@/lib/models/QuoteLead';
import { apiSuccess, apiError, requireAdmin } from '@/lib/api';
import { leadUpdateSchema } from '@/lib/validations';

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    const { id } = params;
    await connectDB();

    const lead = await QuoteLead.findById(id).lean();
    if (!lead) return apiError('Lead not found', 404);

    return apiSuccess(lead);
  } catch (error) {
    console.error('GET /api/leads/[id]:', error);
    return apiError('Failed to fetch lead', 500);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    const { id } = params;
    const body = await request.json();
    const parsed = leadUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? 'Invalid data');
    }

    await connectDB();

    const lead = await QuoteLead.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true, runValidators: true }
    ).lean();

    if (!lead) return apiError('Lead not found', 404);

    return apiSuccess(lead);
  } catch (error) {
    console.error('PUT /api/leads/[id]:', error);
    return apiError('Failed to update lead', 500);
  }
}
