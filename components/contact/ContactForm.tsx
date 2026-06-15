'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { User, Mail, Phone, FileText, Send } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export default function ContactForm() {
  const t = useTranslations('contact');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      const json = await res.json();
      setSubmitting(false);

      if (json.success) {
        setStatus({ type: 'success', text: t('success') });
        setName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      } else {
        setStatus({ type: 'error', text: json.error || t('error') });
      }
    } catch {
      setSubmitting(false);
      setStatus({ type: 'error', text: t('error') });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 md:p-8 rounded-cards border border-slate-200 shadow-sm text-left animate-fade-in">
      {status && (
        <div
          className={cn(
            'px-4 py-3 rounded-components text-sm font-semibold border transition-all duration-200',
            status.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-red-50 text-red-700 border-red-200'
          )}
        >
          {status.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('name')}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={submitting}
          icon={<User className="w-4 h-4" />}
          placeholder="Abebe Bikila"
        />

        <Input
          label={t('email')}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          icon={<Mail className="w-4 h-4" />}
          placeholder="abebe@example.com"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('phone')}
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={submitting}
          icon={<Phone className="w-4 h-4" />}
          placeholder="+251 911 00 00 00"
        />

        <Input
          label={t('subject')}
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={submitting}
          icon={<FileText className="w-4 h-4" />}
          placeholder="Inquiry about solar panels"
        />
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-semibold tracking-wider text-primary uppercase select-none">
          {t('message')}
        </label>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={submitting}
          placeholder="Write your message here..."
          className="w-full p-4 text-sm bg-white border border-slate-300 rounded-components outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed transition-all duration-200 font-sans"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-solar text-primary py-3 rounded-components font-bold hover:bg-solar-lt transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      >
        {submitting ? (
          <span>{t('sending')}</span>
        ) : (
          <>
            <span>{t('send')}</span>
            <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
