import { InvoiceData, TaxBreakdown } from '@/types/invoice';
import { formatCurrency, formatDate, taxSummaryRows, numberToWords } from '@/utils/format';

export interface TemplateProps {
  invoice: InvoiceData;
  tax: TaxBreakdown;
}

/** Format a date string using the customization dateFormat setting */
export function fmtDate(invoice: InvoiceData, dateStr: string): string {
  return formatDate(dateStr, invoice.customization.dateFormat ?? 'YYYY-MM-DD');
}

/** Returns the custom invoice title (e.g. "TAX INVOICE") or "INVOICE" */
export function invoiceTitle(invoice: InvoiceData): string {
  return invoice.customization.invoiceTitle?.trim() || 'INVOICE';
}

// Shared sub-components used across templates
export function ItemsTableBody({ invoice }: { invoice: InvoiceData }) {
  return (
    <>
      {invoice.items.map((item, i) => (
        <tr key={item.id} className="border-b border-gray-100">
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
    </>
  );
}

export function TotalsSection({ invoice, tax }: TemplateProps) {
  const rows = taxSummaryRows(tax, invoice.currency, invoice.taxConfig);
  return (
    <div className="flex flex-col gap-1.5">
      {rows.map((row, i) => (
        <div
          key={i}
          className={`flex justify-between text-sm ${row.bold ? 'font-bold text-gray-900 text-base border-t pt-2 mt-1' : 'text-gray-600'}`}
        >
          <span>{row.label}</span>
          <span>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

export function AmountInWords({ invoice, tax }: TemplateProps) {
  if (invoice.currency !== 'INR') return null;
  return (
    <p className="text-xs text-gray-500 mt-2 italic">
      {'Amount in Words: '}
      <span className="font-medium text-gray-700">{numberToWords(tax.grandTotal)}</span>
    </p>
  );
}

export function BankDetailsSection({ invoice }: { invoice: InvoiceData }) {
  if (!invoice.customization.showBankDetails) return null;
  const b = invoice.bankDetails;
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Bank Details</p>
      <div className="text-xs text-gray-600 space-y-0.5">
        <p><span className="font-medium">Bank:</span> {b.bankName}</p>
        <p><span className="font-medium">A/C Name:</span> {b.accountName}</p>
        <p><span className="font-medium">A/C No.:</span> {b.accountNumber}</p>
        <p><span className="font-medium">IFSC:</span> {b.ifscCode}</p>
        <p><span className="font-medium">Branch:</span> {b.branchName}</p>
      </div>
    </div>
  );
}

export function NotesSection({ invoice }: { invoice: InvoiceData }) {
  if (!invoice.customization.showNotes || !invoice.notes) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Notes</p>
      <p className="text-xs text-gray-600">{invoice.notes}</p>
    </div>
  );
}

export function TermsSection({ invoice }: { invoice: InvoiceData }) {
  if (!invoice.customization.showTerms || !invoice.terms) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Terms & Conditions</p>
      <p className="text-xs text-gray-600">{invoice.terms}</p>
    </div>
  );
}
