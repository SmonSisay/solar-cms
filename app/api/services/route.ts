import { connectDB } from '@/lib/mongodb';
import Service from '@/lib/models/Service';
import { apiSuccess, apiError, requirePermission } from '@/lib/api';
import { serviceSchema } from '@/lib/validations';

export async function GET() {
  try {
    await connectDB();
    const services = await Service.find().sort({ order: 1 }).lean();
    return apiSuccess(services);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission('manage_services');
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = serviceSchema.parse(body);

    await connectDB();
    const service = await Service.create(parsed);
    return apiSuccess(service, 201);
  } catch (error) {
    return apiError(error);
  }
}
