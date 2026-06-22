import { connectDB } from '@/lib/mongodb';
import { MenuLink } from '@/lib/models';
import { apiSuccess, apiError, requirePermission } from '@/lib/api';
import { menuLinkSchema } from '@/lib/validations';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
    const published = searchParams.get('published');

    const filter: Record<string, any> = {};
    if (location) filter.location = location;
    if (published === 'true') filter.published = true;

    const links = await MenuLink.find(filter).sort({ order: 1 }).lean();
    return apiSuccess(links);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requirePermission('manage_menus');
    if (!session) return apiError('Unauthorized', 401);

    const body = await request.json();
    const parsed = menuLinkSchema.parse(body);

    await connectDB();
    const link = await MenuLink.create(parsed);
    return apiSuccess(link, 201);
  } catch (error) {
    return apiError(error);
  }
}
