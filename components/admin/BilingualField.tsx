'use client';

import type { BilingualText } from '@/lib/types';

interface BilingualFieldProps {
  label: string;
  value: BilingualText;
  onChange: (value: BilingualText) => void;
  multiline?: boolean;
  required?: boolean;
}

export default function BilingualField({
  label,
  value,
  onChange,
  multiline = false,
  required = false,
}: BilingualFieldProps) {
  const InputTag = multiline ? 'textarea' : 'input';

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-primary">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-slate-500 mb-1 block">English {required && '*'}</span>
          <InputTag
            value={value.en}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            required={required}
            rows={multiline ? 4 : undefined}
            className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm focus:outline-none focus:ring-2 focus:ring-solar/50"
          />
        </div>
        <div>
          <span className="text-xs text-slate-500 mb-1 block">Amharic</span>
          <InputTag
            value={value.am}
            onChange={(e) => onChange({ ...value, am: e.target.value })}
            rows={multiline ? 4 : undefined}
            className="w-full px-3 py-2 border border-slate-300 rounded-components text-sm font-ethiopic focus:outline-none focus:ring-2 focus:ring-solar/50"
          />
        </div>
      </div>
    </div>
  );
}
