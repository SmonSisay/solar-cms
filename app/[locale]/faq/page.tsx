import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { getFAQs } from '@/lib/data';
import FAQClient from '@/components/faq/FAQClient';
import { t as getText } from '@/lib/locale';

interface Props {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'faq' });
  return {
    title: `${t('title')} | Smon Solar`,
    description: t('subtitle'),
    alternates: {
      languages: {
        en: `/en/faq`,
        am: `/am/faq`,
      },
    },
  };
}

export default async function FAQPage({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'faq' });
  const faqs = await getFAQs();

  // Construct structured data for Google FAQ Rich Snippets
  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq: any) => ({
      '@type': 'Question',
      name: getText(faq.question, locale),
      acceptedAnswer: {
        '@type': 'Answer',
        text: getText(faq.answer, locale).replace(/<[^>]*>/g, ''), // strip HTML tags for schema plain text
      },
    })),
  };

  return (
    <main className="min-h-screen bg-surface py-16 md:py-24">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-solar mb-3 block">
            {locale === 'en' ? 'Help Center' : 'የእገዛ ማዕከል'}
          </span>
          <h1 className={`text-3xl md:text-5xl font-extrabold text-primary tracking-tight mb-4 ${
            locale === 'am' ? 'font-ethiopic' : 'font-sans'
          }`}>
            {t('title')}
          </h1>
          <p className="text-slate-500 text-lg font-light leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Client Accordion / Search Area */}
        <FAQClient faqs={faqs} />
      </div>
    </main>
  );
}

