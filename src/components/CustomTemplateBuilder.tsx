'use client';
import { useState } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { CustomTemplateConfig } from '@/types/invoice';
import { X, Paintbrush, LayoutTemplate, Type, Eye, ImageUp, Trash2 } from 'lucide-react';

interface Props {
  onClose: () => void;
}

type BuilderTab = 'colors' | 'layout' | 'table' | 'extras' | 'background';

const LAYOUT_OPTIONS: { value: CustomTemplateConfig['headerLayout']; label: string; sub: string }[] = [
  { value: 'standard', label: 'Standard', sub: 'Company left · Invoice number right' },
  { value: 'reversed', label: 'Reversed', sub: 'Invoice number left · Company right' },
  { value: 'centered', label: 'Centered', sub: 'All content centered in the header' },
];

const TABS: { id: BuilderTab; label: string; icon: React.ReactNode }[] = [
  { id: 'colors', label: 'Colors', icon: <Paintbrush size={13} /> },
  { id: 'layout', label: 'Layout', icon: <LayoutTemplate size={13} /> },
  { id: 'table', label: 'Table', icon: <Type size={13} /> },
  { id: 'extras', label: 'Extras', icon: <Eye size={13} /> },
  { id: 'background', label: 'Background', icon: <ImageUp size={13} /> },
];

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-xs text-slate-600 flex-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-slate-200"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 text-xs font-mono border border-slate-200 rounded px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          maxLength={7}
        />
      </div>
    </div>
  );
}

export function CustomTemplateBuilder({ onClose }: Props) {
  const { invoice, updateCustomTemplateConfig, setTemplate } = useInvoiceStore();
  const [cfg, setCfg] = useState<CustomTemplateConfig>({ ...invoice.customTemplateConfig });
  const [activeTab, setActiveTab] = useState<BuilderTab>('colors');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const update = (patch: Partial<CustomTemplateConfig>) => {
    setCfg((prev) => ({ ...prev, ...patch }));
  };

  const handlePdfOrImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfError(null);
    setPdfLoading(true);
    try {
      if (file.type.startsWith('image/')) {
        // Direct image → dataURL
        const reader = new FileReader();
        reader.onload = (ev) => {
          update({ pdfBackground: ev.target?.result as string });
          setPdfLoading(false);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        // PDF → render page 1 to canvas → dataURL
        const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
        GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        update({ pdfBackground: canvas.toDataURL('image/png') });
        setPdfLoading(false);
      } else {
        setPdfError('Please upload a PDF or image file.');
        setPdfLoading(false);
      }
    } catch {
      setPdfError('Failed to read file. Please try again.');
      setPdfLoading(false);
    }
    // reset input so same file can be re-uploaded
    e.target.value = '';
  };

  const handleSave = () => {
    updateCustomTemplateConfig(cfg);
    setTemplate('custom');
    onClose();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm mt-3 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <Paintbrush size={12} className="text-white" />
            </div>
            <h2 className="text-sm font-bold text-slate-800">Custom Template Builder</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Template Name */}
        <div className="px-5 pt-3 pb-0">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
            Template Name
          </label>
          <input
            type="text"
            value={cfg.templateName}
            onChange={(e) => update({ templateName: e.target.value })}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="My Custom Template"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${activeTab === t.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="px-5 py-4 space-y-4">
          {activeTab === 'colors' && (
            <>
              <p className="text-xs text-slate-400 mb-3">Click the color swatch or type a hex value.</p>
              <div className="space-y-3">
                <ColorField label="Header Background" value={cfg.headerBg} onChange={(v) => update({ headerBg: v })} />
                <ColorField label="Header Text Color" value={cfg.headerTextColor} onChange={(v) => update({ headerTextColor: v })} />
                <ColorField label="Accent / Highlight Color" value={cfg.accentColor} onChange={(v) => update({ accentColor: v })} />
                <ColorField label="Page Background" value={cfg.pageBg} onChange={(v) => update({ pageBg: v })} />
                <ColorField label="Table Header Background" value={cfg.tableHeaderBg} onChange={(v) => update({ tableHeaderBg: v })} />
                <ColorField label="Table Header Text Color" value={cfg.tableHeaderTextColor} onChange={(v) => update({ tableHeaderTextColor: v })} />
              </div>

              {/* Mini preview bar */}
              <div className="mt-4 rounded-xl overflow-hidden border border-slate-200">
                <div
                  className="px-4 py-3 flex justify-between items-center"
                  style={{ backgroundColor: cfg.headerBg, color: cfg.headerTextColor }}
                >
                  <span className="text-xs font-bold">Company Name</span>
                  <span className="text-sm font-light tracking-widest">INVOICE</span>
                </div>
                <div className="h-0.5" style={{ backgroundColor: cfg.accentColor }} />
                <div style={{ backgroundColor: cfg.pageBg }} className="px-4 py-2">
                  <div
                    className="flex px-2 py-1 rounded text-xs font-medium"
                    style={{ backgroundColor: cfg.tableHeaderBg, color: cfg.tableHeaderTextColor }}
                  >
                    <span className="flex-1">Description</span>
                    <span>Amount</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'layout' && (
            <>
              <p className="text-xs text-slate-400 mb-3">Choose how the header is arranged.</p>
              <div className="space-y-2">
                {LAYOUT_OPTIONS.map(({ value, label, sub }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => update({ headerLayout: value })}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all
                      ${cfg.headerLayout === value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <p className={`text-sm font-semibold ${cfg.headerLayout === value ? 'text-indigo-700' : 'text-slate-700'}`}>
                      {label}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {activeTab === 'table' && (
            <>
              <p className="text-xs text-slate-400 mb-3">Configure the items table appearance.</p>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className={`w-10 h-6 rounded-full flex items-center transition-colors relative ${cfg.tableRowStriped ? 'bg-indigo-500' : 'bg-slate-200'}`}
                    onClick={() => update({ tableRowStriped: !cfg.tableRowStriped })}
                  >
                    <span
                      className={`absolute w-4 h-4 bg-white rounded-full shadow transition-transform ${cfg.tableRowStriped ? 'translate-x-5' : 'translate-x-1'}`}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 font-medium">Striped Rows</p>
                    <p className="text-xs text-slate-400">Alternating row shading for readability</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    className={`w-10 h-6 rounded-full flex items-center transition-colors relative ${cfg.tableBordered ? 'bg-indigo-500' : 'bg-slate-200'}`}
                    onClick={() => update({ tableBordered: !cfg.tableBordered })}
                  >
                    <span
                      className={`absolute w-4 h-4 bg-white rounded-full shadow transition-transform ${cfg.tableBordered ? 'translate-x-5' : 'translate-x-1'}`}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 font-medium">Bordered Table</p>
                    <p className="text-xs text-slate-400">Show borders on all table cells</p>
                  </div>
                </label>
              </div>

              {/* Table preview */}
              <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ backgroundColor: cfg.tableHeaderBg, color: cfg.tableHeaderTextColor }}>
                      <th className="py-2 px-3 text-left font-semibold">#</th>
                      <th className="py-2 px-3 text-left font-semibold">Description</th>
                      <th className="py-2 px-3 text-right font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[['1', 'Web Design Services', '₹25,000'], ['2', 'SEO Optimization', '₹15,000']].map(([n, d, a], i) => (
                      <tr
                        key={n}
                        className={cfg.tableBordered ? 'border border-gray-200' : 'border-b border-gray-100'}
                        style={{ backgroundColor: cfg.tableRowStriped && i % 2 !== 0 ? cfg.tableHeaderBg + '55' : 'transparent' }}
                      >
                        <td className="py-2 px-3 text-slate-500">{n}</td>
                        <td className="py-2 px-3 text-slate-700">{d}</td>
                        <td className="py-2 px-3 text-right font-medium text-slate-800">{a}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'extras' && (
            <>
              <p className="text-xs text-slate-400 mb-3">Additional layout options.</p>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className={`w-10 h-6 rounded-full flex items-center transition-colors relative ${cfg.showDivider ? 'bg-indigo-500' : 'bg-slate-200'}`}
                    onClick={() => update({ showDivider: !cfg.showDivider })}
                  >
                    <span
                      className={`absolute w-4 h-4 bg-white rounded-full shadow transition-transform ${cfg.showDivider ? 'translate-x-5' : 'translate-x-1'}`}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 font-medium">Accent Divider</p>
                    <p className="text-xs text-slate-400">Show a colored line below the header</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className={`w-10 h-6 rounded-full flex items-center transition-colors relative ${cfg.showSignatureArea ? 'bg-indigo-500' : 'bg-slate-200'}`}
                    onClick={() => update({ showSignatureArea: !cfg.showSignatureArea })}
                  >
                    <span
                      className={`absolute w-4 h-4 bg-white rounded-full shadow transition-transform ${cfg.showSignatureArea ? 'translate-x-5' : 'translate-x-1'}`}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-slate-700 font-medium">Signature Area</p>
                    <p className="text-xs text-slate-400">Add an authorized signature line at the bottom</p>
                  </div>
                </label>

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                    Footer Text
                  </label>
                  <input
                    type="text"
                    value={cfg.footerText}
                    onChange={(e) => update({ footerText: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Thank you for your business!"
                  />
                  <p className="text-xs text-slate-400 mt-1">Shown at the bottom of the invoice. Leave blank to hide.</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'background' && (
          <div className="px-5 pb-4 space-y-4">
              <p className="text-xs text-slate-400 mb-3">Upload a PDF or image to use as your invoice background (e.g. your letterhead).</p>

              {/* Upload area */}
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl py-6 px-4 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-all">
                <ImageUp size={22} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-600">Click to upload PDF or image</span>
                <span className="text-xs text-slate-400">PDF, PNG, JPG — first page will be used</span>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handlePdfOrImageUpload}
                />
              </label>

              {pdfLoading && (
                <div className="flex items-center gap-2 text-xs text-indigo-600 mt-2">
                  <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  Processing file…
                </div>
              )}
              {pdfError && <p className="text-xs text-red-500 mt-2">{pdfError}</p>}

              {cfg.pdfBackground && (
                <>
                  {/* Thumbnail preview */}
                  <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-200">
                    <img
                      src={cfg.pdfBackground}
                      alt="Background preview"
                      className="w-full object-contain max-h-48"
                      style={{ opacity: cfg.pdfBackgroundOpacity }}
                    />
                    <button
                      type="button"
                      onClick={() => update({ pdfBackground: null })}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Remove background"
                    >
                      <Trash2 size={12} />
                    </button>
                    <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded">Preview at {Math.round(cfg.pdfBackgroundOpacity * 100)}% opacity</span>
                  </div>

                  {/* Opacity slider */}
                  <div className="mt-3">
                    <div className="flex justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Background Opacity</label>
                      <span className="text-xs text-slate-500">{Math.round(cfg.pdfBackgroundOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0.03}
                      max={1}
                      step={0.01}
                      value={cfg.pdfBackgroundOpacity}
                      onChange={(e) => update({ pdfBackgroundOpacity: parseFloat(e.target.value) })}
                      className="w-full accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                      <span>Faint watermark</span>
                      <span>Full</span>
                    </div>
                  </div>
                </>
              )}
          </div>
        )}

        {/* Footer buttons */}
        <div className="flex gap-3 px-5 py-3 border-t border-slate-100 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 font-medium hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Apply Template
          </button>
        </div>
    </div>
  );
}
