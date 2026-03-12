import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection , fmtDate } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

// ─────────────────────────────────────────────
// TEMPLATE 4: Bold Business
// ─────────────────────────────────────────────
export function BoldTemplate({ invoice, tax }: TemplateProps) {
  const accent = invoice.customization.accentColor;
  const cols = invoice.customization.columnNames;

  return (
    <div className="bg-white w-full min-h-[1000px] font-sans" style={{ fontFamily: 'inherit' }}>
      {/* Big bold top bar */}
      <div className="flex" style={{ minHeight: 160 }}>
        <div className="flex-1 flex flex-col justify-center px-12 py-8" style={{ backgroundColor: accent }}>
          {invoice.customization.showLogo && invoice.company.logo ? (
            <img src={invoice.company.logo} alt="Logo" className="h-12 mb-2 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
          ) : (
            <h1 className="text-3xl font-black text-white">{invoice.company.name}</h1>
          )}
          <p className="text-white/70 text-sm">{[invoice.company.address, invoice.company.city, invoice.company.state, invoice.company.zip, invoice.company.country].filter(Boolean).join(' · ')}</p>
          <p className="text-white/70 text-sm">{invoice.company.email}</p>
          {invoice.company.gstin && <p className="text-white/60 text-xs mt-1">GSTIN: {invoice.company.gstin}</p>}
        </div>
        <div
          className="flex flex-col justify-center items-end px-12 py-8"
          style={{ backgroundColor: accent + 'DD', minWidth: 240 }}
        >
          <p className="text-6xl font-black text-white/20 leading-none">INV</p>
          <p className="text-white font-black text-2xl mt-1">#{invoice.invoiceNumber}</p>
          <p className="text-white/70 text-sm mt-2">Date: {fmtDate(invoice, invoice.invoiceDate)}</p>
          {invoice.dueDate && <p className="text-white/70 text-sm">Due: {fmtDate(invoice, invoice.dueDate)}</p>}
        </div>
      </div>

      <div className="px-12 py-8">
        {/* Bill-to + summary */}
        <div className="flex justify-between mb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-2 text-gray-400">Billed To</p>
            <p className="font-black text-xl text-gray-900">{invoice.client.name}</p>
            <p className="text-gray-600 text-sm">{invoice.client.company}</p>
            <p className="text-gray-500 text-sm">{[invoice.client.address, invoice.client.city, invoice.client.state, invoice.client.zip, invoice.client.country].filter(Boolean).join(', ')}</p>
            <p className="text-gray-500 text-sm">{invoice.client.email}</p>
            {invoice.client.gstin && <p className="text-gray-400 text-xs mt-1">GSTIN: {invoice.client.gstin}</p>}
          </div>
          <div
            className="flex flex-col items-end justify-center px-8 py-6 rounded-2xl"
            style={{ backgroundColor: accent + '10' }}
          >
            <p className="text-xs font-bold uppercase text-gray-400 tracking-wide">Total Due</p>
            <p className="text-4xl font-black mt-1" style={{ color: accent }}>{formatCurrency(tax.grandTotal, invoice.currency)}</p>
            <p className="text-xs text-gray-500 mt-2">Incl. all taxes</p>
          </div>
        </div>

        {/* Table */}
        <table className="w-full mb-8 border-collapse">
          <thead>
            <tr>
              <th className="py-4 px-5 text-left text-xs font-black uppercase tracking-wider bg-gray-900 text-white rounded-tl-xl w-10">#</th>
              <th className="py-4 px-5 text-left text-xs font-black uppercase tracking-wider bg-gray-900 text-white">{cols.description}</th>
              <th className="py-4 px-5 text-right text-xs font-black uppercase tracking-wider bg-gray-900 text-white w-20">{cols.quantity}</th>
              <th className="py-4 px-5 text-right text-xs font-black uppercase tracking-wider bg-gray-900 text-white w-28">{cols.rate}</th>
              <th className="py-4 px-5 text-right text-xs font-black uppercase tracking-wider bg-gray-900 text-white rounded-tr-xl w-28">{cols.amount}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={item.id} className="border-b-2 border-gray-100">
                <td className="py-4 px-5 text-sm font-bold text-gray-300">{String(i + 1).padStart(2, '0')}</td>
                <td className="py-4 px-5 text-sm text-gray-800 font-medium">{item.description}</td>
                <td className="py-4 px-5 text-sm text-right text-gray-600">{item.quantity}</td>
                <td className="py-4 px-5 text-sm text-right text-gray-600">{formatCurrency(item.rate, invoice.currency)}</td>
                <td className="py-4 px-5 text-sm text-right font-bold text-gray-900">{formatCurrency(item.subtotal, invoice.currency)}</td>
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
          <div className="w-72 bg-gray-50 rounded-2xl p-6">
            <TotalsSection invoice={invoice} tax={tax} />
            <AmountInWords invoice={invoice} tax={tax} />
          </div>
        </div>
      </div>
    </div>
  );
}
