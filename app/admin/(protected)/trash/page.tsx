import { connectDB } from '@/lib/mongodb';
import { Product, BlogPost, Page, Service, FAQ, Testimonial, TeamMember } from '@/lib/models';
import { requirePermission } from '@/lib/api';
import TrashClient from '@/components/admin/TrashClient';

export const dynamic = 'force-dynamic';

interface TrashItem {
  _id: string;
  module: string;
  name: string;
  deletedAt: string;
}

function getName(item: any): string {
  if (item.name?.en) return item.name.en;
  if (item.title?.en) return item.title.en;
  if (item.question?.en) return item.question.en;
  if (item.author?.en) return item.author.en;
  if (typeof item.name === 'string') return item.name;
  return 'Unnamed';
}

export default async function AdminTrashPage() {
  const session = await requirePermission('delete_content');
  if (!session) {
    return (
      <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-components">
        Access Denied: You do not have permission to manage trash.
      </div>
    );
  }

  await connectDB();

  const models: Array<{ model: any; module: string }> = [
    { model: Product, module: 'products' },
    { model: BlogPost, module: 'blog' },
    { model: Page, module: 'pages' },
    { model: Service, module: 'services' },
    { model: FAQ, module: 'faq' },
    { model: Testimonial, module: 'testimonials' },
    { model: TeamMember, module: 'team' },
  ];

  const allTrash: TrashItem[] = [];

  for (const { model, module } of models) {
    const items = await model
      .find({ deletedAt: { $ne: null } })
      .sort({ deletedAt: -1 })
      .lean();

    for (const item of items) {
      allTrash.push({
        _id: String(item._id),
        module,
        name: getName(item),
        deletedAt: item.deletedAt.toISOString(),
      });
    }
  }

  // Sort by deletion date descending
  allTrash.sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime());

  return <TrashClient initialItems={allTrash} />;
}
