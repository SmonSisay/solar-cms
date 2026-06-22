import { connectDB } from '@/lib/mongodb';
import QuoteLead from '@/lib/models/QuoteLead';
import { apiSuccess, apiError, requireAdmin } from '@/lib/api';
import { leadUpdateSchema } from '@/lib/validations';
import { logActivity } from '@/lib/logger';

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    const { id } = params;
    await connectDB();

    const lead = await QuoteLead.findById(id).populate('assignedUser', 'name email').lean();
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
    if (!session || !session.user) return apiError('Unauthorized', 401);

    const { id } = params;
    const body = await request.json();
    
    const parsed = leadUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? 'Invalid data');
    }

    await connectDB();

    const updateData: any = { ...parsed.data };
    const updateQuery: any = { $set: updateData };

    // Support pushing a new note if provided in request body
    if (body.newNote && typeof body.newNote === 'string') {
      updateQuery.$push = {
        notes: {
          text: body.newNote,
          author: session.user.name || session.user.email || 'Admin',
          createdAt: new Date(),
        },
      };
    }

    // Clean up empty fields or fields handled by $push
    delete updateData.notes;
    if (updateData.followUpDate === '') {
      updateData.followUpDate = null;
    }
    if (updateData.assignedUser === '' || updateData.assignedUser === 'unassigned') {
      updateData.assignedUser = null;
    }

    const lead = await QuoteLead.findByIdAndUpdate(id, updateQuery, {
      new: true,
      runValidators: true,
    }).populate('assignedUser', 'name email').lean();

    if (!lead) return apiError('Lead not found', 404);

    // Log the lead update event
    await logActivity({
      userId: session.user.id,
      userName: session.user.name || 'Admin',
      userEmail: session.user.email || '',
      action: 'update',
      module: 'leads',
      targetId: lead._id.toString(),
      targetName: lead.name,
      details: `Updated status to "${lead.status}"${body.newNote ? ' & added a new follow-up note' : ''}`,
    });

    return apiSuccess(lead);
  } catch (error) {
    console.error('PUT /api/leads/[id]:', error);
    return apiError('Failed to update lead', 500);
  }
}
