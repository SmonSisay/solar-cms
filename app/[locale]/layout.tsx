import { Inter, Noto_Sans_Ethiopic } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import { getSettings } from '@/lib/data';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoEthiopic = Noto_Sans_Ethiopic({
  subsets: ['ethiopic'],
  variable: '--font-ethiopic',
  display: 'swap',
});

const locales = ['en', 'am'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale)) notFound();

  const [messages, settings] = await Promise.all([getMessages(), getSettings()]);

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${notoEthiopic.variable} font-sans ${locale === 'am' ? 'font-ethiopic text-[17px]' : ''}`}>
        <NextIntlClientProvider messages={messages}>
          <Navbar businessName={settings.businessName} logo={settings.logo} />
          <main>{children}</main>
          <Footer
            businessName={settings.businessName}
            tagline={settings.tagline}
            phone={settings.phone}
            email={settings.email}
            address={settings.address}
            socialLinks={settings.socialLinks}
          />
          <WhatsAppButton whatsapp={settings.whatsapp} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
