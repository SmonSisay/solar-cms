'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface WhatsAppButtonProps {
  whatsapp: string;
}

export default function WhatsAppButton({ whatsapp }: WhatsAppButtonProps) {
  const pathname = usePathname();

  // Hide on admin routes and if no number is configured
  if (!whatsapp || pathname.startsWith('/admin')) {
    return null;
  }

  const number = whatsapp.replace(/\D/g, '');

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
      {/* Outer pulsing ring */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-14 h-14 bg-[#25D366] rounded-full pointer-events-none"
      />

      {/* Main button */}
      <motion.a
        href={`https://wa.me/${number}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat with us"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-200 outline-none"
      >
        <MessageCircle className="w-7 h-7" />
      </motion.a>
    </div>
  );
}

