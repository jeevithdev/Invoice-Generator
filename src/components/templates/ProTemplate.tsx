import { TemplateProps, ItemsTableBody, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection, SignatureSection, fmtDate, invoiceTitle } from './TemplateShared';

export function ProTemplate({ invoice, tax }: TemplateProps) {
  const accent = invoice.customization.accentColor;
  const cols = invoice.customization.columnNames;

  return (
    <div className="bg-white w-full min-h-[1000px] font-sans" style={{ fontFamily: 'inherit' }}>
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-12 py-10">
        <div className="flex justify-between items-start">
          <div>
            {invoice.customization.showLogo && invoice.company.logo ? (
              <img src={invoice.company.logo} alt="Logo" className="h-16 mb-4 object-contain" />
            ) : (
              <h1 className="text-3xl font-bold text-white tracking-tight">{invoice.company.name}</h1>
            )}
            <div className="text-slate-300 text-sm mt-3 space-y-0.5">
              <p>{invoice.company.address}</p>
              <p>{[invoice.company.city, invoice.company.state, invoice.company.zip].filter(Boolean).join(', ')}</p>
              <p>{[invoice.company.phone, invoice.company.email].filter(Boolean).join(' · ')}</p>
              {invoice.company.gstin && <p className="text-slate-400">GSTIN: {invoice.company.gstin}</p>}
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-5xl font-bold text-white tracking-tight mb-2">{invoiceTitle(invoice)}</h2>
            <div className="text-slate-300 text-sm space-y-0.5">
              <p><span className="text-white font-semibold">#{invoice.invoiceNumber}</span></p>
              <p>Date: {fmtDate(invoice, invoice.invoiceDate)}</p>
              {invoice.dueDate && <p>Due: {fmtDate(invoice, invoice.dueDate)}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="px-12 py-8">
        <div className="grid grid-cols-2 gap-12 mb-10">
          <div className="bg-slate-50 p-6 rounded-xl border-l-4" style={{ borderLeftColor: accent }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>From</p>
            <h3 className="text-lg font-bold text-gray-900">{invoice.company.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{invoice.company.address}</p>
            <p className="text-sm text-gray-500">{[invoice.company.city, invoice.company.state, invoice.company.zip].filter(Boolean).join(', ')}</p>
            {invoice.company.phone && <p className="text-sm text-gray-500 mt-1">Tel: {invoice.company.phone}</p>}
            {invoice.company.email && <p className="text-sm text-gray-500">{invoice.company.email}</p>}
          </div>
          <div className="bg-slate-50 p-6 rounded-xl border-l-4" style={{ borderLeftColor: accent }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>Bill To</p>
            <h3 className="text-lg font-bold text-gray-900">{invoice.client.name}</h3>
            <p className="text-sm text-gray-600">{invoice.client.company}</p>
            <p className="text-sm text-gray-500">{invoice.client.address}</p>
            <p className="text-sm text-gray-500">{[invoice.client.city, invoice.client.state, invoice.client.zip, invoice.client.country].filter(Boolean).join(', ')}</p>
            <p className="text-sm text-gray-500">{[invoice.client.email, invoice.client.phone].filter(Boolean).join(' · ')}</p>
            {invoice.client.gstin && <p className="text-xs text-gray-400 mt-1">GSTIN: {invoice.client.gstin}</p>}
          </div>
        </div>

        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100 mb-8">
          <table className="w-full text-left">
            <thead>
              <tr style={{ backgroundColor: accent }}>
                <th className="py-4 px-5 text-xs font-bold text-white uppercase tracking-wider w-12">#</th>
                <th className="py-4 px-5 text-xs font-bold text-white uppercase tracking-wider">{cols.description}</th>
                <th className="py-4 px-5 text-xs font-bold text-white uppercase tracking-wider text-right w-24">{cols.quantity}</th>
                <th className="py-4 px-5 text-xs font-bold text-white uppercase tracking-wider text-right w-32">{cols.rate}</th>
                <th className="py-4 px-5 text-xs font-bold text-white uppercase tracking-wider text-right w-32">{cols.amount}</th>
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
            <div className="mt-6 space-y-4">
              <NotesSection invoice={invoice} />
              <TermsSection invoice={invoice} />
            </div>
          </div>
          <div className="w-80">
            <div className="bg-gray-900 text-white p-6 rounded-xl shadow-xl">
              <TotalsSection invoice={invoice} tax={tax} />
              <AmountInWords invoice={invoice} tax={tax} />
            </div>
          </div>
        </div>

        <SignatureSection invoice={invoice} />
      </div>

      <div className="mt-auto pt-8 px-12 pb-8 border-t border-gray-100">
        <div className="flex justify-between items-center text-xs text-gray-400">
          <p>Thank you for your business{invoice.company.website ? ` · ${invoice.company.website}` : ''}</p>
          <p>Powered by InvoiceCraft</p>
        </div>
      </div>
    </div>
  );
}
