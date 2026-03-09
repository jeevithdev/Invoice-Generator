import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

export function ZenTemplate({ invoice, tax }: TemplateProps) {
  const cols = invoice.customization.columnNames;

  return (
    <div className="w-full min-h-[1000px] p-12 bg-stone-100 text-stone-800">
      <div className="max-w-5xl mx-auto bg-white border border-stone-300 p-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Invoice</p>
            <h1 className="text-4xl font-light mt-2">{invoice.company.name}</h1>
          </div>
          <div className="text-right text-sm text-stone-600 space-y-1">
            <p className="font-medium text-stone-800">#{invoice.invoiceNumber}</p>
            <p>{invoice.invoiceDate}</p>
            {invoice.dueDate && <p>Due {invoice.dueDate}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-stone-500 mb-2">From</p>
            <p>{invoice.company.name}</p>
            <p className="text-sm text-stone-600">{invoice.company.address}</p>
            <p className="text-sm text-stone-600">{[invoice.company.city, invoice.company.state, invoice.company.zip, invoice.company.country].filter(Boolean).join(', ')}</p>
            <p className="text-sm text-stone-600">{invoice.company.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-stone-500 mb-2">For</p>
            <p>{invoice.client.name}</p>
            <p className="text-sm text-stone-600">{invoice.client.company}</p>
            <p className="text-sm text-stone-600">{invoice.client.address}</p>
            <p className="text-sm text-stone-600">{[invoice.client.city, invoice.client.state, invoice.client.zip, invoice.client.country].filter(Boolean).join(', ')}</p>
            <p className="text-sm text-stone-600">{invoice.client.email}</p>
          </div>
        </div>

        <table className="w-full mb-8 text-sm">
          <thead>
            <tr className="border-y border-stone-300 text-stone-500 uppercase text-xs">
              <th className="py-2 text-left">#</th>
              <th className="py-2 text-left">{cols.description}</th>
              <th className="py-2 text-right">{cols.quantity}</th>
              <th className="py-2 text-right">{cols.rate}</th>
              <th className="py-2 text-right">{cols.amount}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={item.id} className="border-b border-stone-200">
                <td className="py-3">{i + 1}</td>
                <td className="py-3">{item.description}</td>
                <td className="py-3 text-right">{item.quantity}</td>
                <td className="py-3 text-right">{formatCurrency(item.rate, invoice.currency)}</td>
                <td className="py-3 text-right">{formatCurrency(item.subtotal, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between gap-10">
          <div className="flex-1 space-y-4">
            <BankDetailsSection invoice={invoice} />
            <NotesSection invoice={invoice} />
            <TermsSection invoice={invoice} />
          </div>
          <div className="w-72 border border-stone-300 p-5">
            <TotalsSection invoice={invoice} tax={tax} />
            <AmountInWords invoice={invoice} tax={tax} />
          </div>
        </div>
      </div>
    </div>
  );
}
