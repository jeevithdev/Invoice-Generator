import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

export function SunriseTemplate({ invoice, tax }: TemplateProps) {
  const cols = invoice.customization.columnNames;

  return (
    <div className="w-full min-h-[1000px] p-10 text-orange-950" style={{ background: 'linear-gradient(180deg, #fff7ed 0%, #ffffff 55%, #ffedd5 100%)' }}>
      <div className="bg-white rounded-3xl border border-orange-200 overflow-hidden shadow-lg">
        <div className="p-8 text-white" style={{ background: 'linear-gradient(120deg, #f97316 0%, #fb7185 100%)' }}>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/80">Service Invoice</p>
              <h1 className="text-3xl font-black mt-2">{invoice.company.name}</h1>
            </div>
            <div className="text-right">
              <p className="font-semibold">#{invoice.invoiceNumber}</p>
              <p className="text-sm text-white/90">{invoice.invoiceDate}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="p-4 rounded-2xl bg-orange-50">
              <p className="text-xs uppercase tracking-widest text-orange-600 mb-1">From</p>
              <p className="font-semibold">{invoice.company.name}</p>
              <p className="text-sm text-orange-900/75">{invoice.company.email}</p>
              <p className="text-sm text-orange-900/75">{invoice.company.phone}</p>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50">
              <p className="text-xs uppercase tracking-widest text-rose-600 mb-1">To</p>
              <p className="font-semibold">{invoice.client.name}</p>
              <p className="text-sm text-rose-900/75">{invoice.client.company}</p>
              <p className="text-sm text-rose-900/75">{invoice.client.email}</p>
            </div>
          </div>

          <table className="w-full mb-8 text-sm">
            <thead>
              <tr className="border-b-2 border-orange-200">
                <th className="text-left py-2">#</th>
                <th className="text-left py-2">{cols.description}</th>
                <th className="text-right py-2">{cols.quantity}</th>
                <th className="text-right py-2">{cols.rate}</th>
                <th className="text-right py-2">{cols.amount}</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={item.id} className="border-b border-orange-100">
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
            <div className="w-72 rounded-2xl p-4 bg-orange-50 border border-orange-200">
              <TotalsSection invoice={invoice} tax={tax} />
              <AmountInWords invoice={invoice} tax={tax} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
