'use client';

import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Award, Sun, Shield, HelpCircle } from 'lucide-react';
import type { BilingualText } from '@/lib/types';
import { t as getText } from '@/lib/locale';

interface WhyUsItem {
  title: BilingualText;
  desc: BilingualText;
  icon: string;
}

interface WhyUsProps {
  points: WhyUsItem[];
}

export default function WhyUs({ points }: WhyUsProps) {
  const locale = useLocale();
  const tHome = useTranslations('home');

  if (!points || points.length === 0) {
    return null;
  }

  // Resolve dynamic icon string to Lucide icon component
  const getIconComponent = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'award':
        return <Award className="w-8 h-8 text-solar" />;
      case 'sun':
        return <Sun className="w-8 h-8 text-solar" />;
      case 'shield':
        return <Shield className="w-8 h-8 text-solar" />;
      default:
        return <HelpCircle className="w-8 h-8 text-solar" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
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
    <section className="py-20 lg:py-28 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mb-4 ${
            locale === 'am' ? 'font-ethiopic' : 'font-sans'
          }`}>
            {tHome('whyUsTitle')}
          </h2>
          <div className="w-16 h-1 bg-solar mx-auto rounded-full" />
        </div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {points.map((point, index) => {
            const titleText = getText(point.title, locale);
            const descText = getText(point.desc, locale);

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)' }}
                className="bg-white border border-slate-100 p-8 rounded-cards shadow-sm transition-all duration-300 flex flex-col items-start"
              >
                {/* Icon Wrapper */}
                <div className="w-16 h-16 rounded-2xl bg-solar-tint flex items-center justify-center mb-6">
                  {getIconComponent(point.icon)}
                </div>

                {/* Feature Title */}
                <h3 className={`text-lg font-bold text-primary mb-3 ${
                  locale === 'am' ? 'font-ethiopic' : 'font-sans'
                }`}>
                  {titleText}
                </h3>

                {/* Feature Description */}
                <p className="text-slate-500 text-sm leading-relaxed font-light">
                  {descText}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
