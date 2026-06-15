'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import type { BilingualText } from '@/lib/types';
import { t as getText } from '@/lib/locale';

interface StatItem {
  label: BilingualText;
  value: string;
}

interface StatsBarProps {
  stats: StatItem[];
}

export default function StatsBar({ stats }: StatsBarProps) {
  const locale = useLocale();

  if (!stats || stats.length === 0) {
    return null;
  }

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for individual stat cards
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="bg-white rounded-cards shadow-xl border border-slate-100 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y-0 divide-x-0 md:divide-x divide-slate-100"
      >
        {stats.map((stat, index) => {
          const labelText = getText(stat.label, locale);
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center px-2 py-4 md:py-2"
            >
              {/* Stat Value */}
              <span className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mb-2">
                <span className="text-solar">{stat.value.replace(/[^0-9.]/g, '')}</span>
                {stat.value.replace(/[0-9.]/g, '')}
              </span>

              {/* Stat Label */}
              <span className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider max-w-[160px]">
                {labelText}
              </span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
