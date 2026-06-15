import { getTranslations } from 'next-intl/server';

export default async function ServicesPage() {
  const t = await getTranslations('services');
  return (
    <div style={{ padding: '40px' }}>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
    </div>
  );
}
