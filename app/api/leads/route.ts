import { connectDB } from '@/lib/mongodb';
import QuoteLead from '@/lib/models/QuoteLead';
import { apiSuccess, apiError, requireAdmin, getClientIp } from '@/lib/api';
import { leadSchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/rate-limit';
import { sendLeadEmail } from '@/lib/resend';

export async function GET(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') ?? '50', 10);

    const filter: Record<string, string> = {};
    if (status) filter.status = status;

    const leads = await QuoteLead.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return apiSuccess(leads);
  } catch (error) {
    console.error('GET /api/leads:', error);
    return apiError('Failed to fetch leads', 500);
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed } = await checkRateLimit(`leads:${ip}`, 5);

    if (!allowed) {
      return apiError('Too many requests. Please try again later.', 429);
    }

    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return apiError(parsed.error.issues[0]?.message ?? 'Invalid data');
    }

    await connectDB();

    const lead = await QuoteLead.create(parsed.data);

    try {
      await sendLeadEmail(parsed.data);
    } catch (emailError) {
      console.error('Lead email failed:', emailError);
    }

    return apiSuccess(lead, 201);
  } catch (error) {
    console.error('POST /api/leads:', error);
    return apiError('Failed to submit quote request', 500);
  }
}
