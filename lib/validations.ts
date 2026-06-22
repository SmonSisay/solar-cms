import { z } from 'zod';

export const bilingualSchema = z.object({
  en: z.string().min(1, 'English text is required'),
  am: z.string().optional().default(''),
});

export const optionalBilingualSchema = z.object({
  en: z.string().optional().default(''),
  am: z.string().optional().default(''),
});

export const siteSettingsSchema = z.object({
  businessName: z.string().min(1),
  tagline: optionalBilingualSchema,
  phone: z.array(z.string()).default([]),
  whatsapp: z.string().optional().default(''),
  email: z.union([z.string().email(), z.literal('')]).default(''),
  address: optionalBilingualSchema,
  mapEmbedUrl: z.string().optional().default(''),
  workingHours: optionalBilingualSchema,
  logo: z.string().optional().default(''),
  favicon: z.string().optional().default(''),
  socialLinks: z
    .object({
      facebook: z.string().optional().default(''),
      instagram: z.string().optional().default(''),
      telegram: z.string().optional().default(''),
      youtube: z.string().optional().default(''),
      tiktok: z.string().optional().default(''),
      linkedin: z.string().optional().default(''),
    })
    .optional(),
  heroTitle: optionalBilingualSchema,
  heroSubtitle: optionalBilingualSchema,
  heroCTAText: optionalBilingualSchema,
  heroImage: z.string().optional().default(''),
  stats: z
    .array(
      z.object({
        label: optionalBilingualSchema,
        value: z.string(),
      })
    )
    .optional()
    .default([]),
  whyUsPoints: z
    .array(
      z.object({
        title: optionalBilingualSchema,
        desc: optionalBilingualSchema,
        icon: z.string().optional().default(''),
      })
    )
    .optional()
    .default([]),
  certifications: z
    .array(z.object({ name: z.string(), logo: z.string().optional().default('') }))
    .optional()
    .default([]),
  partnerLogos: z.array(z.string()).optional().default([]),
  metaDescription: optionalBilingualSchema,
});

export const productSchema = z.object({
  name: bilingualSchema,
  slug: z.string().optional(),
  shortDescription: optionalBilingualSchema,
  description: optionalBilingualSchema,
  category: z
    .enum(['panels', 'inverters', 'batteries', 'accessories', 'systems', 'other'])
    .default('other'),
  subcategory: z.string().optional().default(''),
  brand: z.string().optional().default(''),
  price: z.number().min(0).default(0),
  priceOnRequest: z.boolean().default(false),
  images: z.array(z.string()).optional().default([]),
  specs: z
    .array(z.object({ key: z.string(), value: z.string() }))
    .optional()
    .default([]),
  datasheet: z.string().optional().default(''),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  metaDescription: optionalBilingualSchema,
});

export const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  message: z.string().optional().default(''),
  productRef: z.string().optional().default(''),
  source: z.string().default('quote'),
});

export const leadUpdateSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'won', 'lost']).optional(),
  adminNote: z.string().optional(),
  followUpDate: z.string().nullable().optional(),
  assignedUser: z.string().nullable().optional(),
  notes: z.array(z.object({
    text: z.string(),
    author: z.string(),
    createdAt: z.string().optional(),
  })).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().default(''),
  subject: z.string().min(2),
  message: z.string().min(10),
});

export const blogPostSchema = z.object({
  title: bilingualSchema,
  slug: z.string().optional(),
  excerpt: optionalBilingualSchema,
  content: optionalBilingualSchema,
  coverImage: z.string().optional().default(''),
  category: z.string().default('general'),
  author: z.string().default('Smon Team'),
  tags: z.array(z.string()).optional().default([]),
  seoTitle: optionalBilingualSchema,
  seoDescription: optionalBilingualSchema,
  published: z.boolean().default(false),
  publishedAt: z.string().nullable().optional(),
});

export const faqSchema = z.object({
  question: bilingualSchema,
  answer: bilingualSchema,
  category: z
    .enum(['general', 'installation', 'cost', 'warranty', 'maintenance', 'technical'])
    .default('general'),
  order: z.number().default(0),
  published: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  author: bilingualSchema,
  location: z.string().default(''),
  text: bilingualSchema,
  rating: z.number().min(1).max(5).default(5),
  avatar: z.string().optional().default(''),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

export const teamMemberSchema = z.object({
  name: z.string().min(1),
  role: bilingualSchema,
  bio: optionalBilingualSchema,
  photo: z.string().optional().default(''),
  order: z.number().default(0),
});

export const serviceSchema = z.object({
  title: bilingualSchema,
  description: optionalBilingualSchema,
  icon: z.string().default('sun'),
  features: z.array(optionalBilingualSchema).optional().default([]),
  order: z.number().default(0),
});

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  role: z.enum(['super_admin', 'admin', 'editor', 'content_manager']),
  active: z.boolean().default(true),
});

export const pageSchema = z.object({
  title: bilingualSchema,
  slug: z.string().optional(),
  content: optionalBilingualSchema,
  featuredImage: z.string().optional().default(''),
  status: z.enum(['draft', 'published', 'scheduled', 'archived']).default('draft'),
  publishedAt: z.string().nullable().optional(),
  metaTitle: optionalBilingualSchema,
  metaDescription: optionalBilingualSchema,
  keywords: optionalBilingualSchema,
});

export const menuLinkSchema = z.object({
  label: bilingualSchema,
  url: z.string().min(1, 'URL is required'),
  location: z.enum(['header', 'footer']),
  order: z.number().default(0),
  published: z.boolean().default(true),
  parentId: z.string().optional().nullable(),
});

export const redirectSchema = z.object({
  source: z.string().min(1, 'Source path is required'),
  destination: z.string().min(1, 'Destination path is required'),
  type: z.union([z.literal(301), z.literal(302)]).default(301),
  active: z.boolean().default(true),
});

export const projectSchema = z.object({
  name: bilingualSchema,
  slug: z.string().optional(),
  clientName: z.string().optional().default(''),
  location: optionalBilingualSchema,
  capacity: z.string().optional().default(''),
  description: optionalBilingualSchema,
  completionDate: z.string().nullable().optional(),
  images: z.array(z.string()).optional().default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.number().default(0),
});

export const searchQuerySchema = z.object({
  q: z.string().min(1, 'Search query is required'),
  limit: z.number().min(1).max(50).default(10),
});
