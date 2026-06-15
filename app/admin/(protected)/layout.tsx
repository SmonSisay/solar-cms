import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/admin/login');
  }

  return (
    <AdminShell
      email={session.user.email}
      role={session.user.role}
    >
      {children}
    </AdminShell>
  );

}
