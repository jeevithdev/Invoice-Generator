import { TemplateProps, ItemsTableBody, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

// ─────────────────────────────────────────────
// TEMPLATE 1: Minimal Professional (clean white)
// ─────────────────────────────────────────────
export function MinimalTemplate({ invoice, tax }: TemplateProps) {
  const accent = invoice.customization.accentColor;
  const cols = invoice.customization.columnNames;

  return (
    <div className="bg-white w-full min-h-[1000px] p-12 font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          {invoice.customization.showLogo && invoice.company.logo && (
            <img src={invoice.company.logo} alt="Logo" className="h-14 mb-3 object-contain" />
          )}
          <h1 className="text-2xl font-bold text-gray-900">{invoice.company.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{invoice.company.address}</p>
          <p className="text-sm text-gray-500">{[invoice.company.city, invoice.company.state, invoice.company.zip].filter(Boolean).join(', ')}</p>
          <p className="text-sm text-gray-500">{[invoice.company.phone, invoice.company.email].filter(Boolean).join(' · ')}</p>
          {invoice.company.gstin && <p className="text-xs text-gray-400 mt-1">GSTIN: {invoice.company.gstin}</p>}
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-light tracking-wider" style={{ color: accent }}>INVOICE</h2>
          <div className="mt-3 text-sm text-gray-600 space-y-1">
            <p><span className="font-medium text-gray-800">#{invoice.invoiceNumber}</span></p>
            <p>Date: {invoice.invoiceDate}</p>
            {invoice.dueDate && <p>Due: {invoice.dueDate}</p>}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full mb-8" style={{ backgroundColor: accent + '40' }} />

      {/* Bill To */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: accent }}>Bill To</p>
        <h3 className="text-lg font-semibold text-gray-900">{invoice.client.name}</h3>
        <p className="text-sm text-gray-600">{invoice.client.company}</p>
        <p className="text-sm text-gray-500">{invoice.client.address}</p>
        <p className="text-sm text-gray-500">{[invoice.client.city, invoice.client.state, invoice.client.zip].filter(Boolean).join(', ')}</p>
        <p className="text-sm text-gray-500">{[invoice.client.email, invoice.client.phone].filter(Boolean).join(' · ')}</p>
        {invoice.client.gstin && <p className="text-xs text-gray-400 mt-1">GSTIN: {invoice.client.gstin}</p>}
      </div>

      {/* Items Table */}
      <table className="w-full text-left border-collapse mb-8">
        <thead>
          <tr style={{ backgroundColor: accent + '15' }}>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-gray-500 w-10">#</th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-gray-500">{cols.description}</th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-gray-500 text-right w-20">{cols.quantity}</th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-gray-500 text-right w-28">{cols.rate}</th>
            <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-gray-500 text-right w-28">{cols.amount}</th>
          </tr>
        </thead>
        <tbody>
          <ItemsTableBody invoice={invoice} />
        </tbody>
      </table>

      {/* Totals + Notes */}
      <div className="flex justify-between items-start gap-8">
        <div className="flex-1">
          <BankDetailsSection invoice={invoice} />
          <div className="mt-4 space-y-3">
            <NotesSection invoice={invoice} />
            <TermsSection invoice={invoice} />
          </div>
        </div>
        <div className="w-64">
          <TotalsSection invoice={invoice} tax={tax} />
          <AmountInWords invoice={invoice} tax={tax} />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
        Thank you for your business · {invoice.company.website}
      </div>
    </div>
  );
}
