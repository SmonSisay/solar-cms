'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Phone, Mail } from 'lucide-react';
import type { BilingualText } from '@/lib/types';
import { t as getText } from '@/lib/locale';

interface FooterProps {
  businessName: string;
  tagline: BilingualText;
  phone: string[];
  email: string;
  address: BilingualText;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    telegram?: string;
    youtube?: string;
  };
}

export default function Footer({ businessName, tagline, phone, email, address, socialLinks }: FooterProps) {
  const locale = useLocale();
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');

  const links = ['products', 'services', 'about', 'blog', 'faq', 'contact'] as const;

  return (
    <footer className="bg-primary text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <p className="text-solar font-bold text-xl mb-2">{businessName}</p>
            <p className="text-sm leading-relaxed">{getText(tagline, locale) || t('tagline')}</p>
            <div className="flex gap-3 mt-4">
              {socialLinks?.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-solar">FB</a>
              )}
              {socialLinks?.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-solar">IG</a>
              )}
              {socialLinks?.telegram && (
                <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-solar">TG</a>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              {links.map((key) => (
                <li key={key}>
                  <Link href={`/${locale}/${key}`} className="text-sm hover:text-solar transition-colors">
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">{t('productsCol')}</h4>
            <ul className="space-y-2 text-sm">
              {['panels', 'inverters', 'batteries', 'accessories'].map((cat) => (
                <li key={cat}>
                  <Link href={`/${locale}/products?category=${cat}`} className="hover:text-solar capitalize transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">{t('contactCol')}</h4>
            <ul className="space-y-2 text-sm">
              {phone.map((p) => (
                <li key={p}>
                  <a href={`tel:${p}`} className="flex items-center gap-2 hover:text-solar">
                    <Phone className="w-3.5 h-3.5" /> {p}
                  </a>
                </li>
              ))}
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-solar">
                    <Mail className="w-3.5 h-3.5" /> {email}
                  </a>
                </li>
              )}
              {getText(address, locale) && (
                <li className="leading-relaxed">{getText(address, locale)}</li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-md mt-8 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {businessName}. {t('rights')}
        </div>
      </div>
    </footer>
  );
}
