import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

// ─────────────────────────────────────────────
// TEMPLATE 5: Elegant Invoice (serif-inspired)
// ─────────────────────────────────────────────
export function ElegantTemplate({ invoice, tax }: TemplateProps) {
  const accent = invoice.customization.accentColor;
  const cols = invoice.customization.columnNames;

  return (
    <div className="bg-white w-full min-h-[1000px] p-12 font-sans" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
      {/* Ornamental top border */}
      <div className="flex items-center mb-8 gap-4">
        <div className="flex-1 h-px" style={{ backgroundColor: accent + '60' }} />
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
        <div className="flex-1 h-px" style={{ backgroundColor: accent + '60' }} />
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          {invoice.customization.showLogo && invoice.company.logo && (
            <img src={invoice.company.logo} alt="Logo" className="h-14 mb-3 object-contain" />
          )}
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontVariant: 'small-caps', letterSpacing: '0.05em' }}>
            {invoice.company.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1 italic">{invoice.company.address}</p>
          <p className="text-sm text-gray-500 italic">{[invoice.company.city, invoice.company.state].filter(Boolean).join(', ')}</p>
          <p className="text-sm text-gray-500 italic">{invoice.company.email}</p>
          {invoice.company.gstin && <p className="text-xs text-gray-400 mt-1">GSTIN: {invoice.company.gstin}</p>}
        </div>
        <div className="text-right">
          <h2 className="text-5xl tracking-[0.3em] font-light" style={{ color: accent + 'AA', fontVariant: 'small-caps' }}>
            Invoice
          </h2>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-600">No: <strong className="text-gray-900">#{invoice.invoiceNumber}</strong></p>
            <p className="text-sm text-gray-600">Dated: <strong>{invoice.invoiceDate}</strong></p>
            {invoice.dueDate && <p className="text-sm text-gray-600">Due by: <strong>{invoice.dueDate}</strong></p>}
          </div>
        </div>
      </div>

      {/* Divider ornament */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 border-t" style={{ borderColor: accent + '40' }} />
        <p className="text-xs tracking-[0.2em] font-semibold" style={{ color: accent, fontVariant: 'small-caps' }}>
          Bill To
        </p>
        <div className="flex-1 border-t" style={{ borderColor: accent + '40' }} />
      </div>

      <div className="pl-4 border-l-2 mb-8" style={{ borderColor: accent }}>
        <p className="text-lg font-bold text-gray-900">{invoice.client.name}</p>
        <p className="text-gray-600 italic">{invoice.client.company}</p>
        <p className="text-sm text-gray-500">{invoice.client.address}</p>
        <p className="text-sm text-gray-500">{[invoice.client.city, invoice.client.state].filter(Boolean).join(', ')}{invoice.client.zip ? ` ${invoice.client.zip}` : ''}</p>
        <p className="text-sm text-gray-500">{invoice.client.email}</p>
        {invoice.client.gstin && <p className="text-xs text-gray-400 mt-1">GSTIN: {invoice.client.gstin}</p>}
      </div>

      {/* Items */}
      <table className="w-full text-left border-collapse mb-8">
        <thead>
          <tr style={{ borderTop: `2px solid ${accent}`, borderBottom: `1px solid ${accent}60` }}>
            <th className="py-3 px-3 text-xs uppercase tracking-widest text-gray-500 w-10">#</th>
            <th className="py-3 px-3 text-xs uppercase tracking-widest text-gray-500">{cols.description}</th>
            <th className="py-3 px-3 text-xs uppercase tracking-widest text-gray-500 text-right w-20">{cols.quantity}</th>
            <th className="py-3 px-3 text-xs uppercase tracking-widest text-gray-500 text-right w-28">{cols.rate}</th>
            <th className="py-3 px-3 text-xs uppercase tracking-widest text-gray-500 text-right w-28">{cols.amount}</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={item.id} className="border-b" style={{ borderColor: accent + '20' }}>
              <td className="py-3 px-3 text-sm text-gray-400 italic">{i + 1}</td>
              <td className="py-3 px-3 text-sm text-gray-800">{item.description}</td>
              <td className="py-3 px-3 text-sm text-right text-gray-600">{item.quantity}</td>
              <td className="py-3 px-3 text-sm text-right text-gray-600">{formatCurrency(item.rate, invoice.currency)}</td>
              <td className="py-3 px-3 text-sm text-right font-bold text-gray-900">{formatCurrency(item.subtotal, invoice.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between gap-8">
        <div className="flex-1 space-y-4">
          <BankDetailsSection invoice={invoice} />
          <NotesSection invoice={invoice} />
          <TermsSection invoice={invoice} />
        </div>
        <div className="w-64">
          <TotalsSection invoice={invoice} tax={tax} />
          <AmountInWords invoice={invoice} tax={tax} />
        </div>
      </div>

      {/* Footer ornament */}
      <div className="flex items-center mt-10 gap-4">
        <div className="flex-1 h-px" style={{ backgroundColor: accent + '60' }} />
        <p className="text-xs text-gray-400 italic tracking-widest">{invoice.company.website}</p>
        <div className="flex-1 h-px" style={{ backgroundColor: accent + '60' }} />
      </div>
    </div>
  );
}
