import { connectDB } from '@/lib/mongodb';
import { Product, BlogPost, QuoteLead, FAQ } from '@/lib/models';
import { apiSuccess, apiError, requireAdmin } from '@/lib/api';

export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) return apiError('Unauthorized', 401);

    await connectDB();

    const [products, blogPosts, newLeads, faqItems, recentLeads] = await Promise.all([
      Product.countDocuments(),
      BlogPost.countDocuments(),
      QuoteLead.countDocuments({ status: 'new' }),
      FAQ.countDocuments(),
      QuoteLead.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return apiSuccess({
      products,
      blogPosts,
      newLeads,
      faqItems,
      recentLeads,
    });
  } catch (error) {
    console.error('GET /api/admin/stats:', error);
    return apiError('Failed to fetch stats', 500);
  }
}
