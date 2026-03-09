import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

// ─────────────────────────────────────────────
// TEMPLATE 3: Clean Grid Layout
// ─────────────────────────────────────────────
export function GridTemplate({ invoice, tax }: TemplateProps) {
  const accent = invoice.customization.accentColor;
  const cols = invoice.customization.columnNames;

  return (
    <div className="bg-gray-50 w-full min-h-[1000px] p-10 font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header card */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            {invoice.customization.showLogo && invoice.company.logo && (
              <img src={invoice.company.logo} alt="Logo" className="h-16 w-16 object-contain rounded-xl border border-gray-100" />
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">{invoice.company.name}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{[invoice.company.address, invoice.company.city, invoice.company.state, invoice.company.zip, invoice.company.country].filter(Boolean).join(', ')}</p>
              <p className="text-sm text-gray-500">{[invoice.company.email, invoice.company.phone].filter(Boolean).join(' · ')}</p>
              {invoice.company.gstin && <p className="text-xs text-gray-400 mt-1">GSTIN: {invoice.company.gstin}</p>}
            </div>
          </div>
          <div className="text-right">
            <div
              className="inline-block px-4 py-1.5 rounded-full text-white text-sm font-bold mb-3"
              style={{ backgroundColor: accent }}
            >
              INVOICE
            </div>
            <p className="text-2xl font-black text-gray-900">#{invoice.invoiceNumber}</p>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <InfoCard label="Bill To" accent={accent}>
          <p className="font-semibold text-gray-900">{invoice.client.name}</p>
          <p className="text-gray-600 text-xs">{invoice.client.company}</p>
          <p className="text-gray-500 text-xs">{invoice.client.address}</p>
          <p className="text-gray-500 text-xs">{[invoice.client.city, invoice.client.state, invoice.client.zip, invoice.client.country].filter(Boolean).join(', ')}</p>
          <p className="text-gray-500 text-xs">{invoice.client.email}</p>
          {invoice.client.gstin && <p className="text-gray-400 text-xs">GSTIN: {invoice.client.gstin}</p>}
        </InfoCard>
        <InfoCard label="Invoice Date" accent={accent}>
          <p className="text-2xl font-bold text-gray-900">{invoice.invoiceDate}</p>
          {invoice.dueDate && <p className="text-xs text-gray-500 mt-1">Due: {invoice.dueDate}</p>}
        </InfoCard>
        <InfoCard label="Amount Due" accent={accent}>
          <p className="text-2xl font-bold" style={{ color: accent }}>{formatCurrency(tax.grandTotal, invoice.currency)}</p>
          <p className="text-xs text-gray-500 mt-1">Currency: {invoice.currency}</p>
        </InfoCard>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2" style={{ borderColor: accent + '40' }}>
              <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-400 w-10">#</th>
              <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-400">{cols.description}</th>
              <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-400 text-right w-20">{cols.quantity}</th>
              <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-400 text-right w-28">{cols.rate}</th>
              <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-gray-400 text-right w-28">{cols.amount}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={item.id} className={`border-b border-gray-50 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                <td className="py-3 px-5 text-sm text-gray-400">{i + 1}</td>
                <td className="py-3 px-5 text-sm text-gray-800">{item.description}</td>
                <td className="py-3 px-5 text-sm text-right text-gray-600">{item.quantity}</td>
                <td className="py-3 px-5 text-sm text-right text-gray-600">{formatCurrency(item.rate, invoice.currency)}</td>
                <td className="py-3 px-5 text-sm text-right font-semibold text-gray-900">{formatCurrency(item.subtotal, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <BankDetailsSection invoice={invoice} />
          <NotesSection invoice={invoice} />
          <TermsSection invoice={invoice} />
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <TotalsSection invoice={invoice} tax={tax} />
          <AmountInWords invoice={invoice} tax={tax} />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, accent, children }: { label: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>{label}</p>
      <div className="space-y-0.5 text-sm">{children}</div>
    </div>
  );
}
