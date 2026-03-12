import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection , fmtDate } from './TemplateShared';

export function AuroraTemplate({ invoice, tax }: TemplateProps) {
  const accent = invoice.customization.accentColor;
  const cols = invoice.customization.columnNames;

  return (
    <div className="w-full min-h-[1000px] p-10 text-slate-800" style={{ background: `linear-gradient(160deg, ${accent}15, #ffffff 45%, #0ea5e910)` }}>
      <div className="bg-white/90 backdrop-blur rounded-3xl border border-slate-200 shadow-xl p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Invoice</p>
            <h1 className="text-3xl font-black mt-1" style={{ color: accent }}>{invoice.company.name}</h1>
            <p className="text-sm text-slate-600 mt-2">{invoice.company.address}</p>
            <p className="text-sm text-slate-500">{[invoice.company.city, invoice.company.state, invoice.company.zip].filter(Boolean).join(', ')}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Invoice No.</p>
            <p className="text-xl font-bold">#{invoice.invoiceNumber}</p>
            <p className="text-sm text-slate-500 mt-2">Date: {fmtDate(invoice, invoice.invoiceDate)}</p>
            {invoice.dueDate && <p className="text-sm text-slate-500">Due: {fmtDate(invoice, invoice.dueDate)}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="rounded-2xl p-4" style={{ backgroundColor: accent + '10' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: accent }}>From</p>
            <p className="font-semibold">{invoice.company.name}</p>
            <p className="text-sm text-slate-600">{invoice.company.address}</p>
            <p className="text-sm text-slate-600">{[invoice.company.city, invoice.company.state, invoice.company.zip, invoice.company.country].filter(Boolean).join(', ')}</p>
            <p className="text-sm text-slate-600">{invoice.company.email}</p>
            <p className="text-sm text-slate-600">{invoice.company.phone}</p>
            {invoice.company.gstin && <p className="text-xs text-slate-500 mt-1">GSTIN: {invoice.company.gstin}</p>}
          </div>
          <div className="rounded-2xl p-4 bg-slate-50">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500">Bill To</p>
            <p className="font-semibold">{invoice.client.name}</p>
            <p className="text-sm text-slate-600">{invoice.client.company}</p>
            <p className="text-sm text-slate-600">{invoice.client.address}</p>
            <p className="text-sm text-slate-600">{[invoice.client.city, invoice.client.state, invoice.client.zip, invoice.client.country].filter(Boolean).join(', ')}</p>
            <p className="text-sm text-slate-600">{invoice.client.email}</p>
            {invoice.client.gstin && <p className="text-xs text-slate-500 mt-1">GSTIN: {invoice.client.gstin}</p>}
          </div>
        </div>

        <table className="w-full text-sm border-separate border-spacing-y-2 mb-8">
          <thead>
            <tr>
              <th className="text-left px-3 py-2 text-xs uppercase text-slate-500">#</th>
              <th className="text-left px-3 py-2 text-xs uppercase text-slate-500">{cols.description}</th>
              <th className="text-right px-3 py-2 text-xs uppercase text-slate-500">{cols.quantity}</th>
              <th className="text-right px-3 py-2 text-xs uppercase text-slate-500">{cols.rate}</th>
              <th className="text-right px-3 py-2 text-xs uppercase text-slate-500">{cols.amount}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={item.id} className="bg-slate-50/80">
                <td className="px-3 py-2 rounded-l-xl">{i + 1}</td>
                <td className="px-3 py-2">{item.description}</td>
                <td className="px-3 py-2 text-right">{item.quantity}</td>
                <td className="px-3 py-2 text-right">{item.rate.toLocaleString()}</td>
                <td className="px-3 py-2 text-right rounded-r-xl font-semibold">{item.subtotal.toLocaleString()}</td>
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
          <div className="w-72 rounded-2xl border border-slate-200 p-4 bg-white">
            <TotalsSection invoice={invoice} tax={tax} />
            <AmountInWords invoice={invoice} tax={tax} />
          </div>
        </div>
      </div>
    </div>
  );
}
