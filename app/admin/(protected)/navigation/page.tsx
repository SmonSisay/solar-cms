import { connectDB } from '@/lib/mongodb';
import { MenuLink } from '@/lib/models';
import { requirePermission } from '@/lib/api';
import NavigationClient from '@/components/admin/NavigationClient';

export const dynamic = 'force-dynamic';

export default async function AdminNavigationPage() {
  const session = await requirePermission('manage_menus');
  if (!session) {
    return (
      <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-components">
        Access Denied: You do not have permission to manage navigation.
      </div>
    );
  }

  await connectDB();
  const links = await MenuLink.find().sort({ order: 1 }).lean();
  const serialized = JSON.parse(JSON.stringify(links));

  return <NavigationClient initialLinks={serialized} />;
}
