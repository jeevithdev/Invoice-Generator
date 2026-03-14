import { TemplateProps, ItemsTableBody, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection, SignatureSection, fmtDate, invoiceTitle } from './TemplateShared';

export function ModernTemplate({ invoice, tax }: TemplateProps) {
  const accent = invoice.customization.accentColor;
  const cols = invoice.customization.columnNames;

  return (
    <div className="bg-white w-full min-h-[1000px] font-sans" style={{ fontFamily: 'inherit' }}>
      <div className="bg-gray-50 px-12 py-12 border-b-4" style={{ borderBottomColor: accent }}>
        <div className="flex justify-between items-end">
          <div>
            {invoice.customization.showLogo && invoice.company.logo ? (
              <img src={invoice.company.logo} alt="Logo" className="h-12 mb-4 object-contain" />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{invoice.company.name}</h1>
            )}
            <div className="text-gray-500 text-sm mt-2">
              <p>{invoice.company.address}</p>
              <p>{[invoice.company.city, invoice.company.state, invoice.company.zip].filter(Boolean).join(', ')}</p>
              <p>{[invoice.company.phone, invoice.company.email].filter(Boolean).join(' · ')}</p>
              {invoice.company.gstin && <p className="text-gray-400 mt-1">GSTIN: {invoice.company.gstin}</p>}
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-6xl font-black tracking-tighter" style={{ color: accent }}>{invoiceTitle(invoice)}</h2>
            <div className="mt-4 text-gray-600 text-sm">
              <p className="font-bold text-gray-900">#{invoice.invoiceNumber}</p>
              <p>Issued: {fmtDate(invoice, invoice.invoiceDate)}</p>
              {invoice.dueDate && <p>Due: {fmtDate(invoice, invoice.dueDate)}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="px-12 py-10">
        <div className="flex gap-16 mb-12">
          <div className="flex-1">
            <div className="w-12 h-1 mb-4" style={{ backgroundColor: accent }} />
            <p className="text-xs font-bold uppercase tracking-widest mb-2 text-gray-400">From</p>
            <h3 className="font-bold text-gray-900">{invoice.company.name}</h3>
            <p className="text-sm text-gray-500">{invoice.company.address}</p>
            <p className="text-sm text-gray-500">{[invoice.company.city, invoice.company.state, invoice.company.zip].filter(Boolean).join(', ')}</p>
            {invoice.company.phone && <p className="text-sm text-gray-500 mt-1">Tel: {invoice.company.phone}</p>}
            {invoice.company.email && <p className="text-sm text-gray-500">{invoice.company.email}</p>}
          </div>
          <div className="flex-1">
            <div className="w-12 h-1 mb-4" style={{ backgroundColor: accent }} />
            <p className="text-xs font-bold uppercase tracking-widest mb-2 text-gray-400">Bill To</p>
            <h3 className="font-bold text-gray-900">{invoice.client.name}</h3>
            <p className="text-sm text-gray-600">{invoice.client.company}</p>
            <p className="text-sm text-gray-500">{invoice.client.address}</p>
            <p className="text-sm text-gray-500">{[invoice.client.city, invoice.client.state, invoice.client.zip, invoice.client.country].filter(Boolean).join(', ')}</p>
            <p className="text-sm text-gray-500">{[invoice.client.email, invoice.client.phone].filter(Boolean).join(' · ')}</p>
            {invoice.client.gstin && <p className="text-xs text-gray-400 mt-1">GSTIN: {invoice.client.gstin}</p>}
          </div>
        </div>

        <table className="w-full text-left mb-10">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-4 text-xs font-bold uppercase tracking-widest text-gray-400 w-12">#</th>
              <th className="py-4 text-xs font-bold uppercase tracking-widest text-gray-400">{cols.description}</th>
              <th className="py-4 text-xs font-bold uppercase tracking-widest text-gray-400 text-right w-24">{cols.quantity}</th>
              <th className="py-4 text-xs font-bold uppercase tracking-widest text-gray-400 text-right w-32">{cols.rate}</th>
              <th className="py-4 text-xs font-bold uppercase tracking-widest text-gray-400 text-right w-32">{cols.amount}</th>
            </tr>
          </thead>
          <tbody>
            <ItemsTableBody invoice={invoice} />
          </tbody>
        </table>

        <div className="flex justify-between gap-12">
          <div className="flex-1">
            <BankDetailsSection invoice={invoice} />
            <div className="mt-6 space-y-3">
              <NotesSection invoice={invoice} />
              <TermsSection invoice={invoice} />
            </div>
          </div>
          <div className="w-72">
            <TotalsSection invoice={invoice} tax={tax} />
            <AmountInWords invoice={invoice} tax={tax} />
          </div>
        </div>

        <SignatureSection invoice={invoice} />
      </div>

      <div className="bg-gray-50 px-12 py-6 text-center">
        <p className="text-xs text-gray-400">Thank you for your business{invoice.company.website ? ` · ${invoice.company.website}` : ''}</p>
      </div>
    </div>
  );
}
