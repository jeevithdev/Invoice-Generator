import { TemplateProps, TotalsSection, AmountInWords, BankDetailsSection, NotesSection, TermsSection , fmtDate } from './TemplateShared';
import { formatCurrency } from '@/utils/format';

// ─────────────────────────────────────────────
// TEMPLATE 6: Dark Theme Invoice
// ─────────────────────────────────────────────
export function DarkTemplate({ invoice, tax }: TemplateProps) {
  const accent = invoice.customization.accentColor;
  const cols = invoice.customization.columnNames;

  return (
    <div className="w-full min-h-[1000px] p-12 font-sans" style={{ backgroundColor: '#0f0f0f', fontFamily: 'inherit', color: '#e2e8f0' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          {invoice.customization.showLogo && invoice.company.logo ? (
            <img src={invoice.company.logo} alt="Logo" className="h-14 mb-3 object-contain" />
          ) : (
            <div
              className="inline-block px-4 py-2 rounded-lg mb-3 font-black text-lg tracking-wide"
              style={{ backgroundColor: accent, color: '#fff' }}
            >
              {invoice.company.name.charAt(0)}{invoice.company.name.split(' ')[1]?.charAt(0) ?? ''}
            </div>
          )}
          <h1 className="text-xl font-bold text-white">{invoice.company.name}</h1>
          <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>{invoice.company.address}</p>
          <p className="text-sm" style={{ color: '#94a3b8' }}>{[invoice.company.city, invoice.company.state, invoice.company.zip, invoice.company.country].filter(Boolean).join(', ')}</p>
          <p className="text-sm" style={{ color: '#94a3b8' }}>{invoice.company.email}</p>
          {invoice.company.gstin && <p className="text-xs mt-1" style={{ color: '#64748b' }}>GSTIN: {invoice.company.gstin}</p>}
        </div>
        <div className="text-right">
          <h2 className="text-5xl font-black tracking-widest" style={{ color: accent }}>INV</h2>
          <p className="text-white font-bold text-lg mt-1">#{invoice.invoiceNumber}</p>
          <p className="text-sm mt-2" style={{ color: '#94a3b8' }}>{fmtDate(invoice, invoice.invoiceDate)}</p>
          {invoice.dueDate && <p className="text-sm" style={{ color: '#94a3b8' }}>Due {fmtDate(invoice, invoice.dueDate)}</p>}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full mb-8" style={{ backgroundColor: accent + '40' }} />

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="rounded-xl p-5" style={{ backgroundColor: '#1a1a2e', border: '1px solid #2d2d4e' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>From</p>
          <p className="font-semibold text-white">{invoice.company.name}</p>
          <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>{invoice.company.address}</p>
          <p className="text-sm" style={{ color: '#94a3b8' }}>{invoice.company.phone}</p>
        </div>
        <div className="rounded-xl p-5" style={{ backgroundColor: '#1a1a2e', border: '1px solid #2d2d4e' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>To</p>
          <p className="font-semibold text-white">{invoice.client.name}</p>
          <p className="text-sm" style={{ color: '#94a3b8' }}>{invoice.client.company}</p>
          <p className="text-sm" style={{ color: '#94a3b8' }}>{invoice.client.address}</p>
          <p className="text-sm" style={{ color: '#94a3b8' }}>{[invoice.client.city, invoice.client.state, invoice.client.zip, invoice.client.country].filter(Boolean).join(', ')}</p>
          <p className="text-sm" style={{ color: '#94a3b8' }}>{invoice.client.email}</p>
          {invoice.client.gstin && <p className="text-xs mt-1" style={{ color: '#64748b' }}>GSTIN: {invoice.client.gstin}</p>}
        </div>
      </div>

      {/* Items Table */}
      <div className="rounded-xl overflow-hidden mb-8" style={{ border: '1px solid #2d2d4e' }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ backgroundColor: accent + '20' }}>
              <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider w-10" style={{ color: accent }}>#</th>
              <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>{cols.description}</th>
              <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-right w-20" style={{ color: accent }}>{cols.quantity}</th>
              <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-right w-28" style={{ color: accent }}>{cols.rate}</th>
              <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-right w-28" style={{ color: accent }}>{cols.amount}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={item.id} style={{ borderTop: '1px solid #2d2d4e', backgroundColor: i % 2 === 1 ? '#141414' : 'transparent' }}>
                <td className="py-3 px-5 text-sm" style={{ color: '#475569' }}>{i + 1}</td>
                <td className="py-3 px-5 text-sm text-slate-200">{item.description}</td>
                <td className="py-3 px-5 text-sm text-right" style={{ color: '#94a3b8' }}>{item.quantity}</td>
                <td className="py-3 px-5 text-sm text-right" style={{ color: '#94a3b8' }}>{formatCurrency(item.rate, invoice.currency)}</td>
                <td className="py-3 px-5 text-sm text-right font-bold text-white">{formatCurrency(item.subtotal, invoice.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between gap-8">
        <div className="flex-1 space-y-4">
          <DarkBankSection invoice={invoice} accent={accent} />
          <DarkNotesSection invoice={invoice} accent={accent} />
        </div>
        <div className="w-72 rounded-xl p-6" style={{ backgroundColor: '#1a1a2e', border: `1px solid ${accent}40` }}>
          <DarkTotals invoice={invoice} tax={tax} accent={accent} />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 pt-4 text-center text-xs" style={{ borderTop: '1px solid #2d2d4e', color: '#475569' }}>
        {invoice.company.website ? invoice.company.website + ' · ' : ''}Thank you for your business
      </div>
    </div>
  );
}

function DarkTotals({ invoice, tax, accent }: TemplateProps & { accent: string }) {
  const { taxConfig, currency } = invoice;
  type Row = { label: string; value: string; highlight?: boolean };
  const rows: Row[] = [];
  rows.push({ label: 'Subtotal', value: formatCurrency(tax.subtotal, currency) });
  if (taxConfig.enableDiscount && tax.discountAmount > 0) {
    rows.push({ label: 'Discount', value: `– ${formatCurrency(tax.discountAmount, currency)}` });
    rows.push({ label: 'Taxable Amount', value: formatCurrency(tax.taxableAmount, currency) });
  }
  if (taxConfig.enableGST) {
    if (taxConfig.isIGST) {
      rows.push({ label: `IGST (${taxConfig.gstRate}%)`, value: formatCurrency(tax.igst, currency) });
    } else {
      rows.push({ label: `CGST (${taxConfig.gstRate / 2}%)`, value: formatCurrency(tax.cgst, currency) });
      rows.push({ label: `SGST (${taxConfig.gstRate / 2}%)`, value: formatCurrency(tax.sgst, currency) });
    }
  }
  rows.push({ label: 'Total', value: formatCurrency(tax.grandTotal, currency), highlight: true });

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row, i) => (
        <div key={i} className={`flex justify-between text-sm ${row.highlight ? 'border-t pt-2 mt-1' : ''}`} style={{ borderColor: accent + '40' }}>
          <span style={{ color: row.highlight ? '#e2e8f0' : '#94a3b8' }}>{row.label}</span>
          <span style={{ color: row.highlight ? accent : '#cbd5e1' }} className={row.highlight ? 'font-bold text-base' : ''}>{row.value}</span>
        </div>
      ))}
      {invoice.currency === 'INR' && (
        <p className="text-xs mt-2 italic" style={{ color: '#475569' }}>
          {/* amount in words elided on dark theme for brevity */}
        </p>
      )}
    </div>
  );
}

function DarkBankSection({ invoice, accent }: { invoice: TemplateProps['invoice']; accent: string }) {
  if (!invoice.customization.showBankDetails) return null;
  const b = invoice.bankDetails;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: accent }}>Bank Details</p>
      <div className="text-xs space-y-0.5" style={{ color: '#94a3b8' }}>
        <p><span style={{ color: '#cbd5e1' }}>Bank:</span> {b.bankName}</p>
        <p><span style={{ color: '#cbd5e1' }}>A/C No.:</span> {b.accountNumber}</p>
        <p><span style={{ color: '#cbd5e1' }}>IFSC:</span> {b.ifscCode}</p>
      </div>
    </div>
  );
}

function DarkNotesSection({ invoice, accent }: { invoice: TemplateProps['invoice']; accent: string }) {
  if (!invoice.notes && !invoice.terms) return null;
  return (
    <div>
      {invoice.notes && (
        <>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: accent }}>Notes</p>
          <p className="text-xs" style={{ color: '#94a3b8' }}>{invoice.notes}</p>
        </>
      )}
      {invoice.terms && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: accent }}>Terms</p>
          <p className="text-xs" style={{ color: '#94a3b8' }}>{invoice.terms}</p>
        </div>
      )}
    </div>
  );
}
