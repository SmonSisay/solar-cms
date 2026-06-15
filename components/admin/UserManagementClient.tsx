'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Trash2, Edit } from 'lucide-react';

interface UserDto {
  _id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'content_manager';
  active: boolean;
  createdAt: string;
}

interface UserManagementClientProps {
  initialUsers: UserDto[];
  currentUserId: string;
}

export default function UserManagementClient({
  initialUsers,
  currentUserId,
}: UserManagementClientProps) {
  const [users, setUsers] = useState<UserDto[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor' as const,
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setForm({
      name: '',
      email: '',
      password: '',
      role: 'editor',
      active: true,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserDto) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      active: user.active,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const isEdit = !!editingUser;
    const url = isEdit
      ? `/api/admin/users/${editingUser._id}`
      : '/api/admin/users';
    const method = isEdit ? 'PUT' : 'POST';

    const payload = { ...form };
    if (isEdit && !payload.password) {
      delete (payload as any).password;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (isEdit) {
        setUsers(users.map((u) => (u._id === editingUser._id ? data.data : u)));
      } else {
        setUsers([data.data, ...users]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id === currentUserId) {
      alert('You cannot delete your own account.');
      return;
    }

    if (
      !confirm(
        'Are you sure you want to delete this user? This action is irreversible.'
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete user');
      }

      setUsers(users.filter((u) => u._id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'editor':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'content_manager':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-cards border border-slate-200 overflow-hidden p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-primary">All Users</h3>
        <Button onClick={handleOpenAddModal} variant="primary" size="sm">
          + Add User
        </Button>
      </div>

      {error && !isModalOpen && (
        <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-2.5 rounded-components text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 font-medium text-slate-700">Name</th>
              <th className="px-4 py-3 font-medium text-slate-700">Email</th>
              <th className="px-4 py-3 font-medium text-slate-700">Role</th>
              <th className="px-4 py-3 font-medium text-slate-700">Status</th>
              <th className="px-4 py-3 font-medium text-slate-700 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No administrative users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-slate-100 hover:bg-slate-50/50"
                >
                  <td className="px-4 py-3 font-medium text-primary">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getRoleBadgeClass(
                        user.role
                      )}`}
                    >
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        user.active
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(user)}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-solar text-xs font-medium px-2 py-1 rounded hover:bg-slate-100"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    {user._id !== currentUserId && (
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-red-600 text-xs font-medium px-2 py-1 rounded hover:bg-slate-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-2.5 rounded-components text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm focus:outline-none focus:border-solar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm focus:outline-none focus:border-solar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password{' '}
              {editingUser && (
                <span className="text-slate-400 font-normal">
                  (leave blank to keep current)
                </span>
              )}
            </label>
            <input
              type="password"
              required={!editingUser}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm focus:outline-none focus:border-solar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              System Role
            </label>
            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as any })
              }
              className="w-full px-3 py-2 border border-slate-300 bg-white rounded-components text-sm focus:outline-none focus:border-solar"
            >
              <option value="super_admin">Super Admin (Full Access)</option>
              <option value="admin">Admin (Manage Content & Leads)</option>
              <option value="editor">Editor (Create & Publish)</option>
              <option value="content_manager">
                Content Manager (Blogs, Pages, SEO)
              </option>
            </select>
          </div>

          {editingUser && editingUser._id !== currentUserId && (
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="active"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4 text-solar border-slate-300 rounded focus:ring-solar"
              />
              <label
                htmlFor="active"
                className="text-sm font-medium text-slate-700"
              >
                User account active
              </label>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={loading}
            >
              {loading
                ? 'Saving...'
                : editingUser
                ? 'Update User'
                : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
