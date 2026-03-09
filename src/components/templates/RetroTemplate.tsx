import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

// ─────────────────────────────────────────────
// TEMPLATE 7: Retro Vintage
// ─────────────────────────────────────────────
export function RetroTemplate({ invoice, tax }: TemplateProps) {
  const accent = invoice.customization.accentColor;
  const cols = invoice.customization.columnNames;

  return (
    <div
      className="w-full min-h-[1000px] p-12"
      style={{
        fontFamily: '"Georgia", "Times New Roman", serif',
        backgroundColor: '#fdf8f0',
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(0,0,0,0.03) 27px, rgba(0,0,0,0.03) 28px)',
      }}
    >
      {/* Outer decorative border */}
      <div
        className="w-full h-full p-1"
        style={{ border: `3px double ${accent}`, borderRadius: 4 }}
      >
        <div
          className="w-full h-full p-px"
          style={{ border: `1px solid ${accent}60`, borderRadius: 2 }}
        >
          <div className="p-10">
            {/* Header */}
            <div className="text-center mb-8 pb-6" style={{ borderBottom: `2px solid ${accent}` }}>
              <div className="flex justify-between items-start mb-4">
                <div className="text-left">
                  {invoice.customization.showLogo && invoice.company.logo ? (
                    <img src={invoice.company.logo} alt="Logo" className="h-14 mb-2 object-contain" />
                  ) : null}
                  <h1
                    className="text-2xl font-bold uppercase tracking-wider"
                    style={{ color: accent, fontFamily: '"Georgia", serif' }}
                  >
                    {invoice.company.name}
                  </h1>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {[invoice.company.address, invoice.company.city, invoice.company.state, invoice.company.zip, invoice.company.country].filter(Boolean).join(' · ')}
                  </p>
                  <p className="text-xs text-gray-600">
                    {[invoice.company.phone, invoice.company.email].filter(Boolean).join(' · ')}
                  </p>
                  {invoice.company.gstin && (
                    <p className="text-xs text-gray-500 mt-1">GSTIN: {invoice.company.gstin}</p>
                  )}
                </div>

                <div className="text-center px-6 py-4" style={{ border: `2px solid ${accent}`, borderRadius: 2 }}>
                  <p
                    className="text-xs font-bold uppercase tracking-[0.3em] mb-1"
                    style={{ color: accent }}
                  >
                    Invoice
                  </p>
                  <p className="text-3xl font-bold tracking-wide text-gray-900" style={{ fontFamily: '"Georgia", serif' }}>
                    #{invoice.invoiceNumber}
                  </p>
                  <div className="mt-2 text-xs text-gray-600 space-y-0.5">
                    <p>Date: <span className="font-semibold">{invoice.invoiceDate}</span></p>
                    {invoice.dueDate && <p>Due: <span className="font-semibold">{invoice.dueDate}</span></p>}
                  </div>
                </div>
              </div>

              {/* Ornament */}
              <div className="flex items-center gap-3 justify-center mt-2">
                <div className="h-px flex-1" style={{ backgroundColor: accent + '60' }} />
                <span className="text-lg" style={{ color: accent }}>✦</span>
                <div className="h-px flex-1" style={{ backgroundColor: accent + '60' }} />
              </div>
            </div>

            {/* Billing info */}
            <div className="flex justify-between mb-8">
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-[0.2em] mb-2"
                  style={{ color: accent }}
                >
                  ❧ Billed To
                </p>
                <p className="font-bold text-gray-900 text-base">{invoice.client.name}</p>
                <p className="text-sm text-gray-700">{invoice.client.company}</p>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {[invoice.client.address, invoice.client.city, invoice.client.state, invoice.client.zip, invoice.client.country].filter(Boolean).join(', ')}
                </p>
                <p className="text-xs text-gray-600">
                  {[invoice.client.email, invoice.client.phone].filter(Boolean).join(' · ')}
                </p>
                {invoice.client.gstin && (
                  <p className="text-xs text-gray-500 mt-1">GSTIN: {invoice.client.gstin}</p>
                )}
              </div>

              <div
                className="text-right px-6 py-4 self-start"
                style={{ border: `1px dashed ${accent}80`, borderRadius: 2, backgroundColor: accent + '08' }}
              >
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Total Due</p>
                <p className="text-3xl font-bold" style={{ color: accent, fontFamily: '"Georgia", serif' }}>
                  {formatCurrency(tax.grandTotal, invoice.currency)}
                </p>
                <p className="text-xs text-gray-500 mt-1 italic">Including all taxes</p>
              </div>
            </div>

            {/* Table */}
            <table
              className="w-full mb-8 text-sm border-collapse"
              style={{ borderTop: `2px solid ${accent}`, borderBottom: `2px solid ${accent}` }}
            >
              <thead>
                <tr style={{ backgroundColor: accent + '18', borderBottom: `1px solid ${accent}60` }}>
                  <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 w-10">#</th>
                  <th className="py-3 px-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">{cols.description}</th>
                  <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider text-gray-600 w-20">{cols.quantity}</th>
                  <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider text-gray-600 w-28">{cols.rate}</th>
                  <th className="py-3 px-4 text-right text-xs font-bold uppercase tracking-wider text-gray-600 w-28">{cols.amount}</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, i) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: `1px solid ${accent}30`,
                      backgroundColor: i % 2 === 0 ? 'transparent' : accent + '06',
                    }}
                  >
                    <td className="py-3 px-4 text-gray-400 text-xs">{i + 1}.</td>
                    <td className="py-3 px-4 text-gray-800">{item.description}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(item.rate, invoice.currency)}</td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">{formatCurrency(item.subtotal, invoice.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bottom section */}
            <div className="flex justify-between gap-8">
              <div className="flex-1">
                <BankDetailsSection invoice={invoice} />
                <div className="mt-4 space-y-3">
                  <NotesSection invoice={invoice} />
                  <TermsSection invoice={invoice} />
                </div>
              </div>
              <div
                className="w-64 p-5"
                style={{ border: `1px solid ${accent}50`, borderRadius: 2, backgroundColor: accent + '08' }}
              >
                <TotalsSection invoice={invoice} tax={tax} />
                <AmountInWords invoice={invoice} tax={tax} />
              </div>
            </div>

            {/* Footer ornament */}
            <div className="mt-10 text-center">
              <div className="flex items-center gap-3 justify-center mb-3">
                <div className="h-px flex-1" style={{ backgroundColor: accent + '50' }} />
                <span className="text-xs" style={{ color: accent }}>✦ ✦ ✦</span>
                <div className="h-px flex-1" style={{ backgroundColor: accent + '50' }} />
              </div>
              <p className="text-xs text-gray-500 italic">Thank you for your business · {invoice.company.website}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
