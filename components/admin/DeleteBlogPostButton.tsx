'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';

export default function DeleteBlogPostButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the blog post "${title}"?`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete blog post');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting the post');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={deleting}
      className="flex items-center gap-1.5 h-8 text-red-600 hover:text-red-700 hover:bg-red-50/50 border-slate-200"
    >
      <Trash2 className="h-3.5 w-3.5" />
      {deleting ? 'Deleting...' : 'Delete'}
    </Button>
  );
}
