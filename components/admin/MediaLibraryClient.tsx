'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Upload, Trash2, Copy, FileText, ExternalLink, Folder } from 'lucide-react';

interface MediaAssetItem {
  _id: string;
  url: string;
  publicId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  folder: string;
  createdAt: string;
}

export default function MediaLibraryClient({ initialItems }: { initialItems: MediaAssetItem[] }) {
  const [items, setItems] = useState<MediaAssetItem[]>(initialItems);
  const [search, setSearch] = useState('');
  const [folderFilter, setFolderFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('general');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract unique folders
  const folders = Array.from(new Set(items.map((item) => item.folder || 'general')));
  if (!folders.includes('general')) folders.push('general');
  if (!folders.includes('products')) folders.push('products');
  if (!folders.includes('blog')) folders.push('blog');

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.fileName.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = folderFilter === 'all' || item.folder === folderFilter;
    return matchesSearch && matchesFolder;
  });

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', selectedFolder);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const json = await res.json();
        if (json.success) {
          setItems((prev) => [json.data, ...prev]);
        } else {
          alert(`Failed to upload ${file.name}: ${json.error}`);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed due to network error.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this asset? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setItems((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Media Library</h2>
          <p className="text-sm text-slate-500 mt-1">
            Upload, browse, copy URLs, and manage site media assets (Images and PDFs).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Folder & Upload controls */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-cards border border-slate-200 space-y-4">
            <h3 className="font-semibold text-primary text-sm flex items-center gap-2">
              <Folder className="w-4 h-4 text-solar" /> Folders
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setFolderFilter('all')}
                className={`w-full text-left px-3 py-2 rounded-components text-sm transition-colors ${
                  folderFilter === 'all'
                    ? 'bg-solar/10 text-solar font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Folders
              </button>
              {folders.map((f) => (
                <button
                  key={f}
                  onClick={() => setFolderFilter(f)}
                  className={`w-full text-left px-3 py-2 rounded-components text-sm transition-colors capitalize ${
                    folderFilter === f
                      ? 'bg-solar/10 text-solar font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-cards border border-slate-200 space-y-4">
            <h3 className="font-semibold text-primary text-sm">Upload Destination</h3>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Target Folder</label>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-components text-sm bg-white capitalize"
              >
                <option value="general">General</option>
                <option value="products">Products</option>
                <option value="blog">Blog</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column - File upload and gallery */}
        <div className="lg:col-span-3 space-y-6">
          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-cards p-8 text-center transition-all ${
              dragActive
                ? 'border-solar bg-solar/5 scale-[0.99]'
                : 'border-slate-300 hover:border-solar/60 bg-white'
            }`}
          >
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 font-medium">
              Drag & drop files here, or click to upload
            </p>
            <p className="text-xs text-slate-400 mt-1">JPEG, PNG, WEBP, GIF, or PDF (Max 10MB)</p>
            <input
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload-input"
              accept="image/*,application/pdf"
            />
            <label htmlFor="file-upload-input">
              <Button variant="outline" className="mt-4 pointer-events-none">
                {uploading ? 'Uploading...' : 'Select Files'}
              </Button>
            </label>
          </div>

          {/* Filter / Search Bar */}
          <div className="bg-white p-4 rounded-cards border border-slate-200">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files by name..."
              className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm"
            />
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredItems.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 text-sm">
                No files found in this folder.
              </div>
            ) : (
              filteredItems.map((item) => {
                const isPdf = item.fileType === 'application/pdf' || item.fileName.toLowerCase().endsWith('.pdf');
                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-cards border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between"
                  >
                    {/* Thumbnail preview */}
                    <div className="relative bg-slate-50 aspect-video flex items-center justify-center border-b border-slate-100 overflow-hidden">
                      {isPdf ? (
                        <FileText className="w-12 h-12 text-red-400" />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.fileName}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                        />
                      )}
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                        {formatBytes(item.fileSize)}
                      </div>
                    </div>

                    {/* Metadata and actions */}
                    <div className="p-3 space-y-2 flex-grow flex flex-col justify-between">
                      <div>
                        <p
                          className="text-xs font-semibold text-slate-700 truncate"
                          title={item.fileName}
                        >
                          {item.fileName}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">
                          {item.folder} • {isPdf ? 'PDF Document' : 'Image'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleCopyUrl(item.url, item._id)}
                          className="flex-1 py-1 px-2 hover:bg-slate-100 rounded text-slate-600 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedId === item._id ? 'Copied' : 'URL'}</span>
                        </button>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-500 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-1.5 hover:bg-red-50 rounded text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
