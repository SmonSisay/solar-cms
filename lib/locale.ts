import type { BilingualText } from './types';

export function t(text: BilingualText | undefined, locale: string): string {
  if (!text) return '';
  return locale === 'am' && text.am ? text.am : text.en;
}
