import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

export function LedgerTemplate({ invoice, tax }: TemplateProps) {
  const cols = invoice.customization.columnNames;

  return (
    <div className="w-full min-h-[1000px] p-10 bg-emerald-50 text-emerald-950">
      <div className="max-w-5xl mx-auto bg-white border-2 border-emerald-700 p-8">
        <div className="flex justify-between mb-8 pb-4 border-b-2 border-emerald-700">
          <div>
            <p className="uppercase text-xs tracking-[0.3em] text-emerald-700">Invoice</p>
            <h1 className="text-3xl font-bold mt-1">{invoice.company.name}</h1>
          </div>
          <div className="text-right text-sm">
            <p className="font-bold">Invoice #{invoice.invoiceNumber}</p>
            <p>{invoice.invoiceDate}</p>
            {invoice.dueDate && <p>Due {invoice.dueDate}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
          <div>
            <p className="font-bold uppercase text-xs text-emerald-700 mb-1">Issued By</p>
            <p>{invoice.company.name}</p>
            <p>{invoice.company.address}</p>
            <p>{[invoice.company.city, invoice.company.state, invoice.company.zip, invoice.company.country].filter(Boolean).join(', ')}</p>
            <p>{invoice.company.email}</p>
          </div>
          <div>
            <p className="font-bold uppercase text-xs text-emerald-700 mb-1">Issued To</p>
            <p>{invoice.client.name}</p>
            <p>{invoice.client.company}</p>
            <p>{invoice.client.address}</p>
            <p>{[invoice.client.city, invoice.client.state, invoice.client.zip, invoice.client.country].filter(Boolean).join(', ')}</p>
          </div>
        </div>

        <table className="w-full mb-8 text-sm border border-emerald-200">
          <thead className="bg-emerald-700 text-white">
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
              <tr key={item.id} className="border-t border-emerald-100">
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
          <div className="w-72 border border-emerald-300 bg-emerald-50 p-4">
            <TotalsSection invoice={invoice} tax={tax} />
            <AmountInWords invoice={invoice} tax={tax} />
          </div>
        </div>
      </div>
    </div>
  );
}
