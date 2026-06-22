import { connectDB } from './mongodb';
import {
  SiteSettings,
  Product,
  BlogPost,
  FAQ,
  Testimonial,
  TeamMember,
  Service,
  MenuLink,
} from './models';
import { escapeRegex } from './utils';

export async function getSettings() {
  await connectDB();
  let settings = await SiteSettings.findOne().lean();
  if (!settings) {
    settings = await SiteSettings.create({ businessName: 'Smon' });
  }
  return JSON.parse(JSON.stringify(settings));
}

export async function getProducts(filters: {
  category?: string;
  featured?: boolean;
  search?: string;
  inStock?: boolean;
} = {}) {
  await connectDB();
  const query: Record<string, unknown> = {};
  if (filters.category && filters.category !== 'all') query.category = filters.category;
  if (filters.featured) query.featured = true;
  if (filters.inStock) query.inStock = true;
  if (filters.search) {
    const safeSearch = escapeRegex(filters.search);
    query.$or = [
      { 'name.en': { $regex: safeSearch, $options: 'i' } },
      { 'name.am': { $regex: safeSearch, $options: 'i' } },
      { brand: { $regex: safeSearch, $options: 'i' } },
    ];
  }
  const products = await Product.find(query).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(products));
}

export async function getProductBySlug(slug: string) {
  await connectDB();
  const product = await Product.findOne({ slug }).lean();
  return product ? JSON.parse(JSON.stringify(product)) : null;
}

export async function getBlogPosts(published = true) {
  await connectDB();
  const query = published ? { published: true } : {};
  const posts = await BlogPost.find(query).sort({ publishedAt: -1 }).lean();
  return JSON.parse(JSON.stringify(posts));
}

export async function getBlogPostBySlug(slug: string) {
  await connectDB();
  const post = await BlogPost.findOne({ slug, published: true }).lean();
  return post ? JSON.parse(JSON.stringify(post)) : null;
}

export async function getFAQs() {
  await connectDB();
  const faqs = await FAQ.find({ published: true }).sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(faqs));
}

export async function getTestimonials(featured = false) {
  await connectDB();
  const query = featured ? { featured: true } : {};
  const items = await Testimonial.find(query).sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(items));
}

export async function getTeam() {
  await connectDB();
  const members = await TeamMember.find().sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(members));
}

export async function getServices() {
  await connectDB();
  const services = await Service.find().sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(services));
}

export async function getMenuLinks(location?: 'header' | 'footer') {
  await connectDB();
  const query: Record<string, any> = { published: true };
  if (location) {
    query.location = location;
  }
  const links = await MenuLink.find(query).sort({ order: 1 }).lean();
  return JSON.parse(JSON.stringify(links));
}
