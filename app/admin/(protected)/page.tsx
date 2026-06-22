import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import { Product, BlogPost, QuoteLead, FAQ, Page, Service, ActivityLog, MediaAsset } from '@/lib/models';
import { formatDate } from '@/lib/utils';
import {
  Package,
  FileText,
  MessageSquare,
  HelpCircle,
  Image as ImageIcon,
  Activity,
  BarChart3,
  TrendingUp,
  Users,
  Wrench,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { requireContentManagerOrAbove } from '@/lib/api';

export const dynamic = 'force-dynamic';

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

  const [
    totalProducts,
    totalBlogPosts,
    publishedBlogPosts,
    draftBlogPosts,
    totalLeads,
    newLeads,
    wonLeads,
    totalFaqs,
    totalPages,
    publishedPages,
    totalServices,
    totalMedia,
    recentLeads,
    recentActivity,
  ] = await Promise.all([
    Product.countDocuments({ deletedAt: null }),
    BlogPost.countDocuments({ deletedAt: null }),
    BlogPost.countDocuments({ deletedAt: null, published: true }),
    BlogPost.countDocuments({ deletedAt: null, published: false }),
    QuoteLead.countDocuments(),
    QuoteLead.countDocuments({ status: 'new' }),
    QuoteLead.countDocuments({ status: 'won' }),
    FAQ.countDocuments({ deletedAt: null }),
    Page.countDocuments({ deletedAt: null }),
    Page.countDocuments({ deletedAt: null, status: 'published' }),
    Service.countDocuments({ deletedAt: null }),
    MediaAsset.countDocuments(),
    QuoteLead.find().sort({ createdAt: -1 }).limit(5).lean(),
    ActivityLog.find().sort({ createdAt: -1 }).limit(8).lean(),
  ]);

  const primaryStats = [
    { label: 'Products', value: totalProducts, icon: Package, href: '/admin/products', color: 'text-solar bg-solar/10' },
    { label: 'New Leads', value: newLeads, icon: MessageSquare, href: '/admin/leads', color: 'text-blue-600 bg-blue-50' },
    { label: 'Blog Posts', value: totalBlogPosts, icon: FileText, href: '/admin/blog', color: 'text-purple-600 bg-purple-50' },
    { label: 'Media Files', value: totalMedia, icon: ImageIcon, href: '/admin/media', color: 'text-green-600 bg-green-50' },
  ];

  const contentStats = [
    { label: 'Published Posts', value: publishedBlogPosts, total: totalBlogPosts },
    { label: 'Published Pages', value: publishedPages, total: totalPages },
    { label: 'Won Leads', value: wonLeads, total: totalLeads },
    { label: 'FAQ Items', value: totalFaqs, total: totalFaqs },
  ];

  const actionBadge: Record<string, string> = {
    login: 'bg-green-100 text-green-700',
    create: 'bg-blue-100 text-blue-700',
    update: 'bg-amber-100 text-amber-700',
    delete: 'bg-red-100 text-red-700',
    publish: 'bg-purple-100 text-purple-700',
    restore: 'bg-teal-100 text-teal-700',
    settings_change: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">Overview of your Smon Solar CMS.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/products/new"
            className="bg-solar text-primary px-4 py-2 rounded-components text-sm font-semibold hover:bg-solar-lt transition-colors"
          >
            + Add Product
          </Link>
          <Link
            href="/admin/blog/new"
            className="border border-slate-300 text-primary px-4 py-2 rounded-components text-sm font-medium hover:border-solar transition-colors"
          >
            + New Post
          </Link>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryStats.map(({ label, value, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-cards border border-slate-200 p-5 hover:border-solar hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-solar transition-colors" />
            </div>
            <span className="text-3xl font-bold text-primary">{value}</span>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Content Status Summary */}
      <div className="bg-white rounded-cards border border-slate-200 p-6">
        <h3 className="font-semibold text-primary text-sm flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-solar" /> Content Status Summary
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {contentStats.map(({ label, value, total }) => (
            <div key={label} className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-500">{label}</span>
                <span className="text-xs font-bold text-primary">{value}/{total}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-solar rounded-full transition-all duration-500"
                  style={{ width: total > 0 ? `${(value / total) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white rounded-cards border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-primary text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" /> Latest Leads
            </h3>
            <Link href="/admin/leads" className="text-xs text-solar font-medium hover:underline">
              View all →
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="px-6 py-8 text-sm text-slate-400 text-center">No leads yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentLeads.map((lead) => (
                <div key={String(lead._id)} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{lead.name}</p>
                    <p className="text-xs text-slate-400">{lead.phone} · {lead.source}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      lead.status === 'won' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {lead.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(lead.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-cards border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-primary text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" /> Recent Activity
            </h3>
            <Link href="/admin/activity" className="text-xs text-solar font-medium hover:underline">
              View all →
            </Link>
          </div>
          {recentActivity.length === 0 ? (
            <p className="px-6 py-8 text-sm text-slate-400 text-center">No activity recorded.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentActivity.map((log: any) => (
                <div key={String(log._id)} className="px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                      {log.userName?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div>
                      <p className="text-sm text-slate-800">
                        <span className="font-medium">{log.userName}</span>
                        {' '}
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${actionBadge[log.action] || 'bg-slate-100 text-slate-500'}`}>
                          {log.action}
                        </span>
                        {' '}
                        <span className="text-slate-500 capitalize">{log.module}</span>
                      </p>
                      {log.targetName && (
                        <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{log.targetName}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    {formatDate(log.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
