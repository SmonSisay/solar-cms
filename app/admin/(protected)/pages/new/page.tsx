import PageForm from '@/components/admin/PageForm';

export const dynamic = 'force-dynamic';

export default function NewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Create Page</h2>
        <p className="text-slate-500 text-sm mt-1">
          Configure a new bilingual custom page.
        </p>
      </div>
      <PageForm />
    </div>
  );
}
