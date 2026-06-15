'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Search, ChevronDown } from 'lucide-react';
import DOMPurify from 'isomorphic-dompurify';
import { t as getText } from '@/lib/locale';
import { cn } from '@/lib/utils';

interface FAQItem {
  _id: string;
  question: { en: string; am: string };
  answer: { en: string; am: string };
  category: string;
}

interface FAQClientProps {
  faqs: FAQItem[];
}

export default function FAQClient({ faqs }: FAQClientProps) {
  const locale = useLocale();
  const t = useTranslations('faq');
  const tCommon = useTranslations('common');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = ['all', 'general', 'installation', 'cost', 'warranty', 'maintenance', 'technical'];

  const filteredFaqs = faqs.filter((faq) => {
    const question = getText(faq.question, locale).toLowerCase();
    const answer = getText(faq.answer, locale).toLowerCase();
    const matchesSearch =
      question.includes(searchQuery.toLowerCase()) ||
      answer.includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  function toggleFaq(id: string) {
    setOpenId(openId === id ? null : id);
  }

  return (
    <div className="space-y-8">
      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 p-4 rounded-cards border border-slate-100">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-components text-sm focus:outline-none focus:ring-2 focus:ring-solar/50 bg-white"
          />
        </div>

        {/* Categories scroll area */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border',
                selectedCategory === cat
                  ? 'bg-solar text-primary border-solar'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              )}
            >
              {t(`categories.${cat}`)}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      {filteredFaqs.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-cards">
          <p className="text-slate-500 text-sm">{tCommon('notFound')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq._id;
            const cleanAnswer = DOMPurify.sanitize(getText(faq.answer, locale));

            return (
              <div
                key={faq._id}
                className="bg-white border border-slate-100 rounded-cards overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => toggleFaq(faq._id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                >
                  <h3 className={cn(
                    'font-bold text-primary transition-colors text-base md:text-lg',
                    isOpen && 'text-solar',
                    locale === 'am' ? 'font-ethiopic' : 'font-sans'
                  )}>
                    {getText(faq.question, locale)}
                  </h3>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0',
                      isOpen && 'transform rotate-180 text-solar'
                    )}
                  />
                </button>

                <div
                  className={cn(
                    'transition-all duration-300 ease-in-out overflow-hidden',
                    isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                  )}
                >
                  <div
                    className={cn(
                      'px-6 pb-6 pt-2 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-50',
                      locale === 'am' ? 'font-ethiopic leading-loose' : 'font-sans'
                    )}
                    dangerouslySetInnerHTML={{ __html: cleanAnswer }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
