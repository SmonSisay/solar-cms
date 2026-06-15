import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import { Page } from '@/lib/models';
import PageForm from '@/components/admin/PageForm';

export const dynamic = 'force-dynamic';

interface EditPageProps {
  params: {
    id: string;
  };
}

export default async function EditPage({ params }: EditPageProps) {
  await connectDB();
  const page = await Page.findOne({ _id: params.id, deletedAt: null }).lean();

  if (!page) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Edit Page</h2>
        <p className="text-slate-500 text-sm mt-1">
          Modify the bilingual page details and SEO configurations.
        </p>
      </div>
      <PageForm initial={JSON.parse(JSON.stringify(page))} />
    </div>
  );
}
