'use client';
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
import { AuroraTemplate } from './AuroraTemplate';
import { BlueprintTemplate } from './BlueprintTemplate';
import { SunriseTemplate } from './SunriseTemplate';
import { ZenTemplate } from './ZenTemplate';
import { CharcoalTemplate } from './CharcoalTemplate';
import { OceanicTemplate } from './OceanicTemplate';
import { LuxeTemplate } from './LuxeTemplate';
import { WaveTemplate } from './WaveTemplate';
import { LedgerTemplate } from './LedgerTemplate';
import { TerminalTemplate } from './TerminalTemplate';
import { ClassicBlueTemplate } from './ClassicBlueTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { SoftGreenTemplate } from './SoftGreenTemplate';
import { CrimsonTemplate } from './CrimsonTemplate';
import { MonoGridTemplate } from './MonoGridTemplate';

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
  { id: 'aurora', name: 'Aurora Glow', description: 'Soft gradient shell with glassy card body', preview: '🌈' },
  { id: 'blueprint', name: 'Blueprint Draft', description: 'Technical drawing grid with precise layout', preview: '📐' },
  { id: 'sunrise', name: 'Sunrise Gradient', description: 'Warm hero header and soft sunset accents', preview: '🌅' },
  { id: 'zen', name: 'Zen Minimal', description: 'Quiet, airy, and neutral editorial styling', preview: '🍃' },
  { id: 'charcoal', name: 'Charcoal Night', description: 'Dark neutral surfaces with subtle contrast', preview: '⚫' },
  { id: 'oceanic', name: 'Oceanic Blue', description: 'Fresh cyan palette and clean rounded blocks', preview: '🌊' },
  { id: 'luxe', name: 'Luxe Gold', description: 'Refined amber accents with premium framing', preview: '✨' },
  { id: 'wave', name: 'Wave Flow', description: 'Fluid blue gradients and calm spacing rhythm', preview: '〰️' },
  { id: 'ledger', name: 'Ledger Classic', description: 'Structured accounting-first professional style', preview: '📗' },
  { id: 'terminal', name: 'Terminal Retro', description: 'Monospace hacker console-inspired look', preview: '💻' },
  { id: 'classic-blue', name: 'Classic Blue', description: 'Traditional blue enterprise invoice styling', preview: '🧾' },
  { id: 'executive', name: 'Executive', description: 'Formal boardroom style with balanced contrast', preview: '📘' },
  { id: 'soft-green', name: 'Soft Green', description: 'Calm green palette with gentle card sections', preview: '🌿' },
  { id: 'crimson', name: 'Crimson Editorial', description: 'Rose-toned editorial layout with clear hierarchy', preview: '🟥' },
  { id: 'mono-grid', name: 'Mono Grid', description: 'Monospace invoice with strict grid alignment', preview: '⌗' },
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
    case 'aurora': return <AuroraTemplate invoice={invoice} tax={tax} />;
    case 'blueprint': return <BlueprintTemplate invoice={invoice} tax={tax} />;
    case 'sunrise': return <SunriseTemplate invoice={invoice} tax={tax} />;
    case 'zen': return <ZenTemplate invoice={invoice} tax={tax} />;
    case 'charcoal': return <CharcoalTemplate invoice={invoice} tax={tax} />;
    case 'oceanic': return <OceanicTemplate invoice={invoice} tax={tax} />;
    case 'luxe': return <LuxeTemplate invoice={invoice} tax={tax} />;
    case 'wave': return <WaveTemplate invoice={invoice} tax={tax} />;
    case 'ledger': return <LedgerTemplate invoice={invoice} tax={tax} />;
    case 'terminal': return <TerminalTemplate invoice={invoice} tax={tax} />;
    case 'classic-blue': return <ClassicBlueTemplate invoice={invoice} tax={tax} />;
    case 'executive': return <ExecutiveTemplate invoice={invoice} tax={tax} />;
    case 'soft-green': return <SoftGreenTemplate invoice={invoice} tax={tax} />;
    case 'crimson': return <CrimsonTemplate invoice={invoice} tax={tax} />;
    case 'mono-grid': return <MonoGridTemplate invoice={invoice} tax={tax} />;
    default: return <MinimalTemplate invoice={invoice} tax={tax} />;
  }
}
