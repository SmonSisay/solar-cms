import { connectDB } from '@/lib/mongodb';
import FAQ from '@/lib/models/FAQ';
import { apiSuccess, apiError, requirePermission } from '@/lib/api';
import { faqSchema } from '@/lib/validations';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');

    const filter: Record<string, unknown> = {};
    if (published === 'true') filter.published = true;

    const faqs = await FAQ.find(filter).sort({ order: 1 }).lean();
    return apiSuccess(faqs);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission('manage_faq');
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = faqSchema.parse(body);

    await connectDB();
    const faq = await FAQ.create(parsed);
    return apiSuccess(faq, 201);
  } catch (error) {
    return apiError(error);
  }
}
