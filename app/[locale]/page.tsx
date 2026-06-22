import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { getSettings, getProducts } from '@/lib/data';
import { t as getText } from '@/lib/locale';
import HeroSection from '@/components/home/HeroSection';
import StatsBar from '@/components/home/StatsBar';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyUs from '@/components/home/WhyUs';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://smon.com';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const [t, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'home' }),
    getSettings(),
  ]);

  const description = getText(settings.metaDescription, locale) || t('heroSubtitle');

  return {
    title: `${settings.businessName} — ${t('heroTitle')}`,
    description,
    alternates: {
      languages: { en: `/en`, am: `/am` },
      canonical: `${BASE_URL}/${locale}`,
    },
    openGraph: {
      title: `${settings.businessName} — ${t('heroTitle')}`,
      description,
      url: `${BASE_URL}/${locale}`,
      siteName: settings.businessName,
      locale: locale === 'am' ? 'am_ET' : 'en_US',
      type: 'website',
      ...(settings.heroImage ? { images: [{ url: settings.heroImage, width: 1200, height: 630 }] } : {}),
    },
  };
}

export default async function HomePage({ params: { locale } }: Props) {
  const [settings, featuredProducts] = await Promise.all([
    getSettings(),
    getProducts({ featured: true }),
  ]);

  const sections = settings.homeSections || [
    { name: 'hero', enabled: true, order: 0 },
    { name: 'stats', enabled: true, order: 1 },
    { name: 'products', enabled: true, order: 2 },
    { name: 'whyus', enabled: true, order: 3 },
  ];

  const activeSortedSections = [...sections]
    .filter((sec: { enabled: boolean }) => sec.enabled)
    .sort((a: { order: number }, b: { order: number }) => a.order - b.order);

  // LocalBusiness JSON-LD structured data for SEO rich results
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.businessName,
    description: getText(settings.metaDescription, locale) || getText(settings.tagline, locale),
    url: `${BASE_URL}/${locale}`,
    telephone: settings.phone?.[0] || '',
    email: settings.email || '',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Addis Ababa',
      addressCountry: 'ET',
      streetAddress: getText(settings.address, locale) || '',
    },
    ...(settings.logo ? { logo: settings.logo, image: settings.logo } : {}),
    ...(settings.socialLinks
      ? {
          sameAs: [
            settings.socialLinks.facebook,
            settings.socialLinks.instagram,
            settings.socialLinks.telegram,
            settings.socialLinks.youtube,
            settings.socialLinks.linkedin,
            settings.socialLinks.tiktok,
          ].filter(Boolean),
        }
      : {}),
    priceRange: '$$',
  };

  return (
    <div>
      {/* JSON-LD LocalBusiness Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {activeSortedSections.map((sec: { name: string }) => {
        switch (sec.name) {
          case 'hero':
            return (
              <HeroSection
                key="hero"
                title={settings.heroTitle}
                subtitle={settings.heroSubtitle}
                ctaText={settings.heroCTAText}
                imageUrl={settings.heroImage}
              />
            );
          case 'stats':
            return <StatsBar key="stats" stats={settings.stats} />;
          case 'products':
            return <FeaturedProducts key="products" products={featuredProducts} />;
          case 'whyus':
            return <WhyUs key="whyus" points={settings.whyUsPoints} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
