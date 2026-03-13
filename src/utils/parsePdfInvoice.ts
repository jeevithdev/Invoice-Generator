import type { InvoiceData, InvoiceItem } from '@/types/invoice';

// ── Text item extracted from PDF page ────────────────────────────────────────
interface TextItem {
  str: string;
  x: number;
  y: number;
}

// ── Result passed back to the UI ─────────────────────────────────────────────
export interface ParsedInvoiceResult {
  partial: Partial<InvoiceData>;
  rawText: string;
  warnings: string[];
}

// ── Helper: normalise a date string to YYYY-MM-DD ────────────────────────────
function normaliseDate(raw: string): string {
  const s = raw.trim();
  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  // DD/MM/YYYY, MM/DD/YYYY, DD-MM-YYYY, etc.
  // Prefer DMY for ambiguous inputs (<=12 on both sides) to preserve existing behavior.
  const slashDate = s.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (slashDate) {
    const a = parseInt(slashDate[1], 10);
    const b = parseInt(slashDate[2], 10);
    const y = slashDate[3];
    const day = a > 12 ? a : b > 12 ? b : a;
    const month = a > 12 ? b : b > 12 ? a : b;
    return `${y}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  // "10 March 2026" or "March 10, 2026"
  const months: Record<string,string> = {
    january:'01',february:'02',march:'03',april:'04',may:'05',june:'06',
    july:'07',august:'08',september:'09',october:'10',november:'11',december:'12',
    jan:'01',feb:'02',mar:'03',apr:'04',jun:'06',jul:'07',aug:'08',
    sep:'09',oct:'10',nov:'11',dec:'12',
  };
  const written1 = s.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (written1) {
    const m = months[written1[2].toLowerCase()];
    if (m) return `${written1[3]}-${m}-${written1[1].padStart(2,'0')}`;
  }
  const written2 = s.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/);
  if (written2) {
    const m = months[written2[1].toLowerCase()];
    if (m) return `${written2[3]}-${m}-${written2[2].padStart(2,'0')}`;
  }
  return s; // return raw if we can't parse
}

// ── Helper: parse a currency/number string to a number ───────────────────────
function parseAmount(s: string): number {
  return parseFloat(s.replace(/[₹$€£¥,\s]/g, '')) || 0;
}

// ── Helper: group text items into lines by Y-coordinate ──────────────────────
function groupIntoLines(items: TextItem[]): string[] {
  if (!items.length) return [];
  const sorted = [...items].sort((a, b) => a.y !== b.y ? a.y - b.y : a.x - b.x);
  const lines: string[] = [];
  let currentY = sorted[0].y;
  let currentLine: TextItem[] = [];

  for (const item of sorted) {
    if (Math.abs(item.y - currentY) <= 3) {
      currentLine.push(item);
    } else {
      if (currentLine.length) {
        currentLine.sort((a, b) => a.x - b.x);
        lines.push(currentLine.map(i => i.str).join(' ').trim());
      }
      currentLine = [item];
      currentY = item.y;
    }
  }
  if (currentLine.length) {
    currentLine.sort((a, b) => a.x - b.x);
    lines.push(currentLine.map(i => i.str).join(' ').trim());
  }
  return lines.filter(l => l.length > 0);
}

// ── Main parser ───────────────────────────────────────────────────────────────
export async function parsePdfInvoice(file: File): Promise<ParsedInvoiceResult> {
  const warnings: string[] = [];

  // 1. Load PDF and extract text items with positions
  const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist');
  GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;

  const allItems: TextItem[] = [];
  for (let p = 1; p <= Math.min(numPages, 3); p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const vp = page.getViewport({ scale: 1 });
    for (const item of content.items) {
      if ('str' in item && item.str.trim()) {
        const tx = 'transform' in item && Array.isArray(item.transform) ? item.transform : undefined;
        allItems.push({
          str: item.str,
          x: tx ? tx[4] : 0,
          // flip Y so top-of-page = 0
          y: tx ? Math.round((vp.height - tx[5]) * 10) / 10 : 0,
        });
      }
    }
  }

  const lines = groupIntoLines(allItems);
  const rawText = lines.join('\n');

  // ── 2. Extract fields ──────────────────────────────────────────────────────

  // Invoice number
  let invoiceNumber = '';
  for (const line of lines) {
    const m = line.match(/[Ii]nvoice\s*(?:No\.?|#|Number)?\s*[:#]?\s*([\w#\-\/]+)/i)
           || line.match(/#\s*(INV[\w\-\/]*)/i)
           || line.match(/^#([\w\-\/]+)$/);
    if (m && m[1] && m[1].length < 30) { invoiceNumber = m[1].replace(/^#/, ''); break; }
  }
  if (!invoiceNumber) warnings.push('Could not detect invoice number');

  // Dates
  const DATE_RE = /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4}|\d{4}-\d{2}-\d{2}|\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}|[A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})/;
  let invoiceDate = '';
  let dueDate = '';
  for (const line of lines) {
    const low = line.toLowerCase();
    if (!invoiceDate && (low.includes('date') || low.includes('issued')) && !low.includes('due')) {
      const m = line.match(DATE_RE);
      if (m) invoiceDate = normaliseDate(m[1]);
    }
    if (!dueDate && (low.includes('due') || low.includes('payment due') || low.includes('pay by'))) {
      const m = line.match(DATE_RE);
      if (m) dueDate = normaliseDate(m[1]);
    }
  }
  if (!invoiceDate) invoiceDate = new Date().toISOString().split('T')[0];
  if (!dueDate) dueDate = '';

  // GSTIN
  const GSTIN_RE = /\b(\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1})\b/g;
  const gstins = rawText.match(GSTIN_RE) || [];

  // Email
  const EMAIL_RE = /\b([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})\b/g;
  const emails = rawText.match(EMAIL_RE) || [];

  // Phone
  const PHONE_RE = /(?:\+?\d[\d\s\-()]{8,14}\d)/g;
  const phones = rawText.match(PHONE_RE) || [];

  // Website
  const WEB_RE = /\b((?:www\.)[a-zA-Z0-9\-_.]+\.[a-zA-Z]{2,}(?:\/\S*)?)/g;
  const websites = rawText.match(WEB_RE) || [];

  // Currency symbol
  let currency = 'INR';
  if (rawText.match(/\$/)) currency = 'USD';
  else if (rawText.match(/€/)) currency = 'EUR';
  else if (rawText.match(/£/)) currency = 'GBP';
  else if (rawText.match(/₹|INR/)) currency = 'INR';

  // ── 3. Company & Client blocks ─────────────────────────────────────────────
  // Find "INVOICE" heading line index — company is typically above it, client below "Bill To"
  const invoiceHeadIdx = lines.findIndex(l => /^INVOICE$/i.test(l.trim()));
  const billToIdx = lines.findIndex(l => /bill\s*to|billed?\s*to|to\s*:/i.test(l));

  // Company: lines before invoice heading (or first 6 lines if not found)
  const companyLines = invoiceHeadIdx > 0
    ? lines.slice(0, invoiceHeadIdx).filter(l => !/^INVOICE$/i.test(l))
    : lines.slice(0, 6);

  const companyName = companyLines[0] || '';
  const companyAddress = companyLines[1] || '';
  // Try to split city/state/zip from a line like "Mumbai, Maharashtra, 400001, India"
  let companyCity = '', companyState = '', companyZip = '', companyCountry = '';
  for (const cl of companyLines.slice(1)) {
    const parts = cl.split(',').map(s => s.trim());
    if (parts.length >= 2) {
      companyCity = parts[0];
      companyState = parts[1] || '';
      companyZip = parts[2] || '';
      companyCountry = parts[3] || '';
      break;
    }
  }

  // Client: lines after "Bill To"
  const clientLines = billToIdx >= 0
    ? lines.slice(billToIdx + 1, billToIdx + 8)
    : [];
  const clientName = clientLines[0] || '';
  const clientCompany = clientLines[1] || '';
  const clientAddress = clientLines[2] || '';
  let clientCity = '', clientState = '', clientZip = '', clientCountry = '';
  for (const cl of clientLines.slice(2)) {
    const parts = cl.split(',').map(s => s.trim());
    if (parts.length >= 2) {
      clientCity = parts[0];
      clientState = parts[1] || '';
      clientZip = parts[2] || '';
      clientCountry = parts[3] || '';
      break;
    }
  }

  // ── 4. Line items ──────────────────────────────────────────────────────────
  // A line item row typically contains: text + 2-3 numbers (qty, rate, amount)
  const items: InvoiceItem[] = [];
  const genId = () => Math.random().toString(36).substring(2, 11);

  let lastItem: InvoiceItem | null = null;

  for (const line of lines) {
    // Skip header rows and total rows
    if (/description|item|particulars|qty|quantity|rate|amount|subtotal|total|cgst|sgst|igst|discount/i.test(line)) {
      lastItem = null;
      continue;
    }

    // Match numbers more robustly (e.g. 1,000.50 or 50 or 1.25)
    const nums = line.match(/([₹$€£]?\s*(?:\d{1,3}(?:,\d{3})*|\d+)(?:\.\d+)?)/g);

    if (nums && nums.length >= 2) {
      const amountRaw = nums[nums.length - 1];
      const rateRaw   = nums[nums.length - 2];
      const qtyRaw    = nums.length >= 3 ? nums[nums.length - 3] : '1';

      const amount  = parseAmount(amountRaw);
      const rate    = parseAmount(rateRaw);
      const qty     = parseFloat(qtyRaw.replace(/[^\d.]/g,'')) || 1;

      // Heuristic: amount ≈ qty * rate (within 2%)
      if (amount > 0 && rate > 0 && Math.abs(qty * rate - amount) / amount < 0.02) {
        // description = everything before the first number
        const firstNumIdx = line.search(/[₹$€£]?\s*\d/);
        let desc = firstNumIdx > 0 ? line.slice(0, firstNumIdx).trim() : line.trim();
        // Remove trailing non-word chars
        desc = desc.replace(/[^\w\s\)\]\}]+$/, '').trim();

        if (desc.length > 1 && desc.length < 150 && !/^\d+$/.test(desc)) {
          const newItem = { id: genId(), description: desc, quantity: qty, rate, subtotal: amount };
          items.push(newItem);
          lastItem = newItem;
          continue;
        }
      }
    }

    // If no numbers but we had a lastItem, this might be a multiline description
    if (lastItem && !nums && line.trim().length > 0 && line.length < 100) {
      if (!/bank|account|ifsc|terms|notes|gst|tax/i.test(line)) {
        lastItem.description += ' ' + line.trim();
        continue;
      }
    }
    lastItem = null;
  }

  // ── 4b. Tax and Discount Extraction ─────────────────────────────────────────
  let enableGST = false;
  let gstRate = 18;
  let isIGST = false;
  let enableDiscount = false;
  let discountValue = 0;
  let discountType: "percentage" | "fixed" = "fixed";

  for (const line of lines) {
    const low = line.toLowerCase();
    
    // Extract GST
    if (low.includes('cgst') || low.includes('sgst') || low.includes('igst') || low.includes('gst')) {
      enableGST = true;
      if (low.includes('igst')) isIGST = true;
      
      const rateMatch = line.match(/(\d+(?:\.\d+)?)\s*%/);
      if (rateMatch) {
         let r = parseFloat(rateMatch[1]);
         if (low.includes('cgst') || low.includes('sgst')) r *= 2; 
         if (r > 0 && r <= 100) gstRate = r;
      }
    }

    // Extract Discount
    if (low.includes('discount')) {
      enableDiscount = true;
      const pctMatch = line.match(/(\d+(?:\.\d+)?)\s*%/);
      if (pctMatch) {
        discountType = 'percentage';
        discountValue = parseFloat(pctMatch[1]);
      } else {
        const valMatch = line.match(/[\d,]+(?:\.\d{1,2})?/g);
        if (valMatch && valMatch.length > 0) {
           discountType = 'fixed';
           discountValue = parseAmount(valMatch[valMatch.length - 1]);
        }
      }
    }
  }

  // ── 5. Notes & Terms ──────────────────────────────────────────────────────
  let notes = '';
  let terms = '';
  const notesIdx = lines.findIndex(l => /^notes?$/i.test(l.trim()));
  const termsIdx = lines.findIndex(l => /^terms?(?:\s*&\s*conditions?)?$/i.test(l.trim()));
  if (notesIdx >= 0) notes = lines.slice(notesIdx + 1, notesIdx + 4).join(' ');
  if (termsIdx >= 0) terms = lines.slice(termsIdx + 1, termsIdx + 4).join(' ');

  // ── 6. Bank details ───────────────────────────────────────────────────────
  let bankName = '', accountNumber = '', ifscCode = '', branchName = '', accountName = '';
  for (const line of lines) {
    const low = line.toLowerCase();
    if (!bankName && low.includes('bank') && !low.includes('bank details')) {
      const m = line.match(/[Bb]ank\s*[:\-]?\s*(.+)/);
      if (m) bankName = m[1].trim();
    }
    if (!accountNumber) {
      const m = line.match(/[Aa]\/[Cc]\s*(?:[Nn]o\.?)?\s*[:\-]?\s*([\d]+)/);
      if (m) accountNumber = m[1];
    }
    if (!ifscCode) {
      const m = line.match(/[Ii][Ff][Ss][Cc]\s*[:\-]?\s*([A-Z0-9]{11})/i);
      if (m) ifscCode = m[1].toUpperCase();
    }
    if (!branchName && low.includes('branch')) {
      const m = line.match(/[Bb]ranch\s*[:\-]?\s*(.+)/);
      if (m) branchName = m[1].trim();
    }
    if (!accountName && (low.includes('a/c name') || low.includes('account name'))) {
      const m = line.match(/[Aa]\/[Cc]\s*[Nn]ame\s*[:\-]?\s*(.+)|[Aa]ccount\s*[Nn]ame\s*[:\-]?\s*(.+)/);
      if (m) accountName = (m[1] || m[2] || '').trim();
    }
  }

  const partial: Partial<InvoiceData> = {
    invoiceNumber: invoiceNumber || undefined,
    invoiceDate,
    ...(dueDate ? { dueDate } : {}),
    currency,
    company: {
      name: companyName,
      address: companyAddress,
      city: companyCity,
      state: companyState,
      zip: companyZip,
      country: companyCountry,
      phone: phones[0] || '',
      email: emails[0] || '',
      website: websites[0] || '',
      gstin: gstins[0] || '',
      logo: null,
    },
    client: {
      name: clientName,
      company: clientCompany,
      address: clientAddress,
      city: clientCity,
      state: clientState,
      zip: clientZip,
      country: clientCountry,
      phone: phones[1] || '',
      email: emails[1] || '',
      gstin: gstins[1] || '',
    },
    ...(items.length ? { items } : {}),
    ...(notes ? { notes } : {}),
    ...(terms ? { terms } : {}),
    bankDetails: {
      bankName,
      accountName: accountName || companyName,
      accountNumber,
      ifscCode,
      branchName,
    },
    ...((enableGST || enableDiscount) ? {
      taxConfig: {
        enableGST,
        gstRate,
        isIGST,
        enableDiscount,
        discountType,
        discountValue,
      }
    } : {})
  };

  return { partial, rawText, warnings };
}
