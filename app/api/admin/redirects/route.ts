import { connectDB } from '@/lib/mongodb';
import { Redirect } from '@/lib/models';
import { apiSuccess, apiError, requirePermission } from '@/lib/api';
import { redirectSchema } from '@/lib/validations';

export async function GET() {
  try {
    const session = await requirePermission('manage_redirects');
    if (!session) return apiError('Forbidden', 403);

    await connectDB();
    const items = await Redirect.find().sort({ createdAt: -1 }).lean();
    return apiSuccess(items);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission('manage_redirects');
    if (!session) return apiError('Forbidden', 403);

    const body = await request.json();
    const parsed = redirectSchema.parse(body);

    await connectDB();
    
    // Normalize paths
    if (!parsed.source.startsWith('/')) {
      parsed.source = '/' + parsed.source;
    }
    if (!parsed.destination.startsWith('/') && !parsed.destination.startsWith('http')) {
      parsed.destination = '/' + parsed.destination;
    }

    const existing = await Redirect.findOne({ source: parsed.source });
    if (existing) {
      return apiError('A redirect for this source path already exists', 400);
    }

    const item = await Redirect.create(parsed);
    return apiSuccess(item, 201);
  } catch (error) {
    return apiError(error);
  }
}
