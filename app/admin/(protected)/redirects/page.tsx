import { connectDB } from '@/lib/mongodb';
import { Redirect } from '@/lib/models';
import { requirePermission } from '@/lib/api';
import RedirectsClient from '@/components/admin/RedirectsClient';

export const dynamic = 'force-dynamic';

export default async function AdminRedirectsPage() {
  const session = await requirePermission('manage_redirects');
  if (!session) {
    return (
      <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-components">
        Access Denied: You do not have permission to manage redirects.
      </div>
    );
  }

  await connectDB();
  const items = await Redirect.find().sort({ createdAt: -1 }).lean();
  const serialized = JSON.parse(JSON.stringify(items));

  return <RedirectsClient initialItems={serialized} />;
}
