import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

// ─────────────────────────────────────────────
// TEMPLATE 9: Sidebar Layout
// ─────────────────────────────────────────────
export function SidebarTemplate({ invoice, tax }: TemplateProps) {
  const accent = invoice.customization.accentColor;
  const cols = invoice.customization.columnNames;

  return (
    <div className="bg-white w-full min-h-[1000px] flex" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Left accent sidebar */}
      <div
        className="w-56 flex-shrink-0 flex flex-col px-6 py-10"
        style={{ backgroundColor: accent, minHeight: '100%' }}
      >
        {/* Logo / Company name */}
        <div className="mb-8">
          {invoice.customization.showLogo && invoice.company.logo ? (
            <img
              src={invoice.company.logo}
              alt="Logo"
              className="h-12 mb-3 object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          ) : (
            <h1 className="text-lg font-black text-white leading-tight">
              {invoice.company.name}
            </h1>
          )}
        </div>

        {/* Invoice badge */}
        <div className="mb-8 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.25)' }}>
          <p className="text-white/60 text-xs uppercase tracking-[0.2em] mb-1">Invoice</p>
          <p className="text-white font-bold text-xl">#{invoice.invoiceNumber}</p>
        </div>

        {/* Dates */}
        <div className="mb-8 pb-8 space-y-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.25)' }}>
          <div>
            <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Issued</p>
            <p className="text-white text-sm font-semibold">{invoice.invoiceDate}</p>
          </div>
          {invoice.dueDate && (
            <div>
              <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Due</p>
              <p className="text-white text-sm font-semibold">{invoice.dueDate}</p>
            </div>
          )}
          <div>
            <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Currency</p>
            <p className="text-white text-sm font-semibold">{invoice.currency}</p>
          </div>
        </div>

        {/* From */}
        <div className="mb-8 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.25)' }}>
          <p className="text-white/60 text-xs uppercase tracking-widest mb-2">From</p>
          <p className="text-white font-semibold text-sm">{invoice.company.name}</p>
          <p className="text-white/70 text-xs mt-1 leading-relaxed">
            {[invoice.company.address, invoice.company.city, invoice.company.state, invoice.company.zip, invoice.company.country].filter(Boolean).join(', ')}
          </p>
          <p className="text-white/70 text-xs mt-1">{invoice.company.phone}</p>
          <p className="text-white/70 text-xs">{invoice.company.email}</p>
          {invoice.company.gstin && (
            <p className="text-white/50 text-xs mt-2">GSTIN: {invoice.company.gstin}</p>
          )}
        </div>

        {/* To */}
        <div className="mb-8">
          <p className="text-white/60 text-xs uppercase tracking-widest mb-2">To</p>
          <p className="text-white font-semibold text-sm">{invoice.client.name}</p>
          <p className="text-white/80 text-xs">{invoice.client.company}</p>
          <p className="text-white/70 text-xs mt-1 leading-relaxed">
            {[invoice.client.address, invoice.client.city, invoice.client.state, invoice.client.zip, invoice.client.country].filter(Boolean).join(', ')}
          </p>
          <p className="text-white/70 text-xs mt-1">{invoice.client.email}</p>
          {invoice.client.gstin && (
            <p className="text-white/50 text-xs mt-2">GSTIN: {invoice.client.gstin}</p>
          )}
        </div>

        {/* Total due */}
        <div
          className="mt-auto p-4 rounded-xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          <p className="text-white/70 text-xs uppercase tracking-widest mb-1">Total Due</p>
          <p className="text-white font-black text-xl leading-tight">
            {formatCurrency(tax.grandTotal, invoice.currency)}
          </p>
        </div>
      </div>

      {/* Right main area */}
      <div className="flex-1 px-10 py-10">
        {/* Title row */}
        <div className="flex justify-between items-center mb-8 pb-4" style={{ borderBottom: `2px solid ${accent}20` }}>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Invoice</h2>
          <span className="text-sm font-medium text-gray-400">#{invoice.invoiceNumber}</span>
        </div>

        {/* Items table */}
        <table className="w-full text-sm mb-8">
          <thead>
            <tr style={{ borderBottom: `2px solid ${accent}` }}>
              <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400 w-10">#</th>
              <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">{cols.description}</th>
              <th className="pb-3 text-right text-xs font-bold uppercase tracking-wider text-gray-400 w-20">{cols.quantity}</th>
              <th className="pb-3 text-right text-xs font-bold uppercase tracking-wider text-gray-400 w-28">{cols.rate}</th>
              <th className="pb-3 text-right text-xs font-bold uppercase tracking-wider text-gray-400 w-28">{cols.amount}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr
                key={item.id}
                className="border-b border-gray-100"
              >
                <td className="py-3.5 text-xs text-gray-300 font-mono">{String(i + 1).padStart(2, '0')}</td>
                <td className="py-3.5 text-gray-800 font-medium">{item.description}</td>
                <td className="py-3.5 text-right text-gray-600">{item.quantity}</td>
                <td className="py-3.5 text-right text-gray-600">{formatCurrency(item.rate, invoice.currency)}</td>
                <td className="py-3.5 text-right font-bold text-gray-900">{formatCurrency(item.subtotal, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals box */}
        <div className="flex justify-end mb-8">
          <div
            className="w-64 p-5 rounded-xl"
            style={{ border: `1px solid ${accent}30`, background: `${accent}08` }}
          >
            <TotalsSection invoice={invoice} tax={tax} />
            <AmountInWords invoice={invoice} tax={tax} />
          </div>
        </div>

        {/* Bank / Notes / Terms */}
        <div
          className="pt-6 space-y-4"
          style={{ borderTop: `1px solid ${accent}20` }}
        >
          <BankDetailsSection invoice={invoice} />
          <NotesSection invoice={invoice} />
          <TermsSection invoice={invoice} />
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-gray-400">
          Thank you for your business · {invoice.company.website}
        </div>
      </div>
    </div>
  );
}
