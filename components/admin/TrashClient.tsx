'use client';

import { useState } from 'react';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';

interface TrashItem {
  _id: string;
  module: string;
  name: string;
  deletedAt: string;
}

export default function TrashClient({ initialItems }: { initialItems: TrashItem[] }) {
  const [items, setItems] = useState<TrashItem[]>(initialItems);
  const [working, setWorking] = useState<string | null>(null);

  const handleRestore = async (item: TrashItem) => {
    setWorking(item._id);
    try {
      const res = await fetch('/api/admin/trash', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: item.module, id: item._id }),
      });
      const json = await res.json();
      if (json.success) {
        setItems((prev) => prev.filter((i) => i._id !== item._id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setWorking(null);
    }
  };

  const handlePermanentDelete = async (item: TrashItem) => {
    if (!confirm(`Permanently delete "${item.name}"? This cannot be undone.`)) return;
    setWorking(item._id);
    try {
      const res = await fetch(
        `/api/admin/trash?module=${item.module}&id=${item._id}`,
        { method: 'DELETE' }
      );
      const json = await res.json();
      if (json.success) {
        setItems((prev) => prev.filter((i) => i._id !== item._id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setWorking(null);
    }
  };

  const moduleColor: Record<string, string> = {
    products: 'bg-solar/10 text-solar',
    blog: 'bg-blue-100 text-blue-700',
    pages: 'bg-purple-100 text-purple-700',
    services: 'bg-green-100 text-green-700',
    faq: 'bg-amber-100 text-amber-700',
    testimonials: 'bg-pink-100 text-pink-700',
    team: 'bg-cyan-100 text-cyan-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Trash2 className="w-6 h-6 text-rose-500" /> Trash
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {items.length} deleted items. Restore or permanently remove content.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-cards border border-slate-200 p-12 text-center">
          <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Trash is empty</p>
          <p className="text-sm text-slate-400 mt-1">All deleted items will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-cards border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left font-semibold text-slate-600 text-xs uppercase tracking-wider">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Module</th>
                <th className="px-6 py-3">Deleted</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{item.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${moduleColor[item.module] || 'bg-slate-100 text-slate-600'}`}>
                      {item.module}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(item.deletedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleRestore(item)}
                        disabled={working === item._id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 transition-colors disabled:opacity-50"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Restore
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(item)}
                        disabled={working === item._id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
