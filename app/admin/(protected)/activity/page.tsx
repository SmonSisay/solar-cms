import { connectDB } from '@/lib/mongodb';
import { ActivityLog } from '@/lib/models';
import { requirePermission } from '@/lib/api';
import ActivityLogsClient from '@/components/admin/ActivityLogsClient';

export const dynamic = 'force-dynamic';

export default async function AdminActivityLogsPage() {
  // Only super_admin can view activity logs
  const session = await requirePermission('view_activity_logs');
  if (!session) {
    return (
      <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-components">
        Access Denied: You do not have permission to view activity logs.
      </div>
    );
  }

  await connectDB();
  // Fetch last 500 logs to prevent overloading
  const items = await ActivityLog.find().sort({ createdAt: -1 }).limit(500).lean();
  const serialized = JSON.parse(JSON.stringify(items));

  return <ActivityLogsClient initialItems={serialized} />;
}
