'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Trash2, Edit, Plus, ArrowRight } from 'lucide-react';

interface RedirectItem {
  _id: string;
  source: string;
  destination: string;
  type: 301 | 302;
  active: boolean;
  hitCount: number;
}

export default function RedirectsClient({ initialItems }: { initialItems: RedirectItem[] }) {
  const [items, setItems] = useState<RedirectItem[]>(initialItems);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<RedirectItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form state
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [type, setType] = useState<301 | 302>(301);
  const [active, setActive] = useState(true);

  function openCreate() {
    setEditing(null);
    setSource('');
    setDestination('');
    setType(301);
    setActive(true);
    setShowModal(true);
  }

  function openEdit(item: RedirectItem) {
    setEditing(item);
    setSource(item.source);
    setDestination(item.destination);
    setType(item.type);
    setActive(item.active);
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const body = { source, destination, type, active };
      if (editing) {
        const res = await fetch(`/api/admin/redirects/${editing._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (json.success) {
          setItems((prev) => prev.map((item) => (item._id === editing._id ? json.data : item)));
        }
      } else {
        const res = await fetch('/api/admin/redirects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (json.success) {
          setItems((prev) => [json.data, ...prev]);
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
    if (!confirm('Are you sure you want to delete this redirect rule?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/redirects/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setItems((prev) => prev.filter((item) => item._id !== id));
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
          <h2 className="text-2xl font-bold text-primary">Redirect Management</h2>
          <p className="text-sm text-slate-500 mt-1">
            Create 301 and 302 redirects to preserve SEO when page slugs change.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Redirect
        </Button>
      </div>

      <div className="bg-white rounded-cards border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="px-6 py-3">Source Path</th>
                <th className="px-6 py-3">Destination</th>
                <th className="px-6 py-3 w-32">Type</th>
                <th className="px-6 py-3 w-32">Status</th>
                <th className="px-6 py-3 w-32">Hit Count</th>
                <th className="px-6 py-3 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No redirect rules configured.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-700 break-all">{item.source}</td>
                    <td className="px-6 py-4 text-slate-600 break-all">
                      <div className="flex items-center gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.destination}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500">{item.type} Redirect</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {item.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-semibold">{item.hitCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-slate-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deleting === item._id}
                          className="p-1.5 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Redirect' : 'Add Redirect'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Source Path (e.g. /old-blog-slug)</label>
            <input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="/old-page-name"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Destination URL or Path</label>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="/new-page-name or https://site.com"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Redirect Type</label>
              <select
                value={type}
                onChange={(e) => setType(Number(e.target.value) as 301 | 302)}
                className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm bg-white"
              >
                <option value={301}>301 (Permanent)</option>
                <option value={302}>302 (Temporary)</option>
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded border-slate-300 text-solar focus:ring-solar"
                />
                Active Redirect Rule
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !source || !destination}>
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
