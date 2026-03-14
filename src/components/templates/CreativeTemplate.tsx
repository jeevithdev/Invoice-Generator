import { TemplateProps, ItemsTableBody, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection, SignatureSection, fmtDate, invoiceTitle } from './TemplateShared';

export function CreativeTemplate({ invoice, tax }: TemplateProps) {
  const accent = invoice.customization.accentColor;
  const cols = invoice.customization.columnNames;

  return (
    <div className="bg-white w-full min-h-[1000px] font-sans" style={{ fontFamily: 'inherit' }}>
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 px-12 py-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative flex justify-between items-start">
          <div className="flex-1">
            {invoice.customization.showLogo && invoice.company.logo ? (
              <img src={invoice.company.logo} alt="Logo" className="h-14 mb-4 object-contain bg-white/20 rounded-lg px-2 py-1" />
            ) : (
              <h1 className="text-3xl font-bold text-white tracking-tight">{invoice.company.name}</h1>
            )}
            <div className="text-white/80 text-sm mt-3 space-y-0.5">
              <p>{invoice.company.address}</p>
              <p>{[invoice.company.city, invoice.company.state, invoice.company.zip].filter(Boolean).join(', ')}</p>
              <p>{[invoice.company.phone, invoice.company.email].filter(Boolean).join(' · ')}</p>
              {invoice.company.gstin && <p className="text-white/60">GSTIN: {invoice.company.gstin}</p>}
            </div>
          </div>
          <div className="text-right">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4">
              <h2 className="text-4xl font-black text-white tracking-wider">{invoiceTitle(invoice)}</h2>
              <p className="text-white/90 font-bold text-lg mt-1">#{invoice.invoiceNumber}</p>
            </div>
            <div className="mt-4 text-white/80 text-sm">
              <p>Issued: {fmtDate(invoice, invoice.invoiceDate)}</p>
              {invoice.dueDate && <p>Due: {fmtDate(invoice, invoice.dueDate)}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="px-12 py-8">
        <div className="grid grid-cols-2 gap-10 mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>Bill From</p>
            <h3 className="text-lg font-bold text-gray-900">{invoice.company.name}</h3>
            <p className="text-sm text-gray-500">{invoice.company.address}</p>
            <p className="text-sm text-gray-500">{[invoice.company.city, invoice.company.state, invoice.company.zip].filter(Boolean).join(', ')}</p>
            {invoice.company.phone && <p className="text-sm text-gray-500 mt-1">Tel: {invoice.company.phone}</p>}
            {invoice.company.email && <p className="text-sm text-gray-500">{invoice.company.email}</p>}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>Bill To</p>
            <h3 className="text-lg font-bold text-gray-900">{invoice.client.name}</h3>
            <p className="text-sm text-gray-600">{invoice.client.company}</p>
            <p className="text-sm text-gray-500">{invoice.client.address}</p>
            <p className="text-sm text-gray-500">{[invoice.client.city, invoice.client.state, invoice.client.zip, invoice.client.country].filter(Boolean).join(', ')}</p>
            <p className="text-sm text-gray-500">{[invoice.client.email, invoice.client.phone].filter(Boolean).join(' · ')}</p>
            {invoice.client.gstin && <p className="text-xs text-gray-400 mt-1">GSTIN: {invoice.client.gstin}</p>}
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-xl mb-10">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider w-12">#</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">{cols.description}</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-right w-24">{cols.quantity}</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-right w-32">{cols.rate}</th>
                <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-right w-32">{cols.amount}</th>
              </tr>
            </thead>
            <tbody>
              <ItemsTableBody invoice={invoice} />
            </tbody>
          </table>
        </div>

        <div className="flex justify-between gap-10">
          <div className="flex-1">
            <BankDetailsSection invoice={invoice} />
            <div className="mt-6 space-y-3">
              <NotesSection invoice={invoice} />
              <TermsSection invoice={invoice} />
            </div>
          </div>
          <div className="w-72">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-2xl">
              <TotalsSection invoice={invoice} tax={tax} />
              <AmountInWords invoice={invoice} tax={tax} />
            </div>
          </div>
        </div>

        <SignatureSection invoice={invoice} />
      </div>

      <div className="px-12 py-6 border-t-4" style={{ borderTopColor: accent }}>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Thank you for your business{invoice.company.website ? ` · ${invoice.company.website}` : ''}</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accent }} />
            <span className="text-sm font-semibold" style={{ color: accent }}>InvoiceCraft</span>
          </div>
        </div>
      </div>
    </div>
  );
}
