'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { BilingualText } from '@/lib/types';
import { t as getText } from '@/lib/locale';

interface HeroSectionProps {
  title: BilingualText;
  subtitle: BilingualText;
  ctaText: BilingualText;
  imageUrl?: string;
}

export default function HeroSection({ title, subtitle, ctaText, imageUrl }: HeroSectionProps) {
  const locale = useLocale();
  const tHome = useTranslations('home');

  const resolvedTitle = getText(title, locale);
  const resolvedSubtitle = getText(subtitle, locale);
  const resolvedCtaText = getText(ctaText, locale) || tHome('heroCTA');

  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  // Stagger animation children
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="relative bg-primary overflow-hidden py-20 lg:py-28 min-h-[85vh] flex items-center">
      {/* Background visual accents */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-solar/15 blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-eco/10 blur-[120px]" />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero text side */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col text-left"
          >
            {/* Tagline Badge */}
            <motion.div variants={itemVariants} className="inline-flex mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-solar/10 text-solar border border-solar/20">
                <span className="w-2 h-2 rounded-full bg-solar animate-ping" />
                {tHome('statsWarranty')} — 10 {locale === 'en' ? 'Years' : 'ዓመታት'}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className={`text-white font-bold leading-tight tracking-tight mb-6 text-4xl sm:text-5xl lg:text-6xl ${
                locale === 'am' ? 'font-ethiopic leading-normal' : 'font-sans'
              }`}
            >
              {resolvedTitle}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-slate-300 text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl font-light"
            >
              {resolvedSubtitle}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 items-start"
            >
              <Link
                href={`/${locale}/quote`}
                className="w-full sm:w-auto px-8 py-3.5 bg-solar text-primary font-bold text-center rounded-components shadow-lg hover:bg-solar-lt transition-all duration-300 hover:shadow-solar/20 hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                {resolvedCtaText}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={`/${locale}/products`}
                className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-slate-400 text-white font-semibold text-center rounded-components hover:border-solar hover:text-solar transition-colors duration-300 flex items-center justify-center"
              >
                {tHome('heroSecondary')}
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero image side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 flex justify-center items-center relative"
          >
            <div className="relative w-full aspect-[4/3] max-w-lg rounded-cards overflow-hidden shadow-2xl border border-slate-700 bg-slate-800 flex items-center justify-center">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={resolvedTitle}
                  fill
                  priority
                  sizes="(max-w-768px) 100vw, 500px"
                  className="object-cover"
                />
              ) : (
                // Beautiful abstract fallback vector representing solar panel array
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary to-slate-900 flex flex-col items-center justify-center p-8 overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
                  <svg
                    className="w-24 h-24 text-solar/80 mb-4 animate-pulse"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 5a7 7 0 100 14 7 7 0 000-14z"
                    />
                  </svg>
                  <p className="text-solar text-sm font-semibold tracking-widest uppercase">
                    SMON SOLAR ENERGY
                  </p>
                  <p className="text-slate-400 text-xs mt-1 text-center max-w-xs">
                    Clean, reliable, and sustainable power installations in Addis Ababa.
                  </p>
                </div>
              )}
            </div>

            {/* Floating decoration cards */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white border border-slate-100 rounded-components p-4 shadow-xl hidden sm:flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-eco/10 flex items-center justify-center text-eco">
                ✔
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  {locale === 'en' ? 'Quality Guarantee' : 'የጥራት ዋስትና'}
                </p>
                <p className="text-sm font-bold text-primary">
                  {locale === 'en' ? 'Certified Tier-1' : 'የተረጋገጠ ቲየር-1'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
