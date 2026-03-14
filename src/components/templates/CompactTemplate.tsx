import { TemplateProps, ItemsTableBody, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection, SignatureSection, fmtDate, invoiceTitle } from './TemplateShared';

export function CompactTemplate({ invoice, tax }: TemplateProps) {
  const accent = invoice.customization.accentColor;
  const cols = invoice.customization.columnNames;

  return (
    <div className="bg-white w-full min-h-[1000px] font-sans" style={{ fontFamily: 'inherit' }}>
      <div className="bg-gray-900 px-10 py-8 flex justify-between items-center">
        <div>
          {invoice.customization.showLogo && invoice.company.logo ? (
            <img src={invoice.company.logo} alt="Logo" className="h-10 object-contain" />
          ) : (
            <h1 className="text-xl font-bold text-white">{invoice.company.name}</h1>
          )}
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-white tracking-wider" style={{ color: accent }}>{invoiceTitle(invoice)}</h2>
          <p className="text-gray-400 text-sm mt-1">#{invoice.invoiceNumber}</p>
        </div>
      </div>

      <div className="px-10 py-6 bg-gray-50 flex justify-between text-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Date</p>
          <p className="font-medium">{fmtDate(invoice, invoice.invoiceDate)}</p>
        </div>
        {invoice.dueDate && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Due Date</p>
            <p className="font-medium">{fmtDate(invoice, invoice.dueDate)}</p>
          </div>
        )}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">From</p>
          <p className="font-medium">{invoice.company.name}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Bill To</p>
          <p className="font-medium">{invoice.client.name}</p>
        </div>
      </div>

      <div className="px-10 py-6">
        <table className="w-full text-left mb-8">
          <thead>
            <tr className="border-b-2" style={{ borderBottomColor: accent }}>
              <th className="py-3 text-xs font-bold uppercase tracking-widest text-gray-400 w-10">#</th>
              <th className="py-3 text-xs font-bold uppercase tracking-widest text-gray-400">{cols.description}</th>
              <th className="py-3 text-xs font-bold uppercase tracking-widest text-gray-400 text-right w-20">{cols.quantity}</th>
              <th className="py-3 text-xs font-bold uppercase tracking-widest text-gray-400 text-right w-28">{cols.rate}</th>
              <th className="py-3 text-xs font-bold uppercase tracking-widest text-gray-400 text-right w-28">{cols.amount}</th>
            </tr>
          </thead>
          <tbody>
            <ItemsTableBody invoice={invoice} />
          </tbody>
        </table>

        <div className="flex justify-between gap-8">
          <div className="flex-1">
            <BankDetailsSection invoice={invoice} />
            <div className="mt-4 space-y-2">
              <NotesSection invoice={invoice} />
              <TermsSection invoice={invoice} />
            </div>
          </div>
          <div className="w-64">
            <TotalsSection invoice={invoice} tax={tax} />
            <AmountInWords invoice={invoice} tax={tax} />
          </div>
        </div>

        <SignatureSection invoice={invoice} />
      </div>

      <div className="mt-auto pt-6 px-10 border-t border-gray-100 text-center text-xs text-gray-400">
        <p>Thank you for your business{invoice.company.website ? ` · ${invoice.company.website}` : ''}</p>
      </div>
    </div>
  );
}
