import { Redirect } from '@/lib/models';
import { redirect } from 'next/navigation';
import { connectDB } from './mongodb';

export async function handleRedirect(path: string) {
  // Normalize path (ensure leading slash, strip locale prefixes if stored without locale)
  let normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Also clean trailing slash
  if (normalizedPath.endsWith('/') && normalizedPath.length > 1) {
    normalizedPath = normalizedPath.slice(0, -1);
  }

  await connectDB();
  
  // Try matching absolute path first
  let matched = await Redirect.findOne({ source: normalizedPath, active: true });
  
  // If not matched and path includes locale (e.g. /en/something), try matching without locale prefix
  if (!matched && (normalizedPath.startsWith('/en/') || normalizedPath.startsWith('/am/'))) {
    const withoutLocale = normalizedPath.substring(3);
    matched = await Redirect.findOne({ source: withoutLocale, active: true });
  }

  if (matched) {
    // Increment hit counter asynchronously (non-blocking for response)
    Redirect.updateOne({ _id: matched._id }, { $inc: { hitCount: 1 } }).exec().catch(err => {
      console.error('Failed to increment redirect hit counter:', err);
    });
    
    // Redirect to destination
    redirect(matched.destination);
  }
}
