'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeletePageButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete page "${title}"? This will move it to the trash.`)) return;

    setDeleting(true);
    const res = await fetch(`/api/admin/pages/${id}`, { method: 'DELETE' });
    setDeleting(false);

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to delete page');
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-500 hover:underline text-sm disabled:opacity-50"
    >
      {deleting ? '...' : 'Delete'}
    </button>
  );
}
