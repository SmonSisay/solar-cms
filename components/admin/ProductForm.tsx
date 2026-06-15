'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BilingualField from './BilingualField';
import ImageUpload from './ImageUpload';
import type { BilingualText, ProductCategory } from '@/lib/types';

interface ProductData {
  _id?: string;
  name: BilingualText;
  slug?: string;
  shortDescription: BilingualText;
  description: BilingualText;
  category: ProductCategory;
  subcategory: string;
  brand: string;
  price: number;
  priceOnRequest: boolean;
  images: string[];
  specs: Array<{ key: string; value: string }>;
  datasheet: string;
  inStock: boolean;
  featured: boolean;
  metaDescription: BilingualText;
}

const categories: ProductCategory[] = [
  'panels',
  'inverters',
  'batteries',
  'accessories',
  'systems',
  'other',
];

const emptyBilingual = (): BilingualText => ({ en: '', am: '' });

const defaultProduct = (): ProductData => ({
  name: emptyBilingual(),
  shortDescription: emptyBilingual(),
  description: emptyBilingual(),
  category: 'panels',
  subcategory: '',
  brand: '',
  price: 0,
  priceOnRequest: false,
  images: [],
  specs: [],
  datasheet: '',
  inStock: true,
  featured: false,
  metaDescription: emptyBilingual(),
});

export default function ProductForm({ initial }: { initial?: ProductData }) {
  const router = useRouter();
  const [form, setForm] = useState<ProductData>(initial ?? defaultProduct());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEdit = Boolean(initial?._id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const url = isEdit ? `/api/products/${initial!._id}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const json = await res.json();
    setSaving(false);

    if (json.success) {
      router.push('/admin/products');
      router.refresh();
    } else {
      setError(json.error ?? 'Failed to save product');
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
          label="Product Name"
          value={form.name}
          onChange={(name) => setForm({ ...form, name })}
          required
        />
        <BilingualField
          label="Short Description"
          value={form.shortDescription}
          onChange={(shortDescription) => setForm({ ...form, shortDescription })}
          multiline
        />
        <BilingualField
          label="Full Description (HTML)"
          value={form.description}
          onChange={(description) => setForm({ ...form, description })}
          multiline
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
              className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Brand</label>
            <input
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Price (ETB)</label>
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              disabled={form.priceOnRequest}
              className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm disabled:bg-slate-100"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.priceOnRequest}
              onChange={(e) => setForm({ ...form, priceOnRequest: e.target.checked })}
            />
            Contact for price
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
            />
            In stock
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Featured
          </label>
        </div>

        <ImageUpload
          value={form.images[0] ?? ''}
          onChange={(url) => setForm({ ...form, images: url ? [url, ...form.images.slice(1)] : [] })}
          label="Main Image"
          folder="products"
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-primary">Specifications</label>
          {form.specs.map((spec, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={spec.key}
                onChange={(e) => {
                  const specs = [...form.specs];
                  specs[i] = { ...specs[i], key: e.target.value };
                  setForm({ ...form, specs });
                }}
                placeholder="Key"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-components text-sm"
              />
              <input
                value={spec.value}
                onChange={(e) => {
                  const specs = [...form.specs];
                  specs[i] = { ...specs[i], value: e.target.value };
                  setForm({ ...form, specs });
                }}
                placeholder="Value"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-components text-sm"
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, specs: form.specs.filter((_, j) => j !== i) })}
                className="text-red-500 text-sm px-2"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setForm({ ...form, specs: [...form.specs, { key: '', value: '' }] })}
            className="text-sm text-solar font-medium"
          >
            + Add Spec
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-solar text-primary px-6 py-2.5 rounded-components font-semibold text-sm hover:bg-solar-lt transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-6 py-2.5 rounded-components text-sm border border-slate-300 text-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
