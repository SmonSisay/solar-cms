'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Trash2, Edit, Plus, GripVertical } from 'lucide-react';
import BilingualField from '@/components/admin/BilingualField';
import type { BilingualText } from '@/lib/types';

interface MenuLinkItem {
  _id: string;
  label: BilingualText;
  url: string;
  location: 'header' | 'footer';
  order: number;
  published: boolean;
}

const emptyBilingual = (): BilingualText => ({ en: '', am: '' });

export default function NavigationClient({ initialLinks }: { initialLinks: MenuLinkItem[] }) {
  const [links, setLinks] = useState<MenuLinkItem[]>(initialLinks);
  const [activeTab, setActiveTab] = useState<'header' | 'footer'>('header');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<MenuLinkItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form state
  const [label, setLabel] = useState<BilingualText>(emptyBilingual());
  const [url, setUrl] = useState('');
  const [order, setOrder] = useState(0);
  const [published, setPublished] = useState(true);

  const filtered = links
    .filter((l) => l.location === activeTab)
    .sort((a, b) => a.order - b.order);

  function openCreate() {
    setEditing(null);
    setLabel(emptyBilingual());
    setUrl('');
    setOrder(filtered.length);
    setPublished(true);
    setShowModal(true);
  }

  function openEdit(link: MenuLinkItem) {
    setEditing(link);
    setLabel(link.label);
    setUrl(link.url);
    setOrder(link.order);
    setPublished(link.published);
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const body = { label, url, location: activeTab, order, published };
      if (editing) {
        const res = await fetch(`/api/admin/menu-links/${editing._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (json.success) {
          setLinks((prev) =>
            prev.map((l) => (l._id === editing._id ? json.data : l))
          );
        }
      } else {
        const res = await fetch('/api/admin/menu-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (json.success) {
          setLinks((prev) => [...prev, json.data]);
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this menu link?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/menu-links/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setLinks((prev) => prev.filter((l) => l._id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Navigation Management</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage header and footer navigation links
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Link
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['header', 'footer'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-components text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? 'bg-solar text-primary'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab} Links ({links.filter((l) => l.location === tab).length})
          </button>
        ))}
      </div>

      {/* Link List */}
      <div className="bg-white rounded-cards border border-slate-200 divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No {activeTab} links configured. Default navigation will be used.
          </div>
        ) : (
          filtered.map((link) => (
            <div
              key={link._id}
              className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors"
            >
              <GripVertical className="w-4 h-4 text-slate-300" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">
                  {link.label.en}
                  {link.label.am && (
                    <span className="text-slate-400 ml-2">/ {link.label.am}</span>
                  )}
                </p>
                <p className="text-xs text-slate-400 truncate">{link.url}</p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  link.published
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {link.published ? 'Published' : 'Hidden'}
              </span>
              <span className="text-xs text-slate-400 w-8 text-center">#{link.order}</span>
              <button onClick={() => openEdit(link)} className="p-1.5 hover:bg-slate-100 rounded">
                <Edit className="w-4 h-4 text-slate-500" />
              </button>
              <button
                onClick={() => handleDelete(link._id)}
                disabled={deleting === link._id}
                className="p-1.5 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Link' : 'Add Link'}>
        <div className="space-y-4">
          <BilingualField
            label="Label"
            value={label}
            onChange={setLabel}
            required
          />
          <div>
            <label className="block text-sm font-medium text-primary mb-1">URL</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="/products or https://external.com"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded border-slate-300"
                />
                Published
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !label.en || !url}>
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
