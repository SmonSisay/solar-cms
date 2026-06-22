import BlogPostForm from '@/components/admin/BlogPostForm';
import { requirePermission } from '@/lib/api';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function NewBlogPostPage() {
  const allowed = await requirePermission('manage_blog');
  if (!allowed) {
    redirect('/admin');
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Create Blog Post</h2>
        <p className="text-slate-500 text-sm mt-1">
          Write and publish a new bilingual article.
        </p>
      </div>
      <BlogPostForm />
    </div>
  );
}
