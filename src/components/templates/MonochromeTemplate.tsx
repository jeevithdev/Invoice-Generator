import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

// ─────────────────────────────────────────────
// TEMPLATE 10: Monochrome Editorial
// ─────────────────────────────────────────────
export function MonochromeTemplate({ invoice, tax }: TemplateProps) {
  const cols = invoice.customization.columnNames;

  return (
    <div
      className="bg-white w-full min-h-[1000px] p-12"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      {/* Top bar */}
      <div className="flex justify-between items-end pb-5 mb-8" style={{ borderBottom: '3px solid #111' }}>
        <div>
          {invoice.customization.showLogo && invoice.company.logo ? (
            <img
              src={invoice.company.logo}
              alt="Logo"
              className="h-12 mb-2 object-contain grayscale"
            />
          ) : (
            <h1 className="text-3xl font-black text-black uppercase tracking-tight">
              {invoice.company.name}
            </h1>
          )}
        </div>
        <div className="text-right">
          <p className="text-6xl font-black text-gray-100 absolute -z-10 select-none" style={{ fontSize: 90, lineHeight: 1, letterSpacing: -4, color: '#f0f0f0' }}>
            INV
          </p>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-1">Invoice</p>
          <p className="text-3xl font-black text-black">#{invoice.invoiceNumber}</p>
        </div>
      </div>

      {/* Meta row */}
      <div className="grid grid-cols-4 gap-6 mb-8 pb-8" style={{ borderBottom: '1px solid #ddd' }}>
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-1">Issue Date</p>
          <p className="text-sm font-bold text-black">{invoice.invoiceDate}</p>
        </div>
        {invoice.dueDate && (
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-1">Due Date</p>
            <p className="text-sm font-bold text-black">{invoice.dueDate}</p>
          </div>
        )}
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-1">Currency</p>
          <p className="text-sm font-bold text-black">{invoice.currency}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400 mb-1">Amount Due</p>
          <p className="text-sm font-black text-black">{formatCurrency(tax.grandTotal, invoice.currency)}</p>
        </div>
      </div>

      {/* Parties */}
      <div className="grid grid-cols-2 gap-10 mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3 pb-2" style={{ borderBottom: '1px solid #eee' }}>
            From
          </p>
          <p className="text-base font-black text-black">{invoice.company.name}</p>
          <p className="text-sm text-gray-600 mt-1">{invoice.company.address}</p>
          <p className="text-sm text-gray-600">
            {[invoice.company.city, invoice.company.state, invoice.company.zip].filter(Boolean).join(', ')}
          </p>
          <p className="text-sm text-gray-600 mt-1">{invoice.company.phone}</p>
          <p className="text-sm text-gray-600">{invoice.company.email}</p>
          {invoice.company.gstin && (
            <p className="text-xs text-gray-400 mt-2 font-mono">GSTIN: {invoice.company.gstin}</p>
          )}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3 pb-2" style={{ borderBottom: '1px solid #eee' }}>
            To
          </p>
          <p className="text-base font-black text-black">{invoice.client.name}</p>
          <p className="text-sm text-gray-700 font-medium">{invoice.client.company}</p>
          <p className="text-sm text-gray-600 mt-1">{invoice.client.address}</p>
          <p className="text-sm text-gray-600">
            {[invoice.client.city, invoice.client.state, invoice.client.zip].filter(Boolean).join(', ')}
          </p>
          <p className="text-sm text-gray-600 mt-1">{invoice.client.email}</p>
          {invoice.client.gstin && (
            <p className="text-xs text-gray-400 mt-2 font-mono">GSTIN: {invoice.client.gstin}</p>
          )}
        </div>
      </div>

      {/* Items table */}
      <table className="w-full text-sm mb-8">
        <thead>
          <tr style={{ backgroundColor: '#111', color: '#fff' }}>
            <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider w-10">#</th>
            <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider">{cols.description}</th>
            <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider w-20">{cols.quantity}</th>
            <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider w-28">{cols.rate}</th>
            <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider w-28">{cols.amount}</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr
              key={item.id}
              style={{
                borderBottom: '1px solid #e5e5e5',
                backgroundColor: i % 2 === 1 ? '#f9f9f9' : '#fff',
              }}
            >
              <td className="py-3.5 px-4 text-xs text-gray-400 font-mono">{String(i + 1).padStart(2, '0')}</td>
              <td className="py-3.5 px-4 text-gray-900 font-medium">{item.description}</td>
              <td className="py-3.5 px-4 text-right text-gray-700">{item.quantity}</td>
              <td className="py-3.5 px-4 text-right text-gray-700">{formatCurrency(item.rate, invoice.currency)}</td>
              <td className="py-3.5 px-4 text-right font-black text-gray-900">{formatCurrency(item.subtotal, invoice.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-between gap-8">
        <div className="flex-1 space-y-4">
          <BankDetailsSection invoice={invoice} />
          <NotesSection invoice={invoice} />
          <TermsSection invoice={invoice} />
        </div>
        <div className="w-64">
          <div className="p-5 bg-gray-50" style={{ border: '1px solid #e5e5e5' }}>
            <TotalsSection invoice={invoice} tax={tax} />
            <AmountInWords invoice={invoice} tax={tax} />
          </div>
          {/* Grand total block */}
          <div className="mt-2 p-4 bg-black text-white text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">Total Due</p>
            <p className="text-2xl font-black">{formatCurrency(tax.grandTotal, invoice.currency)}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 pt-4 flex justify-between items-center" style={{ borderTop: '2px solid #111' }}>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Thank you for your business</p>
        <p className="text-xs text-gray-500">{invoice.company.website}</p>
      </div>
    </div>
  );
}
