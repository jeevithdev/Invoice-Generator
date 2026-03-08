import { TemplateProps, ItemsTableBody, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection } from './TemplateShared';

// ─────────────────────────────────────────────
// TEMPLATE 2: Corporate Modern (colored header)
// ─────────────────────────────────────────────
export function CorporateTemplate({ invoice, tax }: TemplateProps) {
  const accent = invoice.customization.accentColor;
  const cols = invoice.customization.columnNames;

  return (
    <div className="bg-white w-full min-h-[1000px] font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Colored Header Band */}
      <div className="px-12 py-8" style={{ backgroundColor: accent }}>
        <div className="flex justify-between items-center">
          <div>
            {invoice.customization.showLogo && invoice.company.logo ? (
              <img src={invoice.company.logo} alt="Logo" className="h-12 mb-2 object-contain bg-white rounded px-1" />
            ) : (
              <h1 className="text-2xl font-bold text-white">{invoice.company.name}</h1>
            )}
            <p className="text-white/80 text-sm">{invoice.company.name}</p>
          </div>
          <div className="text-right">
            <h2 className="text-5xl font-black text-white/20 tracking-widest">INVOICE</h2>
            <p className="text-white font-bold text-lg mt-1">#{invoice.invoiceNumber}</p>
          </div>
        </div>
      </div>

      {/* Meta strip */}
      <div className="flex gap-8 px-12 py-4" style={{ backgroundColor: accent + 'CC' }}>
        <div className="text-white/90 text-xs">
          <p className="font-semibold uppercase tracking-wide opacity-70">Issue Date</p>
          <p className="font-bold text-sm">{invoice.invoiceDate}</p>
        </div>
        {invoice.dueDate && (
          <div className="text-white/90 text-xs">
            <p className="font-semibold uppercase tracking-wide opacity-70">Due Date</p>
            <p className="font-bold text-sm">{invoice.dueDate}</p>
          </div>
        )}
        <div className="text-white/90 text-xs ml-auto">
          <p className="font-semibold uppercase tracking-wide opacity-70">Currency</p>
          <p className="font-bold text-sm">{invoice.currency}</p>
        </div>
      </div>

      <div className="px-12 py-8">
        {/* Addresses */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>From</p>
            <p className="font-semibold text-gray-900 text-base">{invoice.company.name}</p>
            <p className="text-sm text-gray-500">{invoice.company.address}</p>
            <p className="text-sm text-gray-500">{[invoice.company.city, invoice.company.state].filter(Boolean).join(', ')}</p>
            <p className="text-sm text-gray-500">{invoice.company.phone}</p>
            <p className="text-sm text-gray-500">{invoice.company.email}</p>
            {invoice.company.gstin && <p className="text-xs text-gray-400 mt-1">GSTIN: {invoice.company.gstin}</p>}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>To</p>
            <p className="font-semibold text-gray-900 text-base">{invoice.client.name}</p>
            <p className="text-sm text-gray-600">{invoice.client.company}</p>
            <p className="text-sm text-gray-500">{invoice.client.address}</p>
            <p className="text-sm text-gray-500">{[invoice.client.city, invoice.client.state].filter(Boolean).join(', ')}</p>
            <p className="text-sm text-gray-500">{invoice.client.email}</p>
            {invoice.client.gstin && <p className="text-xs text-gray-400 mt-1">GSTIN: {invoice.client.gstin}</p>}
          </div>
        </div>

        {/* Items */}
        <table className="w-full text-left border-collapse mb-8 rounded-lg overflow-hidden">
          <thead>
            <tr style={{ backgroundColor: accent }}>
              <th className="py-3 px-4 text-xs font-semibold text-white/80 uppercase w-10">#</th>
              <th className="py-3 px-4 text-xs font-semibold text-white uppercase">{cols.description}</th>
              <th className="py-3 px-4 text-xs font-semibold text-white uppercase text-right w-20">{cols.quantity}</th>
              <th className="py-3 px-4 text-xs font-semibold text-white uppercase text-right w-28">{cols.rate}</th>
              <th className="py-3 px-4 text-xs font-semibold text-white uppercase text-right w-28">{cols.amount}</th>
            </tr>
          </thead>
          <tbody>
            <ItemsTableBody invoice={invoice} />
          </tbody>
        </table>

        <div className="flex justify-between gap-8">
          <div className="flex-1">
            <BankDetailsSection invoice={invoice} />
            <div className="mt-4 space-y-3">
              <NotesSection invoice={invoice} />
              <TermsSection invoice={invoice} />
            </div>
          </div>
          <div className="w-72 p-5 rounded-xl" style={{ backgroundColor: accent + '10', border: `1px solid ${accent}30` }}>
            <TotalsSection invoice={invoice} tax={tax} />
            <AmountInWords invoice={invoice} tax={tax} />
          </div>
        </div>
      </div>
    </div>
  );
}
