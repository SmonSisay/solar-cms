'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    setDeleting(true);
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setDeleting(false);

    if (res.ok) {
      router.refresh();
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
