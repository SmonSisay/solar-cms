import { connectDB } from '@/lib/mongodb';
import QuoteLead from '@/lib/models/QuoteLead';
import LeadsTable from '@/components/admin/LeadsTable';
import { requireContentManagerOrAbove } from '@/lib/api';

export default async function AdminLeadsPage() {
  const allowed = await requireContentManagerOrAbove();
  if (!allowed) {
    return (
      <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-components text-sm">
        Access Denied: You do not have the required permissions to view this page.
      </div>
    );
  }

  await connectDB();
  const leads = await QuoteLead.find().sort({ createdAt: -1 }).lean();

  const serialized = leads.map((lead) => ({
    _id: String(lead._id),
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    message: lead.message,
    productRef: lead.productRef,
    source: lead.source,
    status: lead.status,
    adminNote: lead.adminNote,
    createdAt: lead.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Quote Leads</h2>
        <p className="text-slate-500 text-sm mt-1">
          {leads.length} total · {leads.filter((l) => l.status === 'new').length} new
        </p>
      </div>
      <LeadsTable initialLeads={serialized} />
    </div>
  );
}
