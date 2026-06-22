import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import { Page } from '@/lib/models';
import DeletePageButton from '@/components/admin/DeletePageButton';
import { requirePermission } from '@/lib/api';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminPagesPage() {
  const allowed = await requirePermission('manage_pages');
  if (!allowed) {
    redirect('/admin');
  }

  await connectDB();
  const pages = await Page.find({ deletedAt: null }).sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Dynamic Pages</h2>
          <p className="text-slate-500 text-sm mt-1">{pages.length} pages configured</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="bg-solar text-primary px-4 py-2 rounded-components text-sm font-semibold hover:bg-solar-lt transition-colors"
        >
          + Add Page
        </Link>
      </div>

      <div className="bg-white rounded-cards border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-primary">Title (EN)</th>
              <th className="text-left px-4 py-3 font-medium text-primary">Slug</th>
              <th className="text-left px-4 py-3 font-medium text-primary">Status</th>
              <th className="text-left px-4 py-3 font-medium text-primary">Last Updated</th>
              <th className="text-right px-4 py-3 font-medium text-primary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No custom pages yet.{' '}
                  <Link href="/admin/pages/new" className="text-solar font-medium">
                    Create your first page
                  </Link>
                </td>
              </tr>
            ) : (
              pages.map((page) => (
                <tr key={String(page._id)} className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium">{page.title.en}</td>
                  <td className="px-4 py-3 text-slate-600">/{page.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        page.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : page.status === 'draft'
                          ? 'bg-slate-100 text-slate-800'
                          : page.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {page.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link
                      href={`/admin/pages/${page._id}/edit`}
                      className="text-primary-lt hover:underline text-sm"
                    >
                      Edit
                    </Link>
                    <DeletePageButton id={String(page._id)} title={page.title.en} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
