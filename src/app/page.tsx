'use client';
import { useState, useEffect, useMemo } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { InvoiceForm } from '@/components/InvoiceForm';
import { ItemTable } from '@/components/ItemTable';
import { TaxCalculator } from '@/components/TaxCalculator';
import { TemplateSelector } from '@/components/TemplateSelector';
import { CustomizationPanel } from '@/components/CustomizationPanel';
import { ExportToolbar } from '@/components/ExportToolbar';
import { PdfImportButton } from '@/components/PdfImportButton';
import { TemplateRenderer } from '@/components/templates/index';
import { FileText, Settings, Calculator, Palette, LayoutTemplate, ZoomIn, ZoomOut } from 'lucide-react';

type PanelTab = 'invoice' | 'items' | 'tax' | 'design' | 'template';

const TABS: { id: PanelTab; label: string; icon: React.ReactNode }[] = [
  { id: 'invoice', label: 'Invoice', icon: <FileText size={14} /> },
  { id: 'items', label: 'Items', icon: <Settings size={14} /> },
  { id: 'tax', label: 'Tax', icon: <Calculator size={14} /> },
  { id: 'design', label: 'Design', icon: <Palette size={14} /> },
  { id: 'template', label: 'Template', icon: <LayoutTemplate size={14} /> },
];

const FONT_MAP: Record<string, string> = {
  inter: 'Inter, system-ui, sans-serif',
  'sans-serif': 'ui-sans-serif, system-ui, sans-serif',
  georgia: 'Georgia, "Times New Roman", serif',
  courier: '"Courier New", Courier, monospace',
  poppins: 'Poppins, Inter, sans-serif',
};

// Tailwind v4 compiles text-* and rounded-* as var(--text-*) / var(--radius-*).
// Overriding these CSS vars scoped to #invoice-preview-root makes all templates respond.
const TW_TEXT_SIZES: Array<[string, number]> = [
  ['xs', 0.75], ['sm', 0.875], ['base', 1], ['lg', 1.125], ['xl', 1.25],
  ['2xl', 1.5], ['3xl', 1.875], ['4xl', 2.25], ['5xl', 3], ['6xl', 3.75],
];
const TW_RADII: Array<[string, number]> = [
  ['sm', 0.125], ['', 0.25], ['md', 0.375], ['lg', 0.5],
  ['xl', 0.75], ['2xl', 1], ['3xl', 1.5],
];

const PAGE_WIDTH: Record<string, number> = {
  A4: 794,
  Letter: 816,
};

/** Convert a 6-digit hex color to rgba() with the given 0-1 alpha */
function hexAlpha(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function InvoiceBuilder() {
  const { invoice, computeTax } = useInvoiceStore();
  const tax = computeTax();
  const [activeTab, setActiveTab] = useState<PanelTab>('invoice');
  const [zoom, setZoom] = useState(85);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const c = invoice.customization;
  const pageWidth = PAGE_WIDTH[c.pageSize ?? 'A4'] ?? 794;
  const fontFamily = FONT_MAP[c.fontFamily] ?? FONT_MAP.inter;

  // Build scoped CSS variable overrides so Tailwind text-* and rounded-* classes apply the setting
  const previewStyleOverride = useMemo(() => {
    const parts: string[] = [];

    // Font size: scale all --text-* vars by the chosen factor
    const fsScale = c.fontSize === 'sm' ? 0.8 : c.fontSize === 'lg' ? 1.22 : null;
    if (fsScale !== null) {
      const decls = TW_TEXT_SIZES
        .map(([v, base]) => `--text-${v}:${(base * fsScale).toFixed(4)}rem`)
        .join(';');
      parts.push(`#invoice-preview-root{${decls}}`);
    }

    // Border radius: scale all --radius-* vars (or zero them out for 'none')
    const brScale = c.borderRadius === 'none' ? 0
      : c.borderRadius === 'sm' ? 0.4
      : c.borderRadius === 'lg' ? 2.5
      : null;
    if (brScale !== null) {
      const decls = TW_RADII
        .map(([v, base]) => `--radius${v ? '-' + v : ''}:${(base * brScale).toFixed(4)}rem`)
        .join(';');
      parts.push(`#invoice-preview-root{${decls}}`);
      if (brScale === 0) {
        // also force override any element where Tailwind may have set a border-radius via !important
        parts.push('#invoice-preview-root *{border-radius:0!important}');
      }
    }

    return parts.join('');
  }, [c.fontSize, c.borderRadius]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FileText size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">InvoiceCraft</h1>
              <p className="text-xs text-slate-400 leading-tight hidden sm:block">Professional Invoice Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <PdfImportButton />
            <ExportToolbar />
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full">
        {/* Left Panel - Editor */}
        <div className="w-[420px] min-w-[380px] bg-white border-r border-slate-200 flex flex-col h-[calc(100vh-56px)] sticky top-14">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-all
                  ${activeTab === tab.id
                    ? 'text-indigo-600 border-b-2 border-indigo-500 bg-white'
                    : 'text-slate-500 hover:text-slate-700 border-b-2 border-transparent'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'invoice' && <InvoiceForm />}
            {activeTab === 'items' && <ItemTable />}
            {activeTab === 'tax' && <TaxCalculator />}
            {activeTab === 'design' && <CustomizationPanel />}
            {activeTab === 'template' && <TemplateSelector />}
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="flex-1 flex flex-col bg-slate-200 h-[calc(100vh-56px)] overflow-hidden">
          {/* Preview toolbar */}
          <div className="flex items-center justify-between px-5 py-2.5 bg-slate-700 text-white text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-2 text-slate-300 font-medium">Live Preview — {invoice.invoiceNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoom(Math.max(40, zoom - 10))}
                className="p-1 rounded hover:bg-slate-600 transition-colors"
              >
                <ZoomOut size={14} />
              </button>
              <span className="w-10 text-center font-mono">{zoom}%</span>
              <button
                type="button"
                onClick={() => setZoom(Math.min(150, zoom + 10))}
                className="p-1 rounded hover:bg-slate-600 transition-colors"
              >
                <ZoomIn size={14} />
              </button>
            </div>
          </div>

          {/* Scrollable preview area */}
          <div className="flex-1 overflow-auto p-8 flex justify-center">
            {/* Scoped font-size / border-radius overrides via Tailwind CSS var injection */}
            {previewStyleOverride && <style>{previewStyleOverride}</style>}
            <div
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                width: pageWidth,
                minWidth: pageWidth,
                marginBottom: zoom < 100 ? `-${(100 - zoom) * 6}px` : undefined,
              }}
            >
              <div
                id="invoice-preview-root"
                style={{
                  width: pageWidth,
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                  outline: '1px solid rgba(0,0,0,0.08)',
                  fontFamily,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Custom Header Note */}
                {c.showCustomHeaderNote && c.customHeaderNote && (
                  <div
                    style={{
                      backgroundColor: hexAlpha(c.accentColor, 0.09),
                      borderBottom: `2px solid ${c.accentColor}`,
                      color: c.accentColor,
                      padding: '8px 24px',
                      fontSize: '12px',
                      fontWeight: 500,
                      textAlign: 'center',
                    }}
                  >
                    {c.customHeaderNote}
                  </div>
                )}

                {mounted ? (
                  <TemplateRenderer invoice={invoice} tax={tax} />
                ) : (
                  <div style={{ width: pageWidth, minHeight: 1000, backgroundColor: '#fff' }} />
                )}

                {/* Custom Footer Note */}
                {c.showCustomFooterNote && c.customFooterNote && (
                  <div
                    style={{
                      backgroundColor: hexAlpha(c.accentColor, 0.06),
                      borderTop: `1px solid ${hexAlpha(c.accentColor, 0.25)}`,
                      color: '#64748b',
                      padding: '8px 24px',
                      fontSize: '11px',
                      textAlign: 'center',
                    }}
                  >
                    {c.customFooterNote}
                  </div>
                )}

                {/* Watermark */}
                {c.showWatermark && c.watermarkText && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                      zIndex: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '120px',
                        fontWeight: 900,
                        color: c.accentColor,
                        opacity: 0.07,
                        transform: 'rotate(-35deg)',
                        letterSpacing: '0.1em',
                        userSelect: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {c.watermarkText}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
