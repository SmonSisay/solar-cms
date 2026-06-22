'use client';

import { useState } from 'react';

interface ActivityLogItem {
  _id: string;
  userName: string;
  userEmail: string;
  action: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'restore' | 'publish' | 'settings_change';
  module: string;
  targetName?: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}

export default function ActivityLogsClient({ initialItems }: { initialItems: ActivityLogItem[] }) {
  const [items] = useState<ActivityLogItem[]>(initialItems);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      item.userName.toLowerCase().includes(search.toLowerCase()) ||
      item.module.toLowerCase().includes(search.toLowerCase()) ||
      (item.details && item.details.toLowerCase().includes(search.toLowerCase()));

    const matchesAction = actionFilter === 'all' || item.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'login':
      case 'publish':
      case 'restore':
        return 'bg-green-100 text-green-700';
      case 'create':
        return 'bg-blue-100 text-blue-700';
      case 'update':
      case 'settings_change':
        return 'bg-amber-100 text-amber-700';
      case 'delete':
        return 'bg-red-100 text-red-700';
      case 'logout':
        return 'bg-slate-100 text-slate-600';
      default:
        return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Activity Audit Logs</h2>
        <p className="text-sm text-slate-500 mt-1">
          Monitor administrative changes, logins, and settings updates.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-cards border border-slate-200">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by admin, module, or details..."
          className="w-full sm:max-w-xs px-3 py-2 border border-slate-300 rounded-components text-sm"
        />

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full sm:w-44 px-3 py-2 border border-slate-300 rounded-components text-sm bg-white"
          >
            <option value="all">All Actions</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="publish">Publish</option>
            <option value="settings_change">Settings Change</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-cards border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Administrator</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Module</th>
                <th className="px-6 py-3">Details / Target</th>
                <th className="px-6 py-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No activity logs match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{item.userName}</div>
                      <div className="text-xs text-slate-400">{item.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${getActionBadgeColor(
                          item.action
                        )}`}
                      >
                        {item.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium capitalize">
                      {item.module}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {item.targetName && (
                        <span className="font-semibold text-slate-700 mr-1.5">{item.targetName}</span>
                      )}
                      <span>{item.details}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-400">
                      {item.ipAddress || 'unknown'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
