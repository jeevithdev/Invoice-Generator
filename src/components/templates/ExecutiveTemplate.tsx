import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection , fmtDate } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

// ─────────────────────────────────────────────
// TEMPLATE 22: Executive
// ─────────────────────────────────────────────
export function ExecutiveTemplate({ invoice, tax }: TemplateProps) {
  const cols = invoice.customization.columnNames;
  const accent = '#334155';

  return (
    <div className="bg-white w-full min-h-[1000px] p-12 font-sans" style={{ fontFamily: 'inherit' }}>
      <div className="flex justify-between items-start mb-10">
        <div>
          {invoice.customization.showLogo && invoice.company.logo && (
            <img src={invoice.company.logo} alt="Logo" className="h-12 mb-3 object-contain" />
          )}
          <h1 className="text-2xl font-bold text-slate-900">{invoice.company.name}</h1>
          <p className="text-sm text-slate-500">{invoice.company.address}</p>
          <p className="text-sm text-slate-500">{[invoice.company.city, invoice.company.state, invoice.company.zip, invoice.company.country].filter(Boolean).join(', ')}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Invoice</p>
          <p className="text-4xl font-light text-slate-900 mt-1">#{invoice.invoiceNumber}</p>
          <p className="text-sm text-slate-500 mt-2">Issued {fmtDate(invoice, invoice.invoiceDate)}</p>
          {invoice.dueDate && <p className="text-sm text-slate-500">Due {fmtDate(invoice, invoice.dueDate)}</p>}
        </div>
      </div>

      <div className="h-px mb-8" style={{ backgroundColor: '#cbd5e1' }} />

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Bill To</p>
          <p className="font-semibold text-slate-900">{invoice.client.name}</p>
          <p className="text-sm text-slate-600">{invoice.client.company}</p>
          <p className="text-sm text-slate-600">{invoice.client.address}</p>
          <p className="text-sm text-slate-600">{[invoice.client.city, invoice.client.state, invoice.client.zip, invoice.client.country].filter(Boolean).join(', ')}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">Amount Due</p>
          <p className="text-3xl font-bold" style={{ color: accent }}>{formatCurrency(tax.grandTotal, invoice.currency)}</p>
          <p className="text-xs text-slate-500 mt-1">Currency: {invoice.currency}</p>
        </div>
      </div>

      <table className="w-full mb-8 text-sm border border-slate-200 rounded-xl overflow-hidden">
        <thead className="bg-slate-800 text-slate-100">
          <tr>
            <th className="py-3 px-4 text-left w-10">#</th>
            <th className="py-3 px-4 text-left">{cols.description}</th>
            <th className="py-3 px-4 text-right">{cols.quantity}</th>
            <th className="py-3 px-4 text-right">{cols.rate}</th>
            <th className="py-3 px-4 text-right">{cols.amount}</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={item.id} className="border-t border-slate-100">
              <td className="py-3 px-4">{i + 1}</td>
              <td className="py-3 px-4">{item.description}</td>
              <td className="py-3 px-4 text-right">{item.quantity}</td>
              <td className="py-3 px-4 text-right">{formatCurrency(item.rate, invoice.currency)}</td>
              <td className="py-3 px-4 text-right font-semibold">{formatCurrency(item.subtotal, invoice.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between gap-8">
        <div className="flex-1 space-y-3">
          <BankDetailsSection invoice={invoice} />
          <NotesSection invoice={invoice} />
          <TermsSection invoice={invoice} />
        </div>
        <div className="w-72 border border-slate-200 rounded-xl p-5 bg-slate-50">
          <TotalsSection invoice={invoice} tax={tax} />
          <AmountInWords invoice={invoice} tax={tax} />
        </div>
      </div>
    </div>
  );
}
