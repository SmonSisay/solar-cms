'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import type { LeadStatus } from '@/lib/types';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  productRef: string;
  source: string;
  status: LeadStatus;
  adminNote: string;
  createdAt: string;
}

const statusColors: Record<LeadStatus, string> = {
  new: 'bg-amber-100 text-amber-800',
  read: 'bg-blue-100 text-blue-800',
  replied: 'bg-green-100 text-green-800',
};

export default function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);

  async function updateLead(id: string, data: { status?: LeadStatus; adminNote?: string }) {
    setSaving(true);
    const res = await fetch(`/api/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    setSaving(false);

    if (json.success) {
      setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, ...json.data } : l)));
      if (selected?._id === id) setSelected({ ...selected, ...json.data });
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-cards border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-primary">Name</th>
              <th className="text-left px-4 py-3 font-medium text-primary">Phone</th>
              <th className="text-left px-4 py-3 font-medium text-primary">Source</th>
              <th className="text-left px-4 py-3 font-medium text-primary">Status</th>
              <th className="text-left px-4 py-3 font-medium text-primary">Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No leads yet.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead._id}
                  onClick={() => setSelected(lead)}
                  className={`border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${
                    selected?._id === lead._id ? 'bg-solar-tint' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-medium">{lead.name}</td>
                  <td className="px-4 py-3 text-slate-600">{lead.phone}</td>
                  <td className="px-4 py-3 text-slate-600">{lead.source}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(lead.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-cards border border-slate-200 p-6">
        {selected ? (
          <div className="space-y-4">
            <h3 className="font-semibold text-primary">{selected.name}</h3>
            <div className="space-y-1 text-sm text-slate-600">
              <p>
                <a href={`mailto:${selected.email}`} className="text-primary-lt hover:underline">
                  {selected.email}
                </a>
              </p>
              <p>
                <a href={`tel:${selected.phone}`} className="text-primary-lt hover:underline">
                  {selected.phone}
                </a>
              </p>
              {selected.productRef && <p>Product: {selected.productRef}</p>}
              <p>Source: {selected.source}</p>
              <p>Date: {formatDate(selected.createdAt)}</p>
            </div>
            {selected.message && (
              <div className="text-sm bg-slate-50 p-3 rounded-components">{selected.message}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Status</label>
              <select
                value={selected.status}
                onChange={(e) => {
                  const status = e.target.value as LeadStatus;
                  updateLead(selected._id, { status });
                }}
                disabled={saving}
                className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm"
              >
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Admin Note</label>
              <textarea
                value={selected.adminNote}
                onChange={(e) => setSelected({ ...selected, adminNote: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm"
              />
              <button
                type="button"
                onClick={() => updateLead(selected._id, { adminNote: selected.adminNote })}
                disabled={saving}
                className="mt-2 text-sm text-solar font-medium"
              >
                Save note
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Select a lead to view details.</p>
        )}
      </div>
    </div>
  );
}
