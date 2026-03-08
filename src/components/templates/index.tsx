'use client';
import { useInvoiceStore } from '@/store/invoiceStore';
import { TemplateId, InvoiceData, TaxBreakdown } from '@/types/invoice';
import { MinimalTemplate } from './MinimalTemplate';
import { CorporateTemplate } from './CorporateTemplate';
import { GridTemplate } from './GridTemplate';
import { BoldTemplate } from './BoldTemplate';
import { ElegantTemplate } from './ElegantTemplate';
import { DarkTemplate } from './DarkTemplate';

export interface TemplateProps {
  invoice: InvoiceData;
  tax: TaxBreakdown;
}

export const TEMPLATES: { id: TemplateId; name: string; description: string; preview: string }[] = [
  { id: 'minimal', name: 'Minimal Professional', description: 'Clean, white, modern layout', preview: '⬜' },
  { id: 'corporate', name: 'Corporate Modern', description: 'Colored header, corporate feel', preview: '🏢' },
  { id: 'grid', name: 'Clean Grid', description: 'Card-based grid layout', preview: '⊞' },
  { id: 'bold', name: 'Bold Business', description: 'Strong headers, high contrast', preview: '◼' },
  { id: 'elegant', name: 'Elegant', description: 'Serif typography, ornate styling', preview: '✦' },
  { id: 'dark', name: 'Dark Theme', description: 'Dark background, vivid accents', preview: '🌑' },
];

export function TemplateRenderer({ invoice, tax }: TemplateProps) {
  switch (invoice.selectedTemplate) {
    case 'corporate': return <CorporateTemplate invoice={invoice} tax={tax} />;
    case 'grid': return <GridTemplate invoice={invoice} tax={tax} />;
    case 'bold': return <BoldTemplate invoice={invoice} tax={tax} />;
    case 'elegant': return <ElegantTemplate invoice={invoice} tax={tax} />;
    case 'dark': return <DarkTemplate invoice={invoice} tax={tax} />;
    default: return <MinimalTemplate invoice={invoice} tax={tax} />;
  }
}
