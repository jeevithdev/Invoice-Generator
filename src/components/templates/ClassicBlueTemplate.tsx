import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

// ─────────────────────────────────────────────
// TEMPLATE 21: Classic Blue
// ─────────────────────────────────────────────
export function ClassicBlueTemplate({ invoice, tax }: TemplateProps) {
  const cols = invoice.customization.columnNames;
  const blue = '#1d4ed8';

  return (
    <div className="bg-blue-50 w-full min-h-[1000px] p-10 font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="bg-white rounded-2xl border border-blue-200 overflow-hidden shadow-sm">
        <div className="px-10 py-7" style={{ backgroundColor: blue }}>
          <div className="flex justify-between items-center">
            <div>
              {invoice.customization.showLogo && invoice.company.logo ? (
                <img src={invoice.company.logo} alt="Logo" className="h-12 mb-2 object-contain" />
              ) : (
                <h1 className="text-2xl font-bold text-white">{invoice.company.name}</h1>
              )}
              <p className="text-blue-100 text-sm">{invoice.company.email}</p>
            </div>
            <div className="text-right text-white">
              <p className="text-xs uppercase tracking-widest">Invoice</p>
              <p className="text-2xl font-black">#{invoice.invoiceNumber}</p>
              <p className="text-sm text-blue-100">{invoice.invoiceDate}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-blue-700 mb-1">From</p>
              <p className="font-semibold text-slate-900">{invoice.company.name}</p>
              <p className="text-sm text-slate-600">{invoice.company.address}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-blue-700 mb-1">Bill To</p>
              <p className="font-semibold text-slate-900">{invoice.client.name}</p>
              <p className="text-sm text-slate-600">{invoice.client.company}</p>
              <p className="text-sm text-slate-600">{invoice.client.email}</p>
            </div>
          </div>

          <table className="w-full mb-8 text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-blue-200">
                <th className="py-3 px-4 text-xs uppercase tracking-wide text-blue-700 w-10">#</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wide text-blue-700">{cols.description}</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wide text-blue-700 text-right w-20">{cols.quantity}</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wide text-blue-700 text-right w-28">{cols.rate}</th>
                <th className="py-3 px-4 text-xs uppercase tracking-wide text-blue-700 text-right w-28">{cols.amount}</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={item.id} className="border-b border-blue-50">
                  <td className="py-3 px-4 text-sm text-slate-500">{i + 1}</td>
                  <td className="py-3 px-4 text-sm text-slate-900">{item.description}</td>
                  <td className="py-3 px-4 text-sm text-right text-slate-700">{item.quantity}</td>
                  <td className="py-3 px-4 text-sm text-right text-slate-700">{formatCurrency(item.rate, invoice.currency)}</td>
                  <td className="py-3 px-4 text-sm text-right font-semibold text-slate-900">{formatCurrency(item.subtotal, invoice.currency)}</td>
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
            <div className="w-72 p-5 rounded-xl bg-blue-50 border border-blue-200">
              <TotalsSection invoice={invoice} tax={tax} />
              <AmountInWords invoice={invoice} tax={tax} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
