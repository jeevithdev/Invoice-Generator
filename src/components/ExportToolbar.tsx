'use client';
import { useRef, useCallback } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { Download, Printer, Save, FolderOpen, RotateCcw } from 'lucide-react';

// ─── Color conversion helpers ────────────────────────────────────────────────
// html2canvas (used by html2pdf.js) cannot parse CSS Color Level 4 functions:
// lab(), lch(), oklab(), oklch(), hwb(), color-mix(), color().
// Tailwind v4 emits all of these in its generated CSS.
// These helpers convert them to rgb()/rgba() that html2canvas understands.

function linearToSrgb(c: number): number {
  const v = Math.max(0, c);
  return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
}

function clamp8(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function labToSrgb(L: number, a: number, b: number): [number, number, number] {
  const fy = (L + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;
  const inv = (t: number) =>
    t > 6 / 29 ? t ** 3 : 3 * (6 / 29) ** 2 * (t - 4 / 29);
  const x = inv(fx) * 0.95047;
  const y = inv(fy);
  const z = inv(fz) * 1.08883;
  const rl =  3.2406 * x - 1.5372 * y - 0.4986 * z;
  const gl = -0.9689 * x + 1.8758 * y + 0.0415 * z;
  const bl =  0.0557 * x - 0.2040 * y + 1.0570 * z;
  return [
    clamp8(linearToSrgb(rl) * 255),
    clamp8(linearToSrgb(gl) * 255),
    clamp8(linearToSrgb(bl) * 255),
  ];
}

function oklabToSrgb(l: number, a: number, b: number): [number, number, number] {
  const l3 = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m3 = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s3 = (l - 0.0894841775 * a - 1.2914855480 * b) ** 3;
  const rl =  4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const gl = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;
  return [
    clamp8(linearToSrgb(rl) * 255),
    clamp8(linearToSrgb(gl) * 255),
    clamp8(linearToSrgb(bl) * 255),
  ];
}

function hwbToRgb(h: number, w: number, b: number): [number, number, number] {
  if (w + b >= 1) {
    const g = clamp8((w / (w + b)) * 255);
    return [g, g, g];
  }
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return (1 - Math.max(0, Math.min(k, 4 - k, 1))) * (1 - w - b) + w;
  };
  return [clamp8(f(5) * 255), clamp8(f(3) * 255), clamp8(f(1) * 255)];
}

function parseNum(s: string): number {
  return parseFloat(s) || 0;
}

function convertModernColor(funcName: string, inner: string): string {
  try {
    const fn = funcName.toLowerCase().trim();
    // Split alpha after '/'
    const slashIdx = inner.lastIndexOf('/');
    let colorPart = inner;
    let alpha = 1;
    if (slashIdx !== -1) {
      const ap = inner.slice(slashIdx + 1).trim();
      alpha = ap.endsWith('%') ? parseNum(ap) / 100 : parseNum(ap);
      colorPart = inner.slice(0, slashIdx).trim();
    }
    const parts = colorPart.split(/[\s,]+/).filter(Boolean);
    let r = 128, g = 128, bl = 128;

    if (fn === 'color-mix') {
      if (inner.includes('transparent')) return 'transparent';
      // Use a neutral mid-tone fallback
      return 'rgba(128,128,128,0.5)';
    } else if (fn === 'lab') {
      [r, g, bl] = labToSrgb(parseNum(parts[0]), parseNum(parts[1]), parseNum(parts[2]));
    } else if (fn === 'lch') {
      const C = parseNum(parts[1]);
      const H = parseNum(parts[2]);
      [r, g, bl] = labToSrgb(
        parseNum(parts[0]),
        C * Math.cos((H * Math.PI) / 180),
        C * Math.sin((H * Math.PI) / 180),
      );
    } else if (fn === 'oklab') {
      const L = parts[0]?.endsWith('%') ? parseNum(parts[0]) / 100 : parseNum(parts[0]);
      [r, g, bl] = oklabToSrgb(L, parseNum(parts[1]), parseNum(parts[2]));
    } else if (fn === 'oklch') {
      const L = parts[0]?.endsWith('%') ? parseNum(parts[0]) / 100 : parseNum(parts[0]);
      const C = parts[1]?.endsWith('%') ? parseNum(parts[1]) / 100 * 0.4 : parseNum(parts[1]);
      const H = parseNum(parts[2]);
      [r, g, bl] = oklabToSrgb(
        L,
        C * Math.cos((H * Math.PI) / 180),
        C * Math.sin((H * Math.PI) / 180),
      );
    } else if (fn === 'hwb') {
      const w = parts[1]?.endsWith('%') ? parseNum(parts[1]) / 100 : parseNum(parts[1]);
      const b = parts[2]?.endsWith('%') ? parseNum(parts[2]) / 100 : parseNum(parts[2]);
      [r, g, bl] = hwbToRgb(parseNum(parts[0]), w, b);
    } else if (fn === 'color') {
      const cs = parts[0]?.toLowerCase();
      if (cs === 'srgb' || cs === 'srgb-linear') {
        r = clamp8(parseNum(parts[1]) * 255);
        g = clamp8(parseNum(parts[2]) * 255);
        bl = clamp8(parseNum(parts[3]) * 255);
        if (parts[4]) alpha = parseNum(parts[4]);
      }
    }

    return alpha >= 1
      ? `rgb(${r},${g},${bl})`
      : `rgba(${r},${g},${bl},${+alpha.toFixed(4)})`;
  } catch {
    return 'rgba(128,128,128,1)';
  }
}

/**
 * Replaces ALL CSS Color Level 4+ functions in a CSS text string with
 * rgb()/rgba() equivalents that html2canvas can parse.
 * Uses paren-depth tracking for correct handling of nested functions.
 */
function replaceModernColorFunctions(text: string): string {
  const re = /\b(color-mix|oklab|oklch|lab|lch|hwb|color)\s*\(/gi;
  let result = '';
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    result += text.slice(lastIndex, match.index);
    let depth = 0;
    let j = match.index;
    while (j < text.length) {
      if (text[j] === '(') depth++;
      else if (text[j] === ')') {
        depth--;
        if (depth === 0) { j++; break; }
      }
      j++;
    }
    const fn = match[1];
    const full = text.slice(match.index, j);
    const inner = full.slice(fn.length).replace(/^\s*\(/, '').replace(/\)\s*$/, '');
    result += convertModernColor(fn, inner);
    lastIndex = j;
    re.lastIndex = j;
  }

  return result + text.slice(lastIndex);
}

/**
 * Processes all <style> elements AND fetches+inlines all <link rel="stylesheet">
 * in the cloned document, replacing modern CSS color functions throughout.
 * html2canvas supports async onclone (returns a Promise).
 */
async function fixClonedDoc(clonedDoc: Document): Promise<void> {
  // Fix inline <style> elements
  clonedDoc.querySelectorAll('style').forEach((el) => {
    if (el.textContent) {
      el.textContent = replaceModernColorFunctions(el.textContent);
    }
  });

  // Fetch, fix, and inline all same-origin <link rel="stylesheet">
  const links = Array.from(
    clonedDoc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
  );
  await Promise.all(
    links.map(async (link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      const url = new URL(href, window.location.href).href;
      if (!url.startsWith(window.location.origin)) return;
      try {
        const res = await fetch(url);
        const css = await res.text();
        const style = clonedDoc.createElement('style');
        style.textContent = replaceModernColorFunctions(css);
        link.parentNode?.replaceChild(style, link);
      } catch {
        link.remove();
      }
    }),
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ExportToolbar() {
  const { invoice, loadSavedInvoice, resetInvoice } = useInvoiceStore();

  const handleDownloadPDF = useCallback(async () => {
    const el = document.getElementById('invoice-preview-root');
    if (!el) return;

    const html2pdf = (await import('html2pdf.js')).default;
    const opt = {
      margin: 0,
      filename: `Invoice-${invoice.invoiceNumber}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        onclone: (clonedDoc: Document) => fixClonedDoc(clonedDoc),
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
    };
    html2pdf().set(opt).from(el).save();
  }, [invoice.invoiceNumber]);

  const handlePrint = useCallback(() => {
    const el = document.getElementById('invoice-preview-root');
    if (!el) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
            body { margin: 0; font-family: Inter, sans-serif; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          </style>
        </head>
        <body>${el.outerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }, [invoice.invoiceNumber]);

  const handleSave = useCallback(() => {
    const json = JSON.stringify(invoice, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${invoice.invoiceNumber}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [invoice]);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleLoad = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          loadSavedInvoice(data);
        } catch {
          alert('Invalid invoice file');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    },
    [loadSavedInvoice],
  );

  const handleReset = useCallback(() => {
    if (confirm('Reset to default invoice? All changes will be lost.')) {
      resetInvoice();
    }
  }, [resetInvoice]);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={handleDownloadPDF}
        className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
      >
        <Download size={15} />
        Download PDF
      </button>
      <button
        type="button"
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2.5 bg-slate-700 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm"
      >
        <Printer size={15} />
        Print
      </button>
      <button
        type="button"
        onClick={handleSave}
        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
      >
        <Save size={15} />
        Save JSON
      </button>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
      >
        <FolderOpen size={15} />
        Load Invoice
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
        title="Reset invoice"
      >
        <RotateCcw size={15} />
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleLoad}
      />
    </div>
  );
}
