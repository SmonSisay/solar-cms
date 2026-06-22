import { connectDB } from '@/lib/mongodb';
import { Product, BlogPost, Page, Service, FAQ, Testimonial, TeamMember } from '@/lib/models';
import { apiSuccess, apiError, requirePermission } from '@/lib/api';
import { logActivity } from '@/lib/logger';

// Restore a soft-deleted item
export async function PUT(request: Request) {
  try {
    const session = await requirePermission('delete_content');
    if (!session || !session.user) return apiError('Forbidden', 403);

    const { module, id } = await request.json();
    if (!module || !id) return apiError('Module and ID are required', 400);

    await connectDB();

    const Model = getModel(module);
    if (!Model) return apiError('Invalid module', 400);

    const item = await Model.findByIdAndUpdate(
      id,
      { $set: { deletedAt: null } },
      { new: true }
    ).lean();

    if (!item) return apiError('Item not found', 404);

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || 'Admin',
      userEmail: session.user.email || '',
      action: 'restore',
      module,
      targetId: id,
      targetName: getItemName(item, module),
      details: `Restored ${module} item from trash`,
    });

    return apiSuccess({ restored: true });
  } catch (error) {
    return apiError(error);
  }
}

// Permanently delete an item
export async function DELETE(request: Request) {
  try {
    const session = await requirePermission('delete_content');
    if (!session || !session.user) return apiError('Forbidden', 403);

    const { searchParams } = new URL(request.url);
    const module = searchParams.get('module');
    const id = searchParams.get('id');

    if (!module || !id) return apiError('Module and ID are required', 400);

    await connectDB();

    const Model = getModel(module);
    if (!Model) return apiError('Invalid module', 400);

    const item = await Model.findById(id).lean();
    if (!item) return apiError('Item not found', 404);

    await Model.findByIdAndDelete(id);

    await logActivity({
      userId: session.user.id,
      userName: session.user.name || 'Admin',
      userEmail: session.user.email || '',
      action: 'delete',
      module,
      targetId: id,
      targetName: getItemName(item, module),
      details: `Permanently deleted ${module} item`,
    });

    return apiSuccess({ deleted: true });
  } catch (error) {
    return apiError(error);
  }
}

function getModel(module: string) {
  const models: Record<string, any> = {
    products: Product,
    blog: BlogPost,
    pages: Page,
    services: Service,
    faq: FAQ,
    testimonials: Testimonial,
    team: TeamMember,
  };
  return models[module] ?? null;
}

function getItemName(item: any, module: string): string {
  if (item.name?.en) return item.name.en;
  if (item.title?.en) return item.title.en;
  if (item.question?.en) return item.question.en;
  if (item.author?.en) return item.author.en;
  if (typeof item.name === 'string') return item.name;
  return `${module} item`;
}
