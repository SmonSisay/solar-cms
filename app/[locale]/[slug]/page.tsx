import { notFound } from 'next/navigation';
import Image from 'next/image';
import { connectDB } from '@/lib/mongodb';
import { Page } from '@/lib/models';
import { handleRedirect } from '@/lib/redirects';
import type { Metadata } from 'next';

interface DynamicPageProps {
  params: {
    locale: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {
  await connectDB();
  const page = await Page.findOne({
    slug: params.slug,
    status: 'published',
    deletedAt: null,
  }).lean();

  if (!page) return {};

  const title = (params.locale === 'am' ? page.metaTitle?.am || page.title.am : page.metaTitle?.en || page.title.en) || '';
  const description = (params.locale === 'am' ? page.metaDescription?.am : page.metaDescription?.en) || '';

  return {
    title: `${title} | Smon Solar`,
    description,
  };
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const { locale, slug } = params;
  await connectDB();

  const page = await Page.findOne({
    slug,
    status: 'published',
    deletedAt: null,
  }).lean();

  if (!page) {
    await handleRedirect(`/${slug}`);
    notFound();
  }

  const title = locale === 'am' ? page.title.am || page.title.en : page.title.en;
  const content = locale === 'am' ? page.content.am || page.content.en : page.content.en;

  return (
    <article className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {page.featuredImage && (
          <div className="relative h-64 sm:h-96 w-full">
            <Image
              src={page.featuredImage}
              alt={title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        )}
        <div className="p-8 sm:p-12">
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h1>
            <div className="mt-4 h-1 w-20 bg-solar rounded"></div>
          </header>
          
          <div className="prose max-w-none prose-slate prose-headings:text-slate-900 prose-a:text-solar hover:prose-a:text-solar-lt transition-colors">
            {content.split('\n').map((paragraph, index) => (
              <p key={index} className="text-slate-600 leading-relaxed mb-6 font-sans">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
