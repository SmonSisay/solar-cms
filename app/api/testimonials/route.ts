import { connectDB } from '@/lib/mongodb';
import Testimonial from '@/lib/models/Testimonial';
import { apiSuccess, apiError, requirePermission } from '@/lib/api';
import { testimonialSchema } from '@/lib/validations';

export async function GET() {
  try {
    await connectDB();
    const items = await Testimonial.find().sort({ order: 1 }).lean();
    return apiSuccess(items);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission('manage_testimonials');
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = testimonialSchema.parse(body);

    await connectDB();
    const item = await Testimonial.create(parsed);
    return apiSuccess(item, 201);
  } catch (error) {
    return apiError(error);
  }
}
