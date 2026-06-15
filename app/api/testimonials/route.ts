import { connectDB } from '@/lib/mongodb';
import Testimonial from '@/lib/models/Testimonial';
import { apiSuccess, apiError, requireAdmin } from '@/lib/api';
import { testimonialSchema } from '@/lib/validations';

export async function GET() {
  try {
    await connectDB();
    const items = await Testimonial.find().sort({ order: 1 }).lean();
    return apiSuccess(items);
  } catch (error) {
    return apiError('Failed to fetch testimonials', 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = testimonialSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid data');

    await connectDB();
    const item = await Testimonial.create(parsed.data);
    return apiSuccess(item, 201);
  } catch (error) {
    return apiError('Failed to create testimonial', 500);
  }
}
