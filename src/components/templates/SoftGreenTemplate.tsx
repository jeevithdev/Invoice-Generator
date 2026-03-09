import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

// ─────────────────────────────────────────────
// TEMPLATE 23: Soft Green
// ─────────────────────────────────────────────
export function SoftGreenTemplate({ invoice, tax }: TemplateProps) {
  const cols = invoice.customization.columnNames;
  const accent = '#15803d';

  return (
    <div className="bg-emerald-50 w-full min-h-[1000px] p-10 font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            {invoice.customization.showLogo && invoice.company.logo && (
              <img src={invoice.company.logo} alt="Logo" className="h-12 mb-2 object-contain" />
            )}
            <h1 className="text-2xl font-bold text-slate-900">{invoice.company.name}</h1>
            <p className="text-sm text-slate-500">{invoice.company.email}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest" style={{ color: accent }}>Invoice</p>
            <p className="text-2xl font-black text-slate-900">#{invoice.invoiceNumber}</p>
            <p className="text-sm text-slate-500">{invoice.invoiceDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#dcfce7' }}>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: accent }}>From</p>
            <p className="font-semibold">{invoice.company.name}</p>
            <p className="text-sm text-slate-600">{invoice.company.address}</p>
            <p className="text-sm text-slate-600">{[invoice.company.city, invoice.company.state, invoice.company.zip, invoice.company.country].filter(Boolean).join(', ')}</p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: '#ecfdf5' }}>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: accent }}>Bill To</p>
            <p className="font-semibold">{invoice.client.name}</p>
            <p className="text-sm text-slate-600">{invoice.client.company}</p>
            <p className="text-sm text-slate-600">{invoice.client.address}</p>
            <p className="text-sm text-slate-600">{[invoice.client.city, invoice.client.state, invoice.client.zip, invoice.client.country].filter(Boolean).join(', ')}</p>
            <p className="text-sm text-slate-600">{invoice.client.email}</p>
          </div>
        </div>

        <table className="w-full mb-8 text-sm">
          <thead>
            <tr className="border-b-2" style={{ borderColor: '#bbf7d0' }}>
              <th className="py-2 px-3 text-left text-emerald-700">#</th>
              <th className="py-2 px-3 text-left text-emerald-700">{cols.description}</th>
              <th className="py-2 px-3 text-right text-emerald-700">{cols.quantity}</th>
              <th className="py-2 px-3 text-right text-emerald-700">{cols.rate}</th>
              <th className="py-2 px-3 text-right text-emerald-700">{cols.amount}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={item.id} className="border-b" style={{ borderColor: '#ecfdf5' }}>
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
          <div className="w-72 rounded-xl p-4 border border-emerald-200" style={{ backgroundColor: '#f0fdf4' }}>
            <TotalsSection invoice={invoice} tax={tax} />
            <AmountInWords invoice={invoice} tax={tax} />
          </div>
        </div>
      </div>
    </div>
  );
}
