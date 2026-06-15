import { connectDB } from '@/lib/mongodb';
import Service from '@/lib/models/Service';
import { apiSuccess, apiError, requireAdmin } from '@/lib/api';
import { serviceSchema } from '@/lib/validations';

export async function GET() {
  try {
    await connectDB();
    const services = await Service.find().sort({ order: 1 }).lean();
    return apiSuccess(services);
  } catch (error) {
    return apiError('Failed to fetch services', 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = serviceSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid data');

    await connectDB();
    const service = await Service.create(parsed.data);
    return apiSuccess(service, 201);
  } catch (error) {
    return apiError('Failed to create service', 500);
  }
}
