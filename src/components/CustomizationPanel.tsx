'use client';
import { useInvoiceStore } from '@/store/invoiceStore';
import { Input, Toggle, SectionCard } from '@/components/ui/FormControls';
import { Palette, Columns, Eye } from 'lucide-react';

const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
  '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#14b8a6',
  '#64748b', '#1e293b',
];

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
              <p className="text-xs text-slate-500">Used for table backgrounds and section fills</p>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Visibility */}
      <SectionCard title="Show / Hide Sections" icon={<Eye size={16} className="text-indigo-500" />}>
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
