'use client';

import { useState } from 'react';
import BilingualField from './BilingualField';
import ImageUpload from './ImageUpload';
import type { BilingualText } from '@/lib/types';

interface SiteSettingsData {
  businessName: string;
  tagline: BilingualText;
  phone: string[];
  whatsapp: string;
  email: string;
  address: BilingualText;
  mapEmbedUrl: string;
  workingHours: BilingualText;
  logo: string;
  heroTitle: BilingualText;
  heroSubtitle: BilingualText;
  heroCTAText: BilingualText;
  heroImage: string;
  stats: Array<{ label: BilingualText; value: string }>;
  whyUsPoints: Array<{ title: BilingualText; desc: BilingualText; icon: string }>;
  socialLinks: {
    facebook: string;
    instagram: string;
    telegram: string;
    youtube: string;
    tiktok: string;
    linkedin: string;
  };
  metaDescription: BilingualText;
}

const emptyBilingual = (): BilingualText => ({ en: '', am: '' });

export default function SettingsForm({ initial }: { initial: SiteSettingsData }) {
  const [form, setForm] = useState<SiteSettingsData>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const json = await res.json();
    setSaving(false);

    if (json.success) {
      setMessage('Settings saved successfully.');
    } else {
      setMessage(json.error ?? 'Failed to save settings.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      {message && (
        <div
          className={`px-4 py-3 rounded-components text-sm ${
            message.includes('success')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      <section className="bg-white rounded-cards border border-slate-200 p-6 space-y-4">
        <h2 className="text-base font-semibold text-primary">Business Info</h2>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Business Name</label>
          <input
            value={form.businessName}
            onChange={(e) => setForm({ ...form, businessName: e.target.value })}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm"
          />
        </div>
        <BilingualField
          label="Tagline"
          value={form.tagline}
          onChange={(tagline) => setForm({ ...form, tagline })}
        />
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Phone Numbers (comma-separated)</label>
          <input
            value={form.phone.join(', ')}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value.split(',').map((p) => p.trim()).filter(Boolean),
              })
            }
            className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">WhatsApp Number</label>
            <input
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              placeholder="251911000000"
              className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm"
            />
          </div>
        </div>
        <BilingualField
          label="Address"
          value={form.address}
          onChange={(address) => setForm({ ...form, address })}
        />
        <BilingualField
          label="Working Hours"
          value={form.workingHours}
          onChange={(workingHours) => setForm({ ...form, workingHours })}
        />
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Google Maps Embed URL</label>
          <input
            value={form.mapEmbedUrl}
            onChange={(e) => setForm({ ...form, mapEmbedUrl: e.target.value })}
            placeholder="https://www.google.com/maps/embed?..."
            className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm"
          />
        </div>
        <ImageUpload value={form.logo} onChange={(logo) => setForm({ ...form, logo })} label="Logo" folder="logo" />
      </section>

      <section className="bg-white rounded-cards border border-slate-200 p-6 space-y-4">
        <h2 className="text-base font-semibold text-primary">Hero Section</h2>
        <BilingualField
          label="Hero Title"
          value={form.heroTitle}
          onChange={(heroTitle) => setForm({ ...form, heroTitle })}
          required
        />
        <BilingualField
          label="Hero Subtitle"
          value={form.heroSubtitle}
          onChange={(heroSubtitle) => setForm({ ...form, heroSubtitle })}
          multiline
        />
        <BilingualField
          label="Hero CTA Text"
          value={form.heroCTAText}
          onChange={(heroCTAText) => setForm({ ...form, heroCTAText })}
        />
        <ImageUpload
          value={form.heroImage}
          onChange={(heroImage) => setForm({ ...form, heroImage })}
          label="Hero Image"
          folder="hero"
        />
      </section>

      <section className="bg-white rounded-cards border border-slate-200 p-6 space-y-4">
        <h2 className="text-base font-semibold text-primary">Stats Bar</h2>
        {form.stats.map((stat, i) => (
          <div key={i} className="flex gap-3 items-end">
            <div className="flex-1">
              <BilingualField
                label={`Stat ${i + 1} Label`}
                value={stat.label}
                onChange={(label) => {
                  const stats = [...form.stats];
                  stats[i] = { ...stats[i], label };
                  setForm({ ...form, stats });
                }}
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium text-primary mb-1">Value</label>
              <input
                value={stat.value}
                onChange={(e) => {
                  const stats = [...form.stats];
                  stats[i] = { ...stats[i], value: e.target.value };
                  setForm({ ...form, stats });
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm"
              />
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, stats: form.stats.filter((_, j) => j !== i) })}
              className="text-red-500 text-sm pb-2"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setForm({ ...form, stats: [...form.stats, { label: emptyBilingual(), value: '' }] })
          }
          className="text-sm text-solar font-medium"
        >
          + Add Stat
        </button>
      </section>

      <section className="bg-white rounded-cards border border-slate-200 p-6 space-y-4">
        <h2 className="text-base font-semibold text-primary">Social Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['facebook', 'instagram', 'telegram', 'youtube', 'tiktok', 'linkedin'] as const).map(
            (key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-primary mb-1 capitalize">{key}</label>
                <input
                  value={form.socialLinks[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      socialLinks: { ...form.socialLinks, [key]: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm"
                />
              </div>
            )
          )}
        </div>
      </section>

      <BilingualField
        label="Meta Description (SEO)"
        value={form.metaDescription}
        onChange={(metaDescription) => setForm({ ...form, metaDescription })}
        multiline
      />

      <button
        type="submit"
        disabled={saving}
        className="bg-solar text-primary px-6 py-2.5 rounded-components font-semibold text-sm hover:bg-solar-lt transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
}
