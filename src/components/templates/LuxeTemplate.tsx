import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

export function LuxeTemplate({ invoice, tax }: TemplateProps) {
  const cols = invoice.customization.columnNames;

  return (
    <div className="w-full min-h-[1000px] p-10 bg-amber-50 text-neutral-900">
      <div className="max-w-5xl mx-auto bg-white border border-amber-300 p-10 shadow-xl">
        <div className="flex justify-between items-start mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-amber-700">Invoice</p>
            <h1 className="text-4xl font-semibold mt-2">{invoice.company.name}</h1>
            <p className="text-sm text-neutral-600 mt-2">{invoice.company.address}</p>
            <p className="text-sm text-neutral-600">{[invoice.company.city, invoice.company.state, invoice.company.zip, invoice.company.country].filter(Boolean).join(', ')}</p>
          </div>
          <div className="text-right border border-amber-300 px-4 py-3 bg-amber-50">
            <p className="text-xs uppercase tracking-widest text-amber-700">Invoice</p>
            <p className="text-2xl font-semibold">#{invoice.invoiceNumber}</p>
            <p className="text-sm text-neutral-600">{invoice.invoiceDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-700 mb-1">Billed By</p>
            <p className="font-medium">{invoice.company.name}</p>
            <p className="text-sm text-neutral-600">{invoice.company.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-700 mb-1">Billed To</p>
            <p className="font-medium">{invoice.client.name}</p>
            <p className="text-sm text-neutral-600">{invoice.client.company}</p>
            <p className="text-sm text-neutral-600">{invoice.client.address}</p>
            <p className="text-sm text-neutral-600">{[invoice.client.city, invoice.client.state, invoice.client.zip, invoice.client.country].filter(Boolean).join(', ')}</p>
            <p className="text-sm text-neutral-600">{invoice.client.email}</p>
          </div>
        </div>

        <table className="w-full mb-8 text-sm border border-amber-200">
          <thead className="bg-amber-100">
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
              <tr key={item.id} className="border-t border-amber-100">
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
          <div className="w-72 border border-amber-300 bg-amber-50 p-4">
            <TotalsSection invoice={invoice} tax={tax} />
            <AmountInWords invoice={invoice} tax={tax} />
          </div>
        </div>
      </div>
    </div>
  );
}
