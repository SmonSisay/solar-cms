'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import type { LeadStatus } from '@/lib/types';
import { Calendar, User as UserIcon, MessageSquare, Plus, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LeadNote {
  text: string;
  author: string;
  createdAt: string;
}

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
  notes: LeadNote[];
  followUpDate?: string;
  assignedUser?: {
    _id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
}

const statusColors: Record<LeadStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-amber-100 text-amber-800',
  qualified: 'bg-purple-100 text-purple-800',
  won: 'bg-green-100 text-green-800',
  lost: 'bg-rose-100 text-rose-800',
};

export default function LeadsTable({
  initialLeads,
  users,
}: {
  initialLeads: Lead[];
  users: AdminUser[];
}) {
  const [leads, setLeads] = useState(initialLeads);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  async function updateLeadField(id: string, data: any) {
    setSaving(true);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setLeads((prev) =>
          prev.map((l) => (l._id === id ? { ...l, ...json.data } : l))
        );
        if (selected?._id === id) {
          setSelected({ ...selected, ...json.data });
        }
        setNewNoteText('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Table list view */}
      <div className="lg:col-span-2 bg-white rounded-cards border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left font-medium text-primary">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Assignee</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Follow Up</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  No leads yet.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead._id}
                  onClick={() => setSelected(lead)}
                  className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                    selected?._id === lead._id ? 'bg-solar/5 font-medium' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-slate-800">{lead.name}</td>
                  <td className="px-4 py-3 text-slate-600">{lead.phone}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {lead.assignedUser ? (
                      <span className="flex items-center gap-1">
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        {lead.assignedUser.name}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        statusColors[lead.status]
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {lead.followUpDate ? (
                      <span className="flex items-center gap-1 text-solar text-xs font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(lead.followUpDate).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{formatDate(lead.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Sidebar Detail Card */}
      <div className="bg-white rounded-cards border border-slate-200 p-6 space-y-6">
        {selected ? (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg text-primary">{selected.name}</h3>
              <p className="text-xs text-slate-400">Created: {formatDate(selected.createdAt)}</p>
            </div>

            <div className="space-y-2 text-sm text-slate-600 border-t border-b border-slate-100 py-3">
              <p className="flex justify-between">
                <span className="font-medium text-slate-400">Email:</span>
                <a href={`mailto:${selected.email}`} className="text-solar hover:underline">
                  {selected.email}
                </a>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-slate-400">Phone:</span>
                <a href={`tel:${selected.phone}`} className="text-solar hover:underline">
                  {selected.phone}
                </a>
              </p>
              {selected.productRef && (
                <p className="flex justify-between">
                  <span className="font-medium text-slate-400">Interest:</span>
                  <span className="font-medium text-slate-800">{selected.productRef}</span>
                </p>
              )}
              <p className="flex justify-between">
                <span className="font-medium text-slate-400">Source:</span>
                <span className="capitalize">{selected.source}</span>
              </p>
            </div>

            {selected.message && (
              <div className="bg-slate-50 p-3 rounded-components text-slate-700 text-sm">
                <p className="font-semibold text-xs text-slate-400 mb-1">Message:</p>
                {selected.message}
              </div>
            )}

            {/* Quick Actions (Status, Assignee, Follow-up) */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  value={selected.status}
                  onChange={(e) => updateLeadField(selected._id, { status: e.target.value })}
                  disabled={saving}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-components text-sm bg-white"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Assign To
                </label>
                <select
                  value={selected.assignedUser?._id || 'unassigned'}
                  onChange={(e) => updateLeadField(selected._id, { assignedUser: e.target.value })}
                  disabled={saving}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-components text-sm bg-white"
                >
                  <option value="unassigned">Unassigned</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Follow Up Date
                </label>
                <input
                  type="date"
                  value={selected.followUpDate ? selected.followUpDate.split('T')[0] : ''}
                  onChange={(e) => updateLeadField(selected._id, { followUpDate: e.target.value })}
                  disabled={saving}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-components text-sm"
                />
              </div>
            </div>

            {/* Chronological Notes section */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="font-semibold text-sm text-primary flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-slate-400" /> Interaction History
              </h4>

              {/* Notes List */}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {selected.notes && selected.notes.length > 0 ? (
                  selected.notes.map((note, idx) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded text-xs space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-slate-600">{note.author}</span>
                        <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-700">{note.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No history log records.</p>
                )}
              </div>

              {/* Add Note form */}
              <div className="flex gap-2">
                <input
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Log details (e.g. called client)..."
                  className="flex-1 px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                />
                <Button
                  onClick={() => updateLeadField(selected._id, { newNote: newNoteText })}
                  disabled={saving || !newNoteText}
                  className="py-1 px-3 text-xs"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-12">
            Select a lead from the list to view profile, notes, and assign status.
          </p>
        )}
      </div>
    </div>
  );
}
