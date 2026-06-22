'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, Phone, Send, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactWidgetProps {
  whatsapp?: string;
  telegram?: string;
  phone?: string;
}

export default function ContactWidget({ whatsapp, telegram, phone }: ContactWidgetProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Hide on admin panel routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  // Check if at least one contact channel is active
  if (!whatsapp && !telegram && !phone) {
    return null;
  }

  const cleanWhatsAppNumber = whatsapp ? whatsapp.replace(/\D/g, '') : '';
  const cleanTelegramUsername = telegram ? telegram.replace('@', '') : '';
  const displayPhone = phone || '';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded Actions Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-xl flex flex-col gap-2 min-w-[200px]"
          >
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Contact Us
            </p>
            
            {/* WhatsApp option */}
            {whatsapp && (
              <a
                href={`https://wa.me/${cleanWhatsAppNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-green-50 hover:text-green-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                </div>
                <span>WhatsApp Chat</span>
              </a>
            )}

            {/* Telegram option */}
            {telegram && (
              <a
                href={`https://t.me/${cleanTelegramUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#0088cc]/10 flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4 text-[#0088cc]" />
                </div>
                <span>Telegram Chat</span>
              </a>
            )}

            {/* Direct Phone Call option */}
            {displayPhone && (
              <a
                href={`tel:${displayPhone}`}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-solar/10 hover:text-solar transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-solar/10 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-solar" />
                </div>
                <span>Direct Call</span>
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main toggle button */}
      <div className="relative">
        {!isOpen && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-1 -left-1 w-16 h-16 bg-solar rounded-full pointer-events-none"
          />
        )}

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 outline-none text-white ${
            isOpen ? 'bg-slate-800' : 'bg-solar'
          }`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </motion.button>
      </div>
    </div>
  );
}
