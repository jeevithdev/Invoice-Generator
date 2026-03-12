import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection , fmtDate } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

export function CharcoalTemplate({ invoice, tax }: TemplateProps) {
  const cols = invoice.customization.columnNames;

  return (
    <div className="w-full min-h-[1000px] p-10 bg-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto bg-zinc-900 border border-zinc-700 rounded-2xl p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Invoice</p>
            <h1 className="text-3xl font-bold mt-1">{invoice.company.name}</h1>
            <p className="text-sm text-zinc-400 mt-1">{invoice.company.email}</p>
          </div>
          <div className="text-right text-sm text-zinc-300">
            <p className="text-xl font-bold text-zinc-100">#{invoice.invoiceNumber}</p>
            <p>{fmtDate(invoice, invoice.invoiceDate)}</p>
            {invoice.dueDate && <p>Due {fmtDate(invoice, invoice.dueDate)}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
          <div className="rounded-xl bg-zinc-800 p-4 border border-zinc-700">
            <p className="text-zinc-400 uppercase text-xs mb-1">From</p>
            <p>{invoice.company.name}</p>
            <p className="text-zinc-400">{invoice.company.address}</p>
            <p className="text-zinc-400">{[invoice.company.city, invoice.company.state, invoice.company.zip, invoice.company.country].filter(Boolean).join(', ')}</p>
            {invoice.company.gstin && <p className="text-zinc-400 text-xs mt-1">GSTIN: {invoice.company.gstin}</p>}
          </div>
          <div className="rounded-xl bg-zinc-800 p-4 border border-zinc-700">
            <p className="text-zinc-400 uppercase text-xs mb-1">To</p>
            <p>{invoice.client.name}</p>
            <p className="text-zinc-400">{invoice.client.company}</p>
            <p className="text-zinc-400">{invoice.client.address}</p>
            <p className="text-zinc-400">{[invoice.client.city, invoice.client.state, invoice.client.zip, invoice.client.country].filter(Boolean).join(', ')}</p>
            {invoice.client.gstin && <p className="text-zinc-400 text-xs mt-1">GSTIN: {invoice.client.gstin}</p>}
          </div>
        </div>

        <table className="w-full mb-8 text-sm rounded-xl overflow-hidden">
          <thead className="bg-zinc-800 text-zinc-300 uppercase text-xs">
            <tr>
              <th className="py-2 px-3 text-left">#</th>
              <th className="py-2 px-3 text-left">{cols.description}</th>
              <th className="py-2 px-3 text-right">{cols.quantity}</th>
              <th className="py-2 px-3 text-right">{cols.rate}</th>
              <th className="py-2 px-3 text-right">{cols.amount}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={item.id} className="border-b border-zinc-800">
                <td className="py-2 px-3">{i + 1}</td>
                <td className="py-2 px-3">{item.description}</td>
                <td className="py-2 px-3 text-right">{item.quantity}</td>
                <td className="py-2 px-3 text-right">{formatCurrency(item.rate, invoice.currency)}</td>
                <td className="py-2 px-3 text-right font-semibold">{formatCurrency(item.subtotal, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between gap-8">
          <div className="flex-1 space-y-3 text-zinc-300">
            <BankDetailsSection invoice={invoice} />
            <NotesSection invoice={invoice} />
            <TermsSection invoice={invoice} />
          </div>
          <div className="w-72 bg-zinc-800 border border-zinc-700 rounded-xl p-4">
            <TotalsSection invoice={invoice} tax={tax} />
            <AmountInWords invoice={invoice} tax={tax} />
          </div>
        </div>
      </div>
    </div>
  );
}
