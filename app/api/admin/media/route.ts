import { connectDB } from '@/lib/mongodb';
import { MediaAsset } from '@/lib/models';
import { apiSuccess, apiError, requirePermission } from '@/lib/api';

export async function GET(request: Request) {
  try {
    const session = await requirePermission('manage_media');
    if (!session) return apiError('Forbidden', 403);

    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder');
    const search = searchParams.get('search');

    await connectDB();

    const query: any = {};
    if (folder && folder !== 'all') {
      query.folder = folder;
    }
    if (search) {
      query.fileName = { $regex: search, $options: 'i' };
    }

    const items = await MediaAsset.find(query).sort({ createdAt: -1 }).lean();
    return apiSuccess(items);
  } catch (error) {
    return apiError(error);
  }
}
