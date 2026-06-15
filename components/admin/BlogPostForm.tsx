'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BilingualField from './BilingualField';
import ImageUpload from './ImageUpload';
import type { BilingualText } from '@/lib/types';

interface BlogPostData {
  _id?: string;
  title: BilingualText;
  slug?: string;
  excerpt: BilingualText;
  content: BilingualText;
  coverImage: string;
  category: string;
  author: string;
  tags: string[];
  seoTitle: BilingualText;
  seoDescription: BilingualText;
  published: boolean;
}

const emptyBilingual = (): BilingualText => ({ en: '', am: '' });

const defaultBlogPost = (): BlogPostData => ({
  title: emptyBilingual(),
  slug: '',
  excerpt: emptyBilingual(),
  content: emptyBilingual(),
  coverImage: '',
  category: 'general',
  author: 'Smon Team',
  tags: [],
  seoTitle: emptyBilingual(),
  seoDescription: emptyBilingual(),
  published: false,
});

export default function BlogPostForm({ initial }: { initial?: BlogPostData }) {
  const router = useRouter();
  const [form, setForm] = useState<BlogPostData>(initial ?? defaultBlogPost());
  const [tagsInput, setTagsInput] = useState<string>(initial?.tags.join(', ') ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEdit = Boolean(initial?._id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    // Parse comma-separated tags
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const payload = {
      ...form,
      tags,
    };

    const url = isEdit
      ? `/api/blog/${initial!._id}`
      : '/api/blog';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      setSaving(false);

      if (json.success) {
        router.push('/admin/blog');
        router.refresh();
      } else {
        setError(json.error ?? 'Failed to save blog post');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('An unexpected error occurred.');
      setSaving(false);
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
          label="Post Title"
          value={form.title}
          onChange={(title) => setForm({ ...form, title })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-primary mb-1">
            URL Slug{' '}
            <span className="text-slate-400 font-normal">
              (leave blank to auto-generate from English title)
            </span>
          </label>
          <input
            value={form.slug || ''}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="e.g. solar-energy-benefits"
            className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm focus:outline-none focus:ring-2 focus:ring-solar/50"
          />
        </div>

        <BilingualField
          label="Excerpt / Summary"
          value={form.excerpt}
          onChange={(excerpt) => setForm({ ...form, excerpt })}
          multiline
        />

        <BilingualField
          label="Main Article Content (HTML support)"
          value={form.content}
          onChange={(content) => setForm({ ...form, content })}
          multiline
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm bg-white"
            >
              <option value="general">General</option>
              <option value="solar">Solar Energy</option>
              <option value="installation">Installation</option>
              <option value="tips">Tips & Guides</option>
              <option value="news">News & Updates</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Author
            </label>
            <input
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm focus:outline-none focus:ring-2 focus:ring-solar/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              Published Status
            </label>
            <select
              value={form.published ? 'true' : 'false'}
              onChange={(e) => setForm({ ...form, published: e.target.value === 'true' })}
              className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm bg-white"
            >
              <option value="false">Draft / Hidden</option>
              <option value="true">Published / Public</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">
            Tags{' '}
            <span className="text-slate-400 font-normal">
              (comma separated values)
            </span>
          </label>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. green energy, monocrystalline, savings"
            className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm focus:outline-none focus:ring-2 focus:ring-solar/50"
          />
        </div>

        <ImageUpload
          value={form.coverImage || ''}
          onChange={(url) => setForm({ ...form, coverImage: url || '' })}
          label="Cover Image"
          folder="blog"
        />

        <div className="border-t border-slate-100 pt-4 mt-6">
          <h4 className="font-semibold text-primary mb-3">SEO Metadata Settings</h4>

          <div className="space-y-4">
            <BilingualField
              label="SEO Title"
              value={form.seoTitle || emptyBilingual()}
              onChange={(seoTitle) => setForm({ ...form, seoTitle })}
            />
            <BilingualField
              label="SEO Description"
              value={form.seoDescription || emptyBilingual()}
              onChange={(seoDescription) => setForm({ ...form, seoDescription })}
              multiline
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
          {saving ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/blog')}
          className="px-6 py-2.5 rounded-components text-sm border border-slate-300 text-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
