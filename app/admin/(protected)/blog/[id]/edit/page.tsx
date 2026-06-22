import { notFound, redirect } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
import BlogPostForm from '@/components/admin/BlogPostForm';
import { requirePermission } from '@/lib/api';

export const dynamic = 'force-dynamic';

interface EditBlogPostProps {
  params: {
    id: string;
  };
}

export default async function EditBlogPostPage({ params }: EditBlogPostProps) {
  const allowed = await requirePermission('manage_blog');
  if (!allowed) {
    redirect('/admin');
  }

  await connectDB();
  const post = await BlogPost.findById(params.id).lean();

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Edit Blog Post</h2>
        <p className="text-slate-500 text-sm mt-1">
          Modify the bilingual article details, status, and SEO settings.
        </p>
      </div>
      <BlogPostForm initial={JSON.parse(JSON.stringify(post))} />
    </div>
  );
}
