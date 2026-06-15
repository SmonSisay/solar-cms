'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { cn } from '@/lib/utils';

interface NavbarProps {
  businessName: string;
  logo?: string;
}

export default function Navbar({ businessName, logo }: NavbarProps) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = ['products', 'services', 'about', 'blog', 'faq', 'contact'] as const;

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 transition-colors duration-300',
        scrolled || !isHome ? 'bg-primary shadow-sm' : 'bg-primary/90 backdrop-blur-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="flex items-center gap-2 text-solar font-bold text-xl">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt={businessName} className="h-8 w-auto" />
            ) : null}
            {businessName}
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((key) => (
              <Link
                key={key}
                href={`/${locale}/${key}`}
                className={cn(
                  'text-sm transition-colors',
                  pathname.includes(`/${key}`)
                    ? 'text-solar underline underline-offset-4'
                    : 'text-slate-300 hover:text-white'
                )}
              >
                {t(key)}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href={`/${locale}/quote`}
              className="bg-solar text-primary px-4 py-2 rounded-components text-sm font-semibold hover:bg-solar-lt transition-colors"
            >
              {t('getQuote')}
            </Link>
          </div>

          <button
            className="lg:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden pb-4 space-y-2">
            {navLinks.map((key) => (
              <Link
                key={key}
                href={`/${locale}/${key}`}
                onClick={() => setOpen(false)}
                className="block py-2 text-slate-300 hover:text-solar text-sm"
              >
                {t(key)}
              </Link>
            ))}
            <div className="flex items-center gap-4 pt-2">
              <LanguageSwitcher />
              <Link
                href={`/${locale}/quote`}
                className="bg-solar text-primary px-4 py-2 rounded-components text-sm font-semibold"
              >
                {t('getQuote')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
