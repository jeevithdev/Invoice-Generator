import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection , fmtDate } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

export function BlueprintTemplate({ invoice, tax }: TemplateProps) {
  const cols = invoice.customization.columnNames;

  return (
    <div className="w-full min-h-[1000px] p-10 text-blue-950 bg-blue-50" style={{ backgroundImage: 'linear-gradient(#dbeafe 1px, transparent 1px), linear-gradient(90deg, #dbeafe 1px, transparent 1px)', backgroundSize: '26px 26px' }}>
      <div className="bg-white border-2 border-blue-900 p-8 shadow-[8px_8px_0_0_#1e3a8a]">
        <div className="flex justify-between mb-8 pb-4 border-b-2 border-blue-900">
          <div>
            <p className="text-xs uppercase tracking-[0.25em]">Invoice</p>
            <h1 className="text-3xl font-black mt-2">{invoice.company.name}</h1>
          </div>
          <div className="text-right text-sm font-medium">
            <p>Ref: #{invoice.invoiceNumber}</p>
            <p>Issued: {fmtDate(invoice, invoice.invoiceDate)}</p>
            {invoice.dueDate && <p>Due: {fmtDate(invoice, invoice.dueDate)}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
          <div>
            <p className="font-bold uppercase text-xs mb-1">Contractor</p>
            <p>{invoice.company.name}</p>
            <p>{invoice.company.address}</p>
            <p>{[invoice.company.city, invoice.company.state, invoice.company.zip, invoice.company.country].filter(Boolean).join(', ')}</p>
            <p>{invoice.company.email}</p>
          </div>
          <div>
            <p className="font-bold uppercase text-xs mb-1">Client</p>
            <p>{invoice.client.name}</p>
            <p>{invoice.client.company}</p>
            <p>{invoice.client.address}</p>
            <p>{[invoice.client.city, invoice.client.state, invoice.client.zip, invoice.client.country].filter(Boolean).join(', ')}</p>
          </div>
        </div>

        <table className="w-full border-2 border-blue-900 mb-8 text-sm">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="px-3 py-2 text-left w-10">#</th>
              <th className="px-3 py-2 text-left">{cols.description}</th>
              <th className="px-3 py-2 text-right">{cols.quantity}</th>
              <th className="px-3 py-2 text-right">{cols.rate}</th>
              <th className="px-3 py-2 text-right">{cols.amount}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={item.id} className="border-t border-blue-200">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2">{item.description}</td>
                <td className="px-3 py-2 text-right">{item.quantity}</td>
                <td className="px-3 py-2 text-right">{formatCurrency(item.rate, invoice.currency)}</td>
                <td className="px-3 py-2 text-right font-semibold">{formatCurrency(item.subtotal, invoice.currency)}</td>
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
          <div className="w-72 border-2 border-blue-900 p-4 bg-blue-50">
            <TotalsSection invoice={invoice} tax={tax} />
            <AmountInWords invoice={invoice} tax={tax} />
          </div>
        </div>
      </div>
    </div>
  );
}
