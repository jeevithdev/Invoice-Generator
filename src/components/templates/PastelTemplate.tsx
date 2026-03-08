import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

// ─────────────────────────────────────────────
// TEMPLATE 8: Pastel Friendly
// ─────────────────────────────────────────────
export function PastelTemplate({ invoice, tax }: TemplateProps) {
  const accent = invoice.customization.accentColor;
  const cols = invoice.customization.columnNames;

  return (
    <div
      className="w-full min-h-[1000px] p-10"
      style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f9f7ff' }}
    >
      {/* Rounded card wrapper */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        {/* Pastel gradient header */}
        <div
          className="px-10 pt-10 pb-8"
          style={{
            background: `linear-gradient(135deg, ${accent}22 0%, ${accent}08 50%, #fff0 100%)`,
            borderBottom: `1px solid ${accent}20`,
          }}
        >
          <div className="flex justify-between items-start">
            <div>
              {invoice.customization.showLogo && invoice.company.logo ? (
                <img src={invoice.company.logo} alt="Logo" className="h-14 mb-3 object-contain" />
              ) : (
                <div
                  className="inline-block px-4 py-2 rounded-2xl mb-3"
                  style={{ backgroundColor: accent + '20' }}
                >
                  <h1 className="text-xl font-bold" style={{ color: accent }}>
                    {invoice.company.name}
                  </h1>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">
                {[invoice.company.address, invoice.company.city].filter(Boolean).join(', ')}
              </p>
              <p className="text-sm text-gray-500">
                {[invoice.company.phone, invoice.company.email].filter(Boolean).join(' · ')}
              </p>
              {invoice.company.gstin && (
                <p className="text-xs text-gray-400 mt-1">GSTIN: {invoice.company.gstin}</p>
              )}
            </div>

            <div className="text-right">
              <span
                className="inline-block text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-3"
                style={{ backgroundColor: accent + '25', color: accent }}
              >
                Invoice
              </span>
              <p className="text-2xl font-bold text-gray-800">#{invoice.invoiceNumber}</p>
              <div className="mt-2 flex flex-col gap-1">
                <span
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full self-end"
                  style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Issued {invoice.invoiceDate}
                </span>
                {invoice.dueDate && (
                  <span
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full self-end"
                    style={{ backgroundColor: '#fff3e0', color: '#e65100' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
                    Due {invoice.dueDate}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-10 py-8">
          {/* Billing Cards */}
          <div className="grid grid-cols-2 gap-5 mb-8">
            <div
              className="p-5 rounded-2xl"
              style={{ backgroundColor: accent + '10', border: `1px solid ${accent}20` }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
                From
              </p>
              <p className="font-bold text-gray-900">{invoice.company.name}</p>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {[invoice.company.address, invoice.company.city, invoice.company.state].filter(Boolean).join(', ')}
              </p>
              <p className="text-sm text-gray-500">{invoice.company.email}</p>
              {invoice.company.gstin && (
                <p className="text-xs text-gray-400 mt-2 font-mono">GSTIN: {invoice.company.gstin}</p>
              )}
            </div>

            <div
              className="p-5 rounded-2xl"
              style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
                To
              </p>
              <p className="font-bold text-gray-900">{invoice.client.name}</p>
              <p className="text-sm text-gray-700">{invoice.client.company}</p>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {[invoice.client.address, invoice.client.city, invoice.client.state].filter(Boolean).join(', ')}
              </p>
              <p className="text-sm text-gray-500">{invoice.client.email}</p>
              {invoice.client.gstin && (
                <p className="text-xs text-gray-400 mt-2 font-mono">GSTIN: {invoice.client.gstin}</p>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="mb-8 rounded-2xl overflow-hidden" style={{ border: `1px solid ${accent}20` }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: accent + '15' }}>
                  <th className="py-3.5 px-5 text-left text-xs font-bold uppercase tracking-wide w-10" style={{ color: accent }}>#</th>
                  <th className="py-3.5 px-5 text-left text-xs font-bold uppercase tracking-wide" style={{ color: accent }}>{cols.description}</th>
                  <th className="py-3.5 px-5 text-right text-xs font-bold uppercase tracking-wide w-20" style={{ color: accent }}>{cols.quantity}</th>
                  <th className="py-3.5 px-5 text-right text-xs font-bold uppercase tracking-wide w-28" style={{ color: accent }}>{cols.rate}</th>
                  <th className="py-3.5 px-5 text-right text-xs font-bold uppercase tracking-wide w-28" style={{ color: accent }}>{cols.amount}</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, i) => (
                  <tr
                    key={item.id}
                    className="border-t"
                    style={{ borderColor: accent + '15', backgroundColor: i % 2 === 1 ? accent + '05' : '#fff' }}
                  >
                    <td className="py-3.5 px-5 text-gray-400 text-xs">{i + 1}</td>
                    <td className="py-3.5 px-5 text-gray-800">{item.description}</td>
                    <td className="py-3.5 px-5 text-right text-gray-700">{item.quantity}</td>
                    <td className="py-3.5 px-5 text-right text-gray-700">{formatCurrency(item.rate, invoice.currency)}</td>
                    <td className="py-3.5 px-5 text-right font-semibold text-gray-900">{formatCurrency(item.subtotal, invoice.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals + notes */}
          <div className="flex justify-between gap-8">
            <div className="flex-1">
              <BankDetailsSection invoice={invoice} />
              <div className="mt-4 space-y-3">
                <NotesSection invoice={invoice} />
                <TermsSection invoice={invoice} />
              </div>
            </div>
            <div
              className="w-64 p-5 rounded-2xl"
              style={{ background: `linear-gradient(135deg, ${accent}18 0%, ${accent}08 100%)`, border: `1px solid ${accent}25` }}
            >
              <TotalsSection invoice={invoice} tax={tax} />
              <AmountInWords invoice={invoice} tax={tax} />
            </div>
          </div>

          {/* Footer */}
          <div
            className="mt-10 text-center py-4 rounded-2xl"
            style={{ backgroundColor: accent + '10' }}
          >
            <p className="text-xs font-medium" style={{ color: accent }}>
              Thank you for your business! ✨ · {invoice.company.website}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
