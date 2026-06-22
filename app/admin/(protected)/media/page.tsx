import { connectDB } from '@/lib/mongodb';
import { MediaAsset } from '@/lib/models';
import { requirePermission } from '@/lib/api';
import MediaLibraryClient from '@/components/admin/MediaLibraryClient';

export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  const session = await requirePermission('manage_media');
  if (!session) {
    return (
      <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-components">
        Access Denied: You do not have permission to manage media library.
      </div>
    );
  }

  await connectDB();
  const items = await MediaAsset.find().sort({ createdAt: -1 }).lean();
  const serialized = JSON.parse(JSON.stringify(items));

  return <MediaLibraryClient initialItems={serialized} />;
}
