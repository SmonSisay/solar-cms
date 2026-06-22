import { connectDB } from '@/lib/mongodb';
import { Product, BlogPost, Service, Page } from '@/lib/models';
import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smon.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const [products, posts, services, pages] = await Promise.all([
    Product.find().select('slug updatedAt').lean(),
    BlogPost.find({ published: true }).select('slug updatedAt').lean(),
    Service.find().select('_id updatedAt').lean(),
    Page.find({ status: 'published', deletedAt: null }).select('slug updatedAt').lean(),
  ]);

  const locales = ['en', 'am'];

  const staticPages = [
    '',
    '/products',
    '/services',
    '/about',
    '/blog',
    '/faq',
    '/contact',
    '/quote',
    '/calculator',
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
      });
    }
  }

  // Product pages
  for (const product of products) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/products/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // Blog posts
  for (const post of posts) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }

  // Dynamic pages
  for (const page of pages) {
    for (const locale of locales) {
      entries.push({
        url: `${BASE_URL}/${locale}/${page.slug}`,
        lastModified: page.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
  }

  return entries;
}
