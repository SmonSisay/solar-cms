'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BilingualField from './BilingualField';
import ImageUpload from './ImageUpload';
import type { BilingualText } from '@/lib/types';

interface PageData {
  _id?: string;
  title: BilingualText;
  slug?: string;
  content: BilingualText;
  featuredImage: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  metaTitle?: BilingualText;
  metaDescription?: BilingualText;
  keywords?: BilingualText;
}

const emptyBilingual = (): BilingualText => ({ en: '', am: '' });

const defaultPage = (): PageData => ({
  title: emptyBilingual(),
  slug: '',
  content: emptyBilingual(),
  featuredImage: '',
  status: 'draft',
  metaTitle: emptyBilingual(),
  metaDescription: emptyBilingual(),
  keywords: emptyBilingual(),
});

export default function PageForm({ initial }: { initial?: PageData }) {
  const router = useRouter();
  const [form, setForm] = useState<PageData>(initial ?? defaultPage());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEdit = Boolean(initial?._id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const url = isEdit
      ? `/api/admin/pages/${initial!._id}`
      : '/api/admin/pages';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const json = await res.json();
    setSaving(false);

    if (json.success) {
      router.push('/admin/pages');
      router.refresh();
    } else {
      setError(json.error ?? 'Failed to save page');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {error && (
        <div className="px-4 py-3 rounded-components text-sm bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-cards border border-slate-200 p-6 space-y-4">
        <BilingualField
          label="Page Title"
          value={form.title}
          onChange={(title) => setForm({ ...form, title })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-primary mb-1">
            URL Slug{' '}
            <span className="text-slate-400 font-normal">
              (leave blank to auto-generate from Title)
            </span>
          </label>
          <input
            value={form.slug || ''}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="e.g. solar-calculator"
            className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm focus:outline-none focus:ring-2 focus:ring-solar/50"
          />
        </div>

        <BilingualField
          label="Page Content (HTML support)"
          value={form.content}
          onChange={(content) => setForm({ ...form, content })}
          multiline
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as any })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm bg-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <ImageUpload
          value={form.featuredImage || ''}
          onChange={(url) => setForm({ ...form, featuredImage: url || '' })}
          label="Featured Image"
          folder="pages"
        />

        <div className="border-t border-slate-100 pt-4 mt-6">
          <h4 className="font-semibold text-primary mb-3">SEO Details</h4>

          <div className="space-y-4">
            <BilingualField
              label="Meta Title"
              value={form.metaTitle || emptyBilingual()}
              onChange={(metaTitle) => setForm({ ...form, metaTitle })}
            />
            <BilingualField
              label="Meta Description"
              value={form.metaDescription || emptyBilingual()}
              onChange={(metaDescription) => setForm({ ...form, metaDescription })}
              multiline
            />
            <BilingualField
              label="Keywords (comma separated)"
              value={form.keywords || emptyBilingual()}
              onChange={(keywords) => setForm({ ...form, keywords })}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-solar text-primary px-6 py-2.5 rounded-components font-semibold text-sm hover:bg-solar-lt transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : isEdit ? 'Update Page' : 'Create Page'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/pages')}
          className="px-6 py-2.5 rounded-components text-sm border border-slate-300 text-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
