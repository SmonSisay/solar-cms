'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Settings,
  Package,
  MessageSquare,
  LogOut,
  Sun,
  Users,
  FileText,
  PenSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    exact: true,
    roles: ['super_admin', 'admin', 'editor', 'content_manager'],
  },
  {
    href: '/admin/products',
    label: 'Products',
    icon: Package,
    roles: ['super_admin', 'admin'],
  },
  {
    href: '/admin/blog',
    label: 'Blog',
    icon: PenSquare,
    roles: ['super_admin', 'admin', 'editor', 'content_manager'],
  },
  {
    href: '/admin/pages',
    label: 'Pages',
    icon: FileText,
    roles: ['super_admin', 'admin', 'editor', 'content_manager'],
  },
  {
    href: '/admin/leads',
    label: 'Leads',
    icon: MessageSquare,
    roles: ['super_admin', 'admin'],
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: Users,
    roles: ['super_admin'],
  },
  {
    href: '/admin/settings',
    label: 'Site Settings',
    icon: Settings,
    roles: ['super_admin'],
  },
];

export default function AdminShell({
  children,
  email,
  role,
}: {
  children: React.ReactNode;
  email: string;
  role: string;
}) {
  const pathname = usePathname();
  const filteredNavItems = navItems.filter((item) => item.roles.includes(role));


  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="w-64 shrink-0 bg-primary text-white flex flex-col">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-primary-md">
          <Sun className="w-6 h-6 text-solar" />
          <span className="font-bold text-lg">Smon Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {filteredNavItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-components text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary-md text-solar'
                    : 'text-slate-300 hover:bg-primary-md hover:text-white'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-primary-md">
          <p className="text-xs text-slate-400 truncate mb-2">{email}</p>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-8 py-4">
          <h1 className="text-lg font-semibold text-primary">Content Management</h1>
        </header>
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
