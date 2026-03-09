import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

// ─────────────────────────────────────────────
// TEMPLATE 25: Mono Grid
// ─────────────────────────────────────────────
export function MonoGridTemplate({ invoice, tax }: TemplateProps) {
  const cols = invoice.customization.columnNames;

  return (
    <div className="bg-white w-full min-h-[1000px] p-10" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
      <div className="border-2 border-black p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Invoice</p>
            <h1 className="text-2xl font-bold">{invoice.company.name}</h1>
            <p className="text-sm text-gray-600">{invoice.company.email}</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-bold">#{invoice.invoiceNumber}</p>
            <p>{invoice.invoiceDate}</p>
            {invoice.dueDate && <p>Due {invoice.dueDate}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="border border-black p-3">
            <p className="uppercase text-xs mb-1 text-gray-500">From</p>
            <p>{invoice.company.name}</p>
            <p>{invoice.company.address}</p>
            <p>{[invoice.company.city, invoice.company.state, invoice.company.zip, invoice.company.country].filter(Boolean).join(', ')}</p>
          </div>
          <div className="border border-black p-3">
            <p className="uppercase text-xs mb-1 text-gray-500">To</p>
            <p>{invoice.client.name}</p>
            <p>{invoice.client.company}</p>
            <p>{invoice.client.address}</p>
            <p>{[invoice.client.city, invoice.client.state, invoice.client.zip, invoice.client.country].filter(Boolean).join(', ')}</p>
          </div>
        </div>

        <table className="w-full mb-8 text-sm border border-black">
          <thead className="bg-black text-white">
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
              <tr key={item.id} className="border-t border-black">
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
          <div className="flex-1 space-y-3">
            <BankDetailsSection invoice={invoice} />
            <NotesSection invoice={invoice} />
            <TermsSection invoice={invoice} />
          </div>
          <div className="w-72 border border-black p-4">
            <TotalsSection invoice={invoice} tax={tax} />
            <AmountInWords invoice={invoice} tax={tax} />
          </div>
        </div>
      </div>
    </div>
  );
}
