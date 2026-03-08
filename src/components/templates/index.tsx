'use client';
import { useInvoiceStore } from '@/store/invoiceStore';
import { TemplateId, InvoiceData, TaxBreakdown } from '@/types/invoice';
import { MinimalTemplate } from './MinimalTemplate';
import { CorporateTemplate } from './CorporateTemplate';
import { GridTemplate } from './GridTemplate';
import { BoldTemplate } from './BoldTemplate';
import { ElegantTemplate } from './ElegantTemplate';
import { DarkTemplate } from './DarkTemplate';
import { RetroTemplate } from './RetroTemplate';
import { PastelTemplate } from './PastelTemplate';
import { SidebarTemplate } from './SidebarTemplate';
import { MonochromeTemplate } from './MonochromeTemplate';

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
  { id: 'retro', name: 'Retro Vintage', description: 'Warm vintage style with decorative borders', preview: '🏛️' },
  { id: 'pastel', name: 'Pastel Friendly', description: 'Soft colors, rounded cards, playful feel', preview: '🎨' },
  { id: 'sidebar', name: 'Sidebar Layout', description: 'Accent sidebar with clean content area', preview: '▐' },
  { id: 'monochrome', name: 'Monochrome Editorial', description: 'Black & white, typographic focus', preview: '◧' },
];

export function TemplateRenderer({ invoice, tax }: TemplateProps) {
  switch (invoice.selectedTemplate) {
    case 'corporate': return <CorporateTemplate invoice={invoice} tax={tax} />;
    case 'grid': return <GridTemplate invoice={invoice} tax={tax} />;
    case 'bold': return <BoldTemplate invoice={invoice} tax={tax} />;
    case 'elegant': return <ElegantTemplate invoice={invoice} tax={tax} />;
    case 'dark': return <DarkTemplate invoice={invoice} tax={tax} />;
    case 'retro': return <RetroTemplate invoice={invoice} tax={tax} />;
    case 'pastel': return <PastelTemplate invoice={invoice} tax={tax} />;
    case 'sidebar': return <SidebarTemplate invoice={invoice} tax={tax} />;
    case 'monochrome': return <MonochromeTemplate invoice={invoice} tax={tax} />;
    default: return <MinimalTemplate invoice={invoice} tax={tax} />;
  }
}
