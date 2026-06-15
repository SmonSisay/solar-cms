import Link from 'next/link';
import Image from 'next/image';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
import DeleteBlogPostButton from '@/components/admin/DeleteBlogPostButton';
import { Button } from '@/components/ui/Button';
import { Plus, Edit } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BlogAdminPage() {
  await connectDB();
  const posts = await BlogPost.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Blog Posts</h1>
          <p className="text-sm text-slate-500">Manage your bilingual blog content and publishing status.</p>
        </div>
        <Link href="/admin/blog/new" passHref>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                <th className="p-4 w-16">Cover</th>
                <th className="p-4">Title (EN / AM)</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Published At</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No blog posts found. Click "Create Post" to write your first article.
                  </td>
                </tr>
              ) : (
                posts.map((post: any) => (
                  <tr key={post._id.toString()} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="h-10 w-16 relative rounded bg-slate-100 overflow-hidden border border-slate-100">
                        {post.coverImage ? (
                          <Image
                            src={post.coverImage}
                            alt="Cover"
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400 font-medium bg-slate-50">
                            No Img
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{post.title.en}</div>
                      <div className="text-xs text-slate-400 font-ethiopic mt-0.5">{post.title.am || 'No Amharic translation'}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                        {post.category}
                      </span>
                    </td>
                    <td className="p-4">
                      {post.published ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-500">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/blog/${post._id.toString()}/edit`} passHref>
                          <Button variant="outline" size="sm" className="flex items-center gap-1.5 h-8">
                            <Edit className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                        </Link>
                        <DeleteBlogPostButton id={post._id.toString()} title={post.title.en} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
