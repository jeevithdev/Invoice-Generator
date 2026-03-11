'use client';
import { useInvoiceStore } from '@/store/invoiceStore';
import { Input, Toggle, SectionCard } from '@/components/ui/FormControls';
import { Palette, Columns, Eye, Type, FileText, Stamp, StickyNote } from 'lucide-react';

const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
  '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#14b8a6',
  '#64748b', '#1e293b',
];

function RadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              value === o.value
                ? 'bg-indigo-500 text-white border-indigo-500'
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CustomizationPanel() {
  const { invoice, updateCustomization } = useInvoiceStore();
  const { customization } = invoice;

  return (
    <div className="flex flex-col gap-4">
      {/* Colors */}
      <SectionCard title="Colors" icon={<Palette size={16} className="text-indigo-500" />}>
        <div className="mt-3 flex flex-col gap-4">
          <div>
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">Accent Color</p>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customization.accentColor}
                onChange={(e) => updateCustomization({ accentColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
              />
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => updateCustomization({ accentColor: color })}
                    title={color}
                    className={`w-7 h-7 rounded-full transition-all hover:scale-110 border-2 ${
                      customization.accentColor === color ? 'border-slate-800 scale-110' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">Secondary / Background Color</p>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={customization.secondaryColor}
                onChange={(e) => updateCustomization({ secondaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
              />
              <p className="text-xs text-slate-500">Table backgrounds and section fills</p>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Typography */}
      <SectionCard title="Typography & Layout" icon={<Type size={16} className="text-indigo-500" />}>
        <div className="mt-3 flex flex-col gap-4">
          <div>
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">Font Family</p>
            <select
              value={customization.fontFamily}
              onChange={(e) => updateCustomization({ fontFamily: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="inter">Inter (Default)</option>
              <option value="sans-serif">Sans-Serif</option>
              <option value="georgia">Georgia (Serif)</option>
              <option value="courier">Courier (Monospace)</option>
              <option value="poppins">Poppins</option>
            </select>
          </div>
          <RadioGroup
            label="Font Size"
            value={customization.fontSize ?? 'md'}
            onChange={(v) => updateCustomization({ fontSize: v })}
            options={[
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
            ]}
          />
          <RadioGroup
            label="Border Radius"
            value={customization.borderRadius ?? 'md'}
            onChange={(v) => updateCustomization({ borderRadius: v })}
            options={[
              { value: 'none', label: 'Sharp' },
              { value: 'sm', label: 'Subtle' },
              { value: 'md', label: 'Rounded' },
              { value: 'lg', label: 'Pill' },
            ]}
          />
        </div>
      </SectionCard>

      {/* Invoice Identity */}
      <SectionCard title="Invoice Identity" icon={<FileText size={16} className="text-indigo-500" />} defaultOpen={false}>
        <div className="mt-3 flex flex-col gap-3">
          <Input
            label="Invoice Title"
            value={customization.invoiceTitle ?? 'INVOICE'}
            onChange={(e) => updateCustomization({ invoiceTitle: e.target.value })}
            placeholder="e.g. TAX INVOICE, PROFORMA..."
          />
          <div>
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">Date Format</p>
            <select
              value={customization.dateFormat ?? 'YYYY-MM-DD'}
              onChange={(e) => updateCustomization({ dateFormat: e.target.value as never })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="YYYY-MM-DD">2025-01-31 (ISO)</option>
              <option value="DD/MM/YYYY">31/01/2025</option>
              <option value="MM/DD/YYYY">01/31/2025</option>
              <option value="DD MMM YYYY">31 Jan 2025</option>
            </select>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">Page Size</p>
            <select
              value={customization.pageSize ?? 'A4'}
              onChange={(e) => updateCustomization({ pageSize: e.target.value as 'A4' | 'Letter' })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="A4">A4 (210 × 297 mm)</option>
              <option value="Letter">Letter (8.5 × 11 in)</option>
            </select>
          </div>
        </div>
      </SectionCard>

      {/* Watermark */}
      <SectionCard title="Watermark" icon={<Stamp size={16} className="text-indigo-500" />} defaultOpen={false}>
        <div className="mt-3 flex flex-col gap-3">
          <Toggle
            label="Show Watermark"
            description="Diagonal stamp overlay on invoice"
            checked={customization.showWatermark ?? false}
            onChange={(v) => updateCustomization({ showWatermark: v })}
          />
          {(customization.showWatermark) && (
            <Input
              label="Watermark Text"
              value={customization.watermarkText ?? 'PAID'}
              onChange={(e) => updateCustomization({ watermarkText: e.target.value })}
              placeholder="PAID, DRAFT, VOID..."
            />
          )}
        </div>
      </SectionCard>

      {/* Header & Footer Notes */}
      <SectionCard title="Header & Footer Notes" icon={<StickyNote size={16} className="text-indigo-500" />} defaultOpen={false}>
        <div className="mt-3 flex flex-col gap-3">
          <Toggle
            label="Show Header Note"
            description="Highlighted banner below the header"
            checked={customization.showCustomHeaderNote ?? false}
            onChange={(v) => updateCustomization({ showCustomHeaderNote: v })}
          />
          {(customization.showCustomHeaderNote) && (
            <Input
              label="Header Note Text"
              value={customization.customHeaderNote ?? ''}
              onChange={(e) => updateCustomization({ customHeaderNote: e.target.value })}
              placeholder="e.g. Due on receipt · Early payment appreciated"
            />
          )}
          <Toggle
            label="Show Footer Note"
            description="Small text at the bottom of the invoice"
            checked={customization.showCustomFooterNote ?? false}
            onChange={(v) => updateCustomization({ showCustomFooterNote: v })}
          />
          {(customization.showCustomFooterNote) && (
            <Input
              label="Footer Note Text"
              value={customization.customFooterNote ?? ''}
              onChange={(e) => updateCustomization({ customFooterNote: e.target.value })}
              placeholder="e.g. Thank you for your business!"
            />
          )}
        </div>
      </SectionCard>

      {/* Visibility */}
      <SectionCard title="Show / Hide Sections" icon={<Eye size={16} className="text-indigo-500" />} defaultOpen={false}>
        <div className="mt-1 divide-y divide-slate-100">
          <Toggle
            label="Company Logo"
            description="Display logo in invoice header"
            checked={customization.showLogo}
            onChange={(v) => updateCustomization({ showLogo: v })}
          />
          <Toggle
            label="GST Breakdown"
            description="Show CGST/SGST/IGST rows"
            checked={customization.showGSTBreakdown}
            onChange={(v) => updateCustomization({ showGSTBreakdown: v })}
          />
          <Toggle
            label="Bank Details"
            description="Show bank account details"
            checked={customization.showBankDetails}
            onChange={(v) => updateCustomization({ showBankDetails: v })}
          />
          <Toggle
            label="Notes"
            description="Show notes section"
            checked={customization.showNotes}
            onChange={(v) => updateCustomization({ showNotes: v })}
          />
          <Toggle
            label="Terms & Conditions"
            description="Show terms section"
            checked={customization.showTerms}
            onChange={(v) => updateCustomization({ showTerms: v })}
          />
        </div>
      </SectionCard>

      {/* Column Names */}
      <SectionCard title="Column Labels" icon={<Columns size={16} className="text-indigo-500" />} defaultOpen={false}>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <Input
            label="Description Column"
            value={customization.columnNames.description}
            onChange={(e) =>
              updateCustomization({ columnNames: { ...customization.columnNames, description: e.target.value } })
            }
          />
          <Input
            label="Quantity Column"
            value={customization.columnNames.quantity}
            onChange={(e) =>
              updateCustomization({ columnNames: { ...customization.columnNames, quantity: e.target.value } })
            }
          />
          <Input
            label="Rate Column"
            value={customization.columnNames.rate}
            onChange={(e) =>
              updateCustomization({ columnNames: { ...customization.columnNames, rate: e.target.value } })
            }
          />
          <Input
            label="Amount Column"
            value={customization.columnNames.amount}
            onChange={(e) =>
              updateCustomization({ columnNames: { ...customization.columnNames, amount: e.target.value } })
            }
          />
        </div>
      </SectionCard>
    </div>
  );
}
