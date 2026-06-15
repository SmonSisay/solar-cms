import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import { Product, BlogPost, QuoteLead, FAQ } from '@/lib/models';
import { formatDate } from '@/lib/utils';
import { Package, FileText, MessageSquare, HelpCircle } from 'lucide-react';
import { requireContentManagerOrAbove } from '@/lib/api';

export default async function AdminDashboardPage() {
  const allowed = await requireContentManagerOrAbove();
  if (!allowed) {
    return (
      <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-components text-sm">
        Access Denied: You do not have the required permissions to view this page.
      </div>
    );
  }

  await connectDB();

  const [products, blogPosts, newLeads, faqItems, recentLeads] = await Promise.all([
    Product.countDocuments(),
    BlogPost.countDocuments(),
    QuoteLead.countDocuments({ status: 'new' }),
    FAQ.countDocuments(),
    QuoteLead.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const stats = [
    { label: 'Products', value: products, icon: Package, href: '/admin/products' },
    { label: 'Blog Posts', value: blogPosts, icon: FileText, href: '/admin/blog' },
    { label: 'New Leads', value: newLeads, icon: MessageSquare, href: '/admin/leads' },
    { label: 'FAQ Items', value: faqItems, icon: HelpCircle, href: '/admin/faq' },
  ];


  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-primary">Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">Overview of your Smon website content.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-cards border border-slate-200 p-5 hover:border-solar transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <Icon className="w-5 h-5 text-solar" />
              <span className="text-2xl font-bold text-primary">{value}</span>
            </div>
            <p className="text-sm text-slate-600">{label}</p>
          </Link>
        ))}
      </div>

      <div className="flex gap-3">
        <Link
          href="/admin/products/new"
          className="bg-solar text-primary px-4 py-2 rounded-components text-sm font-semibold hover:bg-solar-lt transition-colors"
        >
          + Add Product
        </Link>
        <Link
          href="/admin/settings"
          className="border border-slate-300 text-primary px-4 py-2 rounded-components text-sm font-medium hover:border-solar transition-colors"
        >
          Edit Site Settings
        </Link>
      </div>

      <div className="bg-white rounded-cards border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-primary">Recent Leads</h3>
          <Link href="/admin/leads" className="text-sm text-solar font-medium">
            View all →
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-500">No leads yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-primary">Name</th>
                <th className="text-left px-6 py-3 font-medium text-primary">Phone</th>
                <th className="text-left px-6 py-3 font-medium text-primary">Source</th>
                <th className="text-left px-6 py-3 font-medium text-primary">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={String(lead._id)} className="border-t border-slate-100">
                  <td className="px-6 py-3">{lead.name}</td>
                  <td className="px-6 py-3 text-slate-600">{lead.phone}</td>
                  <td className="px-6 py-3 text-slate-600">{lead.source}</td>
                  <td className="px-6 py-3 text-slate-500">{formatDate(lead.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
