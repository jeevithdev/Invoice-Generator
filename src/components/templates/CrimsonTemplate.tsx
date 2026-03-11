import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection , fmtDate } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

// ─────────────────────────────────────────────
// TEMPLATE 24: Crimson Editorial
// ─────────────────────────────────────────────
export function CrimsonTemplate({ invoice, tax }: TemplateProps) {
  const cols = invoice.customization.columnNames;
  const accent = '#b91c1c';

  return (
    <div className="bg-rose-50 w-full min-h-[1000px] p-10 font-sans" style={{ fontFamily: 'inherit' }}>
      <div className="bg-white border border-rose-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b" style={{ borderColor: '#fecdd3' }}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.25em]" style={{ color: accent }}>Invoice</p>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">{invoice.company.name}</h1>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-slate-900">#{invoice.invoiceNumber}</p>
              <p className="text-sm text-slate-500">{fmtDate(invoice, invoice.invoiceDate)}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: accent }}>From</p>
              <p className="font-semibold">{invoice.company.name}</p>
              <p className="text-sm text-slate-600">{invoice.company.address}</p>
              <p className="text-sm text-slate-600">{[invoice.company.city, invoice.company.state, invoice.company.zip, invoice.company.country].filter(Boolean).join(', ')}</p>
              <p className="text-sm text-slate-600">{invoice.company.email}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: accent }}>To</p>
              <p className="font-semibold">{invoice.client.name}</p>
              <p className="text-sm text-slate-600">{invoice.client.company}</p>
              <p className="text-sm text-slate-600">{invoice.client.address}</p>
              <p className="text-sm text-slate-600">{[invoice.client.city, invoice.client.state, invoice.client.zip, invoice.client.country].filter(Boolean).join(', ')}</p>
              <p className="text-sm text-slate-600">{invoice.client.email}</p>
            </div>
          </div>

          <table className="w-full mb-8 text-sm">
            <thead>
              <tr style={{ backgroundColor: '#ffe4e6' }}>
                <th className="py-2 px-3 text-left">#</th>
                <th className="py-2 px-3 text-left">{cols.description}</th>
                <th className="py-2 px-3 text-right">{cols.quantity}</th>
                <th className="py-2 px-3 text-right">{cols.rate}</th>
                <th className="py-2 px-3 text-right">{cols.amount}</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={item.id} className="border-b" style={{ borderColor: '#ffe4e6' }}>
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
            <div className="w-72 rounded-xl border border-rose-200 bg-rose-50 p-4">
              <TotalsSection invoice={invoice} tax={tax} />
              <AmountInWords invoice={invoice} tax={tax} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
