'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const otherLocale = locale === 'en' ? 'am' : 'en';
  const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <Link
      href={newPath}
      className="text-solar text-sm font-medium hover:text-solar-lt transition-colors"
    >
      {locale === 'en' ? 'አማርኛ' : 'English'}
    </Link>
  );
}
