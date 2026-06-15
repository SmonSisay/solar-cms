import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models';
import UserManagementClient from '@/components/admin/UserManagementClient';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const session = await auth();
  if ((session?.user as any)?.role !== 'super_admin') {
    redirect('/admin');
  }

  await connectDB();
  const users = await User.find({ deletedAt: null }).sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">User Management</h2>
        <p className="text-slate-500 text-sm mt-1">
          Manage system administrators, roles, and permissions.
        </p>
      </div>
      <UserManagementClient
        initialUsers={JSON.parse(JSON.stringify(users))}
        currentUserId={session?.user?.id || ''}
      />
    </div>
  );
}
