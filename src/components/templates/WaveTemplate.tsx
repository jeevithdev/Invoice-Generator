import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

export function WaveTemplate({ invoice, tax }: TemplateProps) {
  const cols = invoice.customization.columnNames;

  return (
    <div className="w-full min-h-[1000px] p-10 text-slate-900" style={{ background: 'radial-gradient(circle at 15% 10%, #dbeafe 0, transparent 40%), radial-gradient(circle at 90% 85%, #bfdbfe 0, transparent 45%), #f8fafc' }}>
      <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-blue-200 overflow-hidden shadow-lg">
        <div className="h-3" style={{ background: 'linear-gradient(90deg, #0ea5e9, #3b82f6, #1d4ed8)' }} />
        <div className="p-8">
          <div className="flex justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-blue-600">Flow Invoice</p>
              <h1 className="text-3xl font-black mt-1">{invoice.company.name}</h1>
            </div>
            <div className="text-right text-sm text-slate-600">
              <p className="font-bold text-slate-900">#{invoice.invoiceNumber}</p>
              <p>{invoice.invoiceDate}</p>
              {invoice.dueDate && <p>{invoice.dueDate}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
            <div className="rounded-xl border border-blue-200 p-4">
              <p className="uppercase text-xs tracking-widest text-blue-600 mb-1">From</p>
              <p className="font-semibold">{invoice.company.name}</p>
              <p>{invoice.company.email}</p>
            </div>
            <div className="rounded-xl border border-blue-200 p-4">
              <p className="uppercase text-xs tracking-widest text-blue-600 mb-1">To</p>
              <p className="font-semibold">{invoice.client.name}</p>
              <p>{invoice.client.company}</p>
            </div>
          </div>

          <table className="w-full mb-8 text-sm">
            <thead>
              <tr className="text-blue-700 border-b-2 border-blue-200">
                <th className="text-left py-2">#</th>
                <th className="text-left py-2">{cols.description}</th>
                <th className="text-right py-2">{cols.quantity}</th>
                <th className="text-right py-2">{cols.rate}</th>
                <th className="text-right py-2">{cols.amount}</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={item.id} className="border-b border-blue-100">
                  <td className="py-2">{i + 1}</td>
                  <td className="py-2">{item.description}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">{formatCurrency(item.rate, invoice.currency)}</td>
                  <td className="py-2 text-right font-semibold">{formatCurrency(item.subtotal, invoice.currency)}</td>
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
            <div className="w-72 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <TotalsSection invoice={invoice} tax={tax} />
              <AmountInWords invoice={invoice} tax={tax} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
