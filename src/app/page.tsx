'use client';
import { useState } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { InvoiceForm } from '@/components/InvoiceForm';
import { ItemTable } from '@/components/ItemTable';
import { TaxCalculator } from '@/components/TaxCalculator';
import { TemplateSelector } from '@/components/TemplateSelector';
import { CustomizationPanel } from '@/components/CustomizationPanel';
import { ExportToolbar } from '@/components/ExportToolbar';
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

export default function InvoiceBuilder() {
  const { invoice, computeTax } = useInvoiceStore();
  const tax = computeTax();
  const [activeTab, setActiveTab] = useState<PanelTab>('invoice');
  const [zoom, setZoom] = useState(85);

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
          <ExportToolbar />
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
            <div
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                width: 794,
                minWidth: 794,
                marginBottom: zoom < 100 ? `-${(100 - zoom) * 6}px` : undefined,
              }}
            >
              <div
                id="invoice-preview-root"
                style={{ width: 794, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', outline: '1px solid rgba(0,0,0,0.08)' }}
              >
                <TemplateRenderer invoice={invoice} tax={tax} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
