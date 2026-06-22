'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, Package, FileText, Wrench, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  products: any[];
  blogs: any[];
  services: any[];
}

export default function GlobalSearch({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (json.success) {
        setResults(json.data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => doSearch(value), 300);
  };

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const totalResults =
    (results?.products?.length ?? 0) +
    (results?.blogs?.length ?? 0) +
    (results?.services?.length ?? 0);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white/60 backdrop-blur-sm text-sm text-slate-500 hover:border-solar hover:text-solar transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline ml-2 text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
            >
              {/* Input Area */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder="Search products, blog posts, services..."
                  className="flex-1 text-sm outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
                />
                {loading && <Loader2 className="w-4 h-4 text-solar animate-spin" />}
                <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Results Area */}
              <div className="max-h-[50vh] overflow-y-auto">
                {query.length < 2 ? (
                  <div className="px-4 py-8 text-center text-sm text-slate-400">
                    Start typing to search across the entire site...
                  </div>
                ) : results && totalResults === 0 && !loading ? (
                  <div className="px-4 py-8 text-center text-sm text-slate-400">
                    No results found for &quot;{query}&quot;
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {/* Products */}
                    {results?.products && results.products.length > 0 && (
                      <div className="p-3">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
                          Products
                        </p>
                        {results.products.map((p: any) => (
                          <Link
                            key={p._id}
                            href={`/${locale}/products/${p.slug}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <Package className="w-4 h-4 text-solar shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-slate-800">
                                {p.name?.[locale] || p.name?.en}
                              </p>
                              <p className="text-[11px] text-slate-400 capitalize">{p.category}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Blog */}
                    {results?.blogs && results.blogs.length > 0 && (
                      <div className="p-3">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
                          Blog Posts
                        </p>
                        {results.blogs.map((b: any) => (
                          <Link
                            key={b._id}
                            href={`/${locale}/blog/${b.slug}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-slate-800">
                                {b.title?.[locale] || b.title?.en}
                              </p>
                              <p className="text-[11px] text-slate-400 capitalize">{b.category}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Services */}
                    {results?.services && results.services.length > 0 && (
                      <div className="p-3">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
                          Services
                        </p>
                        {results.services.map((s: any) => (
                          <Link
                            key={s._id}
                            href={`/${locale}/services`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <Wrench className="w-4 h-4 text-green-500 shrink-0" />
                            <p className="text-sm font-medium text-slate-800">
                              {s.title?.[locale] || s.title?.en}
                            </p>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 text-[10px] text-slate-400 flex justify-between">
                <span>Press ESC to close</span>
                <span>⌘K to toggle</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
