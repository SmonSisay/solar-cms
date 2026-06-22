import { connectDB } from '@/lib/mongodb';
import { QuoteLead, User } from '@/lib/models';
import LeadsTable from '@/components/admin/LeadsTable';
import { requirePermission } from '@/lib/api';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminLeadsPage() {
  const allowed = await requirePermission('manage_leads');
  if (!allowed) {
    redirect('/admin');
  }

  await connectDB();

  // Fetch leads and populate assignment
  const leads = await QuoteLead.find()
    .populate('assignedUser', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  // Fetch active system users who can be assigned leads
  const users = await User.find({
    active: true,
    role: { $in: ['super_admin', 'admin', 'editor'] },
  })
    .select('name email')
    .sort({ name: 1 })
    .lean();

  const serializedLeads = leads.map((lead) => ({
    _id: String(lead._id),
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    message: lead.message,
    productRef: lead.productRef,
    source: lead.source,
    status: lead.status,
    adminNote: lead.adminNote,
    notes: (lead.notes || []).map((n: any) => ({
      text: n.text,
      author: n.author,
      createdAt: n.createdAt.toISOString(),
    })),
    followUpDate: lead.followUpDate ? lead.followUpDate.toISOString() : undefined,
    assignedUser: lead.assignedUser
      ? {
          _id: String((lead.assignedUser as any)._id),
          name: (lead.assignedUser as any).name,
          email: (lead.assignedUser as any).email,
        }
      : null,
    createdAt: lead.createdAt.toISOString(),
  }));

  const serializedUsers = users.map((u) => ({
    _id: String(u._id),
    name: u.name,
    email: u.email,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Quote Leads</h2>
        <p className="text-slate-500 text-sm mt-1">
          {leads.length} total · {leads.filter((l) => l.status === 'new').length} new
        </p>
      </div>
      <LeadsTable initialLeads={serializedLeads} users={serializedUsers} />
    </div>
  );
}
