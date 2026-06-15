import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { getSettings, getProducts } from '@/lib/data';
import HeroSection from '@/components/home/HeroSection';
import StatsBar from '@/components/home/StatsBar';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import WhyUs from '@/components/home/WhyUs';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'home' });
  return {
    title: `Smon Solar — ${t('heroTitle')}`,
    description: t('heroSubtitle'),
  };
}

export default async function HomePage() {
  const [settings, featuredProducts] = await Promise.all([
    getSettings(),
    getProducts({ featured: true }),
  ]);

  return (
    <div>
      <HeroSection
        title={settings.heroTitle}
        subtitle={settings.heroSubtitle}
        ctaText={settings.heroCTAText}
        imageUrl={settings.heroImage}
      />

      <StatsBar stats={settings.stats} />

      <FeaturedProducts products={featuredProducts} />

      <WhyUs points={settings.whyUsPoints} />
    </div>
  );
}
