export interface BilingualText {
  en: string;
  am: string;
}

export type ProductCategory =
  | 'panels'
  | 'inverters'
  | 'batteries'
  | 'accessories'
  | 'systems'
  | 'other';

export type FAQCategory =
  | 'general'
  | 'installation'
  | 'cost'
  | 'warranty'
  | 'maintenance'
  | 'technical';

export type LeadStatus = 'new' | 'read' | 'replied';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
