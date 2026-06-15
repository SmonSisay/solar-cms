import { getTranslations } from 'next-intl/server';

export default async function ProductsPage() {
  const t = await getTranslations('products');
  return (
    <div style={{ padding: '40px' }}>
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
    </div>
  );
}
