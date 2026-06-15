'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Sun, Battery, Cpu, ShieldAlert, ArrowRight } from 'lucide-react';
import type { IProduct } from '@/lib/models/Product';
import { t as getText } from '@/lib/locale';

// Create a serialized type since document properties from MongoDB aren't plain JS types
type SerializedProduct = Omit<IProduct, keyof import('mongoose').Document | 'specs'> & {
  _id: string;
  specs?: { key: string; value: string }[];
};

interface FeaturedProductsProps {
  products: SerializedProduct[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const locale = useLocale();
  const tProducts = useTranslations('products');
  const tCommon = useTranslations('common');

  if (!products || products.length === 0) {
    return null;
  }

  // Display only top 6 featured products
  const featuredList = products.slice(0, 6);

  // Render a category-specific fallback icon when no image exists
  const renderFallbackIcon = (category: string) => {
    switch (category) {
      case 'panels':
        return <Sun className="w-12 h-12 text-solar/60" />;
      case 'batteries':
        return <Battery className="w-12 h-12 text-solar/60" />;
      case 'inverters':
      case 'systems':
        return <Cpu className="w-12 h-12 text-solar/60" />;
      default:
        return <ShieldAlert className="w-12 h-12 text-solar/60" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16">
          <div className="max-w-xl text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-solar mb-3 block">
              {tProducts('title')}
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold text-primary tracking-tight ${
              locale === 'am' ? 'font-ethiopic' : 'font-sans'
            }`}>
              {tProducts('subtitle')}
            </h2>
          </div>
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-solar hover:text-solar-lt transition-colors mt-4 md:mt-0 group"
          >
            {tCommon('seeAll')}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuredList.map((product) => {
            const nameText = getText(product.name, locale);
            const shortDesc = getText(product.shortDescription, locale);
            const mainImage = product.images?.[0];
            const isOutOfStock = !product.inStock;

            // Format price: check if request-only or 0
            const displayPrice =
              product.priceOnRequest || product.price === 0
                ? tProducts('contactForPrice')
                : `${product.price.toLocaleString(locale === 'am' ? 'am-ET' : 'en-US')} ${tCommon('currency')}`;

            return (
              <motion.div
                key={product._id}
                variants={cardVariants}
                className="group flex flex-col bg-white border border-slate-100 rounded-cards overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative"
              >
                {/* Product Image Area */}
                <div className="relative aspect-[4/3] w-full bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100">
                  {mainImage ? (
                    <Image
                      src={mainImage}
                      alt={nameText}
                      fill
                      sizes="(max-w-768px) 100vw, 380px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      {renderFallbackIcon(product.category)}
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">
                        {product.brand}
                      </span>
                    </div>
                  )}

                  {/* Stock Status Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md ${
                        isOutOfStock
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-emerald-500'}`} />
                      {isOutOfStock ? tProducts('outOfStock') : tCommon('filter') === 'አጣራ' ? 'ክምችት አለ' : 'In Stock'}
                    </span>
                  </div>

                  {/* Category Tag (Top Right) */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-primary/95 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-slate-700">
                      {tProducts(`filter${product.category.charAt(0).toUpperCase() + product.category.slice(1)}`)}
                    </span>
                  </div>
                </div>

                {/* Product Info Area */}
                <div className="p-6 flex-1 flex flex-col items-start justify-between">
                  <div className="w-full text-left">
                    {/* Brand */}
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
                      {product.brand}
                    </span>

                    {/* Name */}
                    <h3 className={`text-base font-bold text-primary group-hover:text-solar transition-colors mb-2 line-clamp-1 ${
                      locale === 'am' ? 'font-ethiopic' : 'font-sans'
                    }`}>
                      {nameText}
                    </h3>

                    {/* Short Description */}
                    <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2 font-light">
                      {shortDesc}
                    </p>
                  </div>

                  {/* Price & Actions Row */}
                  <div className="w-full mt-auto">
                    <div className="flex items-baseline mb-4 justify-start">
                      <span className="text-sm font-semibold text-slate-400 mr-1.5">
                        {tCommon('filter') === 'አጣራ' ? 'ዋጋ፡' : 'Price:'}
                      </span>
                      <span className={`text-lg font-extrabold ${
                        product.priceOnRequest || product.price === 0 ? 'text-slate-600 text-sm font-semibold' : 'text-primary'
                      }`}>
                        {displayPrice}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full">
                      <Link
                        href={`/${locale}/products/${product.slug}`}
                        className="py-2.5 text-center text-xs font-bold bg-slate-50 text-primary border border-slate-200 rounded-components hover:bg-slate-100 hover:border-slate-300 transition-colors"
                      >
                        {tProducts('viewDetails')}
                      </Link>
                      <Link
                        href={`/${locale}/quote?product=${product.slug}`}
                        className="py-2.5 text-center text-xs font-bold bg-solar text-primary rounded-components hover:bg-solar-lt transition-colors"
                      >
                        {tProducts('getQuote')}
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
