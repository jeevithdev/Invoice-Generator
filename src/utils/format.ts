import { TaxBreakdown } from '@/types/invoice';

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AUD: 'A$',
  CAD: 'C$',
  SGD: 'S$',
  AED: 'AED ',
};

export function currencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] ?? currency + ' ';
}

export function formatCurrency(amount: number, currency: string): string {
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  return `${currencySymbol(currency)}${amount.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(dateStr: string, fmt: string): string {
  if (!dateStr) return dateStr;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  switch (fmt) {
    case 'DD/MM/YYYY': return `${dd}/${mm}/${yyyy}`;
    case 'MM/DD/YYYY': return `${mm}/${dd}/${yyyy}`;
    case 'DD MMM YYYY': return `${dd} ${MONTHS[d.getMonth()]} ${yyyy}`;
    default: return `${yyyy}-${mm}-${dd}`; // YYYY-MM-DD
  }
}

export function numberToWords(num: number): string {
  if (num === 0) return 'Zero';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function helper(n: number): string {
    if (n === 0) return '';
    if (n < 20) return ones[n] + ' ';
    if (n < 100) return tens[Math.floor(n / 10)] + ' ' + helper(n % 10);
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred ' + helper(n % 100);
    if (n < 100000) return helper(Math.floor(n / 1000)) + 'Thousand ' + helper(n % 1000);
    if (n < 10000000) return helper(Math.floor(n / 100000)) + 'Lakh ' + helper(n % 100000);
    return helper(Math.floor(n / 10000000)) + 'Crore ' + helper(n % 10000000);
  }

  // Round to 2 decimal places to handle floating-point precision issues
  const roundedNum = Math.round(num * 100) / 100;
  let intPart = Math.floor(roundedNum);
  let decPart = Math.round((roundedNum - intPart) * 100);
  
  // Handle case where decimal rounds to 100 paise (should be 1 rupee)
  if (decPart >= 100) {
    intPart += Math.floor(decPart / 100);
    decPart = decPart % 100;
  }
  
  let result = helper(intPart).trim() + ' Rupees';
  if (decPart > 0) result += ' and ' + helper(decPart).trim() + ' Paise';
  result += ' Only';
  return result;
}

export function taxSummaryRows(tax: TaxBreakdown, currency: string, taxConfig: { enableGST: boolean; gstRate: number; isIGST: boolean; enableDiscount: boolean }) {
  const rows: { label: string; value: string; bold?: boolean }[] = [];
  rows.push({ label: 'Subtotal', value: formatCurrency(tax.subtotal, currency) });
  if (taxConfig.enableDiscount && tax.discountAmount > 0) {
    rows.push({ label: 'Discount', value: `- ${formatCurrency(tax.discountAmount, currency)}` });
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
  rows.push({ label: 'Total', value: formatCurrency(tax.grandTotal, currency), bold: true });
  return rows;
}
