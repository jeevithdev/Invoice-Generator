import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

export function OceanicTemplate({ invoice, tax }: TemplateProps) {
  const cols = invoice.customization.columnNames;

  return (
    <div className="w-full min-h-[1000px] p-10 bg-cyan-50 text-cyan-950">
      <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden border border-cyan-200 bg-white shadow-lg">
        <div className="p-8" style={{ background: 'linear-gradient(120deg, #06b6d4, #0284c7)' }}>
          <div className="flex justify-between items-end text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/80">Oceanic</p>
              <h1 className="text-3xl font-black mt-1">{invoice.company.name}</h1>
            </div>
            <div className="text-right text-sm">
              <p className="font-bold text-lg">#{invoice.invoiceNumber}</p>
              <p>{invoice.invoiceDate}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="rounded-xl p-4 border border-cyan-200 bg-cyan-50">
              <p className="text-xs uppercase tracking-widest text-cyan-700 mb-1">Sender</p>
              <p className="font-semibold">{invoice.company.name}</p>
              <p className="text-sm text-cyan-900/80">{invoice.company.email}</p>
              <p className="text-sm text-cyan-900/80">{invoice.company.phone}</p>
            </div>
            <div className="rounded-xl p-4 border border-sky-200 bg-sky-50">
              <p className="text-xs uppercase tracking-widest text-sky-700 mb-1">Recipient</p>
              <p className="font-semibold">{invoice.client.name}</p>
              <p className="text-sm text-sky-900/80">{invoice.client.company}</p>
              <p className="text-sm text-sky-900/80">{invoice.client.email}</p>
            </div>
          </div>

          <table className="w-full mb-8 text-sm">
            <thead className="bg-cyan-100">
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
                <tr key={item.id} className="border-b border-cyan-100">
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
            <div className="w-72 rounded-xl border border-cyan-200 bg-cyan-50 p-4">
              <TotalsSection invoice={invoice} tax={tax} />
              <AmountInWords invoice={invoice} tax={tax} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
