import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

export function TerminalTemplate({ invoice, tax }: TemplateProps) {
  const cols = invoice.customization.columnNames;

  return (
    <div className="w-full min-h-[1000px] p-10 bg-black text-green-300" style={{ fontFamily: 'monospace' }}>
      <div className="max-w-5xl mx-auto border border-green-500 bg-black p-8 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-green-500">Invoice</p>
            <h1 className="text-3xl font-bold mt-2">{invoice.company.name}</h1>
            <p className="text-sm text-green-400">{invoice.company.email}</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-bold">ID: {invoice.invoiceNumber}</p>
            <p>DATE: {invoice.invoiceDate}</p>
            {invoice.dueDate && <p>DUE: {invoice.dueDate}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6 text-sm border border-green-800 p-4">
          <div>
            <p className="uppercase text-xs text-green-500 mb-1">Source</p>
            <p>{invoice.company.name}</p>
            <p>{invoice.company.address}</p>
            <p>{[invoice.company.city, invoice.company.state, invoice.company.zip, invoice.company.country].filter(Boolean).join(', ')}</p>
          </div>
          <div>
            <p className="uppercase text-xs text-green-500 mb-1">Destination</p>
            <p>{invoice.client.name}</p>
            <p>{invoice.client.company}</p>
            <p>{invoice.client.address}</p>
            <p>{[invoice.client.city, invoice.client.state, invoice.client.zip, invoice.client.country].filter(Boolean).join(', ')}</p>
          </div>
        </div>

        <table className="w-full mb-8 text-sm border border-green-700">
          <thead className="bg-green-950">
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
              <tr key={item.id} className="border-t border-green-900">
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
          <div className="flex-1 space-y-3 text-green-300">
            <BankDetailsSection invoice={invoice} />
            <NotesSection invoice={invoice} />
            <TermsSection invoice={invoice} />
          </div>
          <div className="w-72 border border-green-700 bg-green-950/40 p-4">
            <TotalsSection invoice={invoice} tax={tax} />
            <AmountInWords invoice={invoice} tax={tax} />
          </div>
        </div>
      </div>
    </div>
  );
}
