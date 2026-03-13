import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection, fmtDate } from './TemplateShared';
import { formatCurrency } from '@/utils/format';
import { CustomTemplateConfig } from '@/types/invoice';

// ─────────────────────────────────────────────
// CUSTOM TEMPLATE — user-configurable layout
// ─────────────────────────────────────────────
export function CustomTemplate({ invoice, tax }: TemplateProps) {
  const cfg: CustomTemplateConfig = invoice.customTemplateConfig;
  const cols = invoice.customization.columnNames;
  const accent = cfg.accentColor;

  const stripedBg = (i: number) =>
    cfg.tableRowStriped ? (i % 2 !== 0 ? cfg.tableHeaderBg + '55' : 'transparent') : 'transparent';

  return (
    <div
      className="w-full min-h-[1000px] p-0 font-sans overflow-hidden relative"
      style={{ backgroundColor: cfg.pageBg, fontFamily: 'inherit' }}
    >
      {/* ── PDF / Image Background ── */}
      {cfg.pdfBackground && (
        <img
          src={cfg.pdfBackground}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ opacity: cfg.pdfBackgroundOpacity ?? 0.15 }}
        />
      )}

      {/* ── All content sits above background ── */}
      <div className="relative z-10">
      {/* ── Header ── */}
      {cfg.headerLayout === 'centered' ? (
        <div
          className="flex flex-col items-center text-center px-12 py-10"
          style={{ backgroundColor: cfg.headerBg, color: cfg.headerTextColor }}
        >
          {invoice.customization.showLogo && invoice.company.logo && (
            <img src={invoice.company.logo} alt="Logo" className="h-14 mb-3 object-contain" />
          )}
          <h2 className="text-4xl font-light tracking-widest mb-3" style={{ color: cfg.headerTextColor }}>
            INVOICE
          </h2>
          <h1 className="text-xl font-bold">{invoice.company.name}</h1>
          <p className="text-sm opacity-80 mt-1">{invoice.company.address}</p>
          <p className="text-sm opacity-80">
            {[invoice.company.city, invoice.company.state, invoice.company.zip, invoice.company.country]
              .filter(Boolean).join(', ')}
          </p>
          <p className="text-sm opacity-70 mt-1">
            {[invoice.company.phone, invoice.company.email].filter(Boolean).join(' · ')}
          </p>
          {invoice.company.gstin && (
            <p className="text-xs opacity-60 mt-1">GSTIN: {invoice.company.gstin}</p>
          )}
          <div className="mt-4 flex gap-6 text-sm opacity-90">
            <span><span className="font-semibold">#{invoice.invoiceNumber}</span></span>
            <span>Date: {fmtDate(invoice, invoice.invoiceDate)}</span>
            {invoice.dueDate && <span>Due: {fmtDate(invoice, invoice.dueDate)}</span>}
          </div>
        </div>
      ) : cfg.headerLayout === 'reversed' ? (
        <div
          className="flex justify-between items-start px-12 py-10"
          style={{ backgroundColor: cfg.headerBg, color: cfg.headerTextColor }}
        >
          {/* Invoice # on the left */}
          <div>
            <h2 className="text-4xl font-light tracking-widest" style={{ color: cfg.headerTextColor }}>
              INVOICE
            </h2>
            <div className="mt-3 text-sm opacity-90 space-y-1">
              <p><span className="font-semibold">#{invoice.invoiceNumber}</span></p>
              <p>Date: {fmtDate(invoice, invoice.invoiceDate)}</p>
              {invoice.dueDate && <p>Due: {fmtDate(invoice, invoice.dueDate)}</p>}
            </div>
          </div>
          {/* Company on the right */}
          <div className="text-right">
            {invoice.customization.showLogo && invoice.company.logo && (
              <img src={invoice.company.logo} alt="Logo" className="h-14 mb-3 ml-auto object-contain" />
            )}
            <h1 className="text-xl font-bold">{invoice.company.name}</h1>
            <p className="text-sm opacity-80 mt-1">{invoice.company.address}</p>
            <p className="text-sm opacity-80">
              {[invoice.company.city, invoice.company.state, invoice.company.zip, invoice.company.country]
                .filter(Boolean).join(', ')}
            </p>
            <p className="text-sm opacity-70">
              {[invoice.company.phone, invoice.company.email].filter(Boolean).join(' · ')}
            </p>
            {invoice.company.gstin && (
              <p className="text-xs opacity-60 mt-1">GSTIN: {invoice.company.gstin}</p>
            )}
          </div>
        </div>
      ) : (
        /* standard: company left, invoice # right */
        <div
          className="flex justify-between items-start px-12 py-10"
          style={{ backgroundColor: cfg.headerBg, color: cfg.headerTextColor }}
        >
          <div>
            {invoice.customization.showLogo && invoice.company.logo && (
              <img src={invoice.company.logo} alt="Logo" className="h-14 mb-3 object-contain" />
            )}
            <h1 className="text-xl font-bold">{invoice.company.name}</h1>
            <p className="text-sm opacity-80 mt-1">{invoice.company.address}</p>
            <p className="text-sm opacity-80">
              {[invoice.company.city, invoice.company.state, invoice.company.zip, invoice.company.country]
                .filter(Boolean).join(', ')}
            </p>
            <p className="text-sm opacity-70 mt-1">
              {[invoice.company.phone, invoice.company.email].filter(Boolean).join(' · ')}
            </p>
            {invoice.company.gstin && (
              <p className="text-xs opacity-60 mt-1">GSTIN: {invoice.company.gstin}</p>
            )}
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-light tracking-widest" style={{ color: cfg.headerTextColor }}>
              INVOICE
            </h2>
            <div className="mt-3 text-sm opacity-90 space-y-1">
              <p><span className="font-semibold">#{invoice.invoiceNumber}</span></p>
              <p>Date: {fmtDate(invoice, invoice.invoiceDate)}</p>
              {invoice.dueDate && <p>Due: {fmtDate(invoice, invoice.dueDate)}</p>}
            </div>
          </div>
        </div>
      )}

      {/* ── Divider ── */}
      {cfg.showDivider && (
        <div className="h-1" style={{ backgroundColor: accent }} />
      )}

      {/* ── Body ── */}
      <div className="px-12 py-8">
        {/* Bill To */}
        <div className="mb-8">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: accent }}
          >
            Bill To
          </p>
          <h3 className="text-lg font-semibold text-gray-900">{invoice.client.name}</h3>
          <p className="text-sm text-gray-600">{invoice.client.company}</p>
          <p className="text-sm text-gray-500">{invoice.client.address}</p>
          <p className="text-sm text-gray-500">
            {[invoice.client.city, invoice.client.state, invoice.client.zip, invoice.client.country]
              .filter(Boolean).join(', ')}
          </p>
          <p className="text-sm text-gray-500">
            {[invoice.client.email, invoice.client.phone].filter(Boolean).join(' · ')}
          </p>
          {invoice.client.gstin && (
            <p className="text-xs text-gray-400 mt-1">GSTIN: {invoice.client.gstin}</p>
          )}
        </div>

        {/* ── Items Table ── */}
        <table
          className="w-full text-left border-collapse mb-8"
          style={cfg.tableBordered ? { border: `1px solid ${cfg.tableHeaderBg}` } : {}}
        >
          <thead>
            <tr style={{ backgroundColor: cfg.tableHeaderBg, color: cfg.tableHeaderTextColor }}>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide w-10">#</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide">{cols.description}</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-right w-20">{cols.quantity}</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-right w-28">{cols.rate}</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-right w-28">{cols.amount}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr
                key={item.id}
                className={cfg.tableBordered ? 'border border-gray-200' : 'border-b border-gray-100'}
                style={{ backgroundColor: stripedBg(i) }}
              >
                <td className="py-3 px-4 text-sm text-gray-500">{i + 1}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{item.description}</td>
                <td className="py-3 px-4 text-sm text-right text-gray-700">{item.quantity}</td>
                <td className="py-3 px-4 text-sm text-right text-gray-700">
                  {formatCurrency(item.rate, invoice.currency)}
                </td>
                <td className="py-3 px-4 text-sm text-right font-medium text-gray-800">
                  {formatCurrency(item.subtotal, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── Totals + Notes ── */}
        <div className="flex justify-between items-start gap-8">
          <div className="flex-1">
            <BankDetailsSection invoice={invoice} />
            <div className="mt-4 space-y-3">
              <NotesSection invoice={invoice} />
              <TermsSection invoice={invoice} />
            </div>
          </div>
          <div className="w-64">
            <TotalsSection invoice={invoice} tax={tax} />
            <AmountInWords invoice={invoice} tax={tax} />
          </div>
        </div>

        {/* ── Signature Area ── */}
        {cfg.showSignatureArea && (
          <div className="mt-12 flex justify-end">
            <div className="text-center">
              <div
                className="w-48 border-t-2 pt-2 text-xs text-gray-500"
                style={{ borderColor: accent }}
              >
                Authorized Signature
              </div>
              <p className="text-xs text-gray-400 mt-1">{invoice.company.name}</p>
            </div>
          </div>
        )}
      </div>
      </div>{/* closes relative z-10 wrapper */}

      {/* ── Footer ── */}
      {cfg.footerText && (
        <div
          className="relative z-10 mt-4 px-12 py-4 text-center text-xs"
          style={{ backgroundColor: cfg.headerBg + '22', color: cfg.accentColor }}
        >
          {cfg.footerText}
        </div>
      )}
    </div>
  );
}
