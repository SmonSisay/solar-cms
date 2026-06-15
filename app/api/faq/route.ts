import { connectDB } from '@/lib/mongodb';
import FAQ from '@/lib/models/FAQ';
import { apiSuccess, apiError, requireAdmin } from '@/lib/api';
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
    return apiError('Failed to fetch FAQs', 500);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = faqSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? 'Invalid data');

    await connectDB();
    const faq = await FAQ.create(parsed.data);
    return apiSuccess(faq, 201);
  } catch (error) {
    return apiError('Failed to create FAQ', 500);
  }
}
