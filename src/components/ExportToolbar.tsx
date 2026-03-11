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
      // color-mix(in <colorspace>, <color1> [<pct>%], <color2> [<pct>%])
      // Tailwind v4 opacity modifiers (e.g. text-white/70) compile to:
      //   color-mix(in oklab, white 70%, transparent)
      // The old code returned 'transparent' whenever 'transparent' appeared,
      // making all semi-transparent white sidebar text invisible in the PDF.
      const withoutSpace = inner.replace(/^in\s+[\w-]+\s*,\s*/i, '');
      // Split the two arguments while respecting nested parentheses
      let depth2 = 0, splitAt = -1;
      for (let i = 0; i < withoutSpace.length; i++) {
        if (withoutSpace[i] === '(') depth2++;
        else if (withoutSpace[i] === ')') depth2--;
        else if (withoutSpace[i] === ',' && depth2 === 0) { splitAt = i; break; }
      }
      if (splitAt !== -1) {
        const raw1 = withoutSpace.slice(0, splitAt).trim();
        const raw2 = withoutSpace.slice(splitAt + 1).trim();
        const parsePart = (s: string): { colorStr: string; pct: number } => {
          const m = s.match(/^(.*?)\s+([\d.]+)%\s*$/);
          if (m) return { colorStr: m[1].trim(), pct: parseFloat(m[2]) / 100 };
          return { colorStr: s.trim(), pct: 0.5 };
        };
        const p1 = parsePart(raw1);
        const p2 = parsePart(raw2);
        // Resolve a color string (may contain nested modern functions) to [r, g, b, a]
        const resolveToRgba = (colorStr: string): [number, number, number, number] | null => {
          if (colorStr === 'transparent') return [0, 0, 0, 0];
          if (colorStr === 'white') return [255, 255, 255, 1];
          if (colorStr === 'black') return [0, 0, 0, 1];
          const hex = colorStr.match(/^#([0-9a-f]{3,6})$/i);
          if (hex) {
            const h = hex[1].length === 3 ? hex[1].split('').map(c => c + c).join('') : hex[1];
            return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1];
          }
          const rgbM = colorStr.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          if (rgbM) return [+rgbM[1], +rgbM[2], +rgbM[3], rgbM[4] ? +rgbM[4] : 1];
          // Recursively convert any nested modern color functions (e.g. oklch inside color-mix)
          const converted = replaceModernColorFunctions(colorStr);
          const m2 = converted.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          if (m2) return [+m2[1], +m2[2], +m2[3], m2[4] ? +m2[4] : 1];
          return null;
        };
        const rgba1 = resolveToRgba(p1.colorStr);
        const rgba2 = resolveToRgba(p2.colorStr);
        if (rgba1 && rgba2) {
          // When mixing with transparent (opacity modifier pattern like text-white/70),
          // return the solid color at full opacity so text stays the same color in the PDF
          // instead of being alpha-blended against the background by html2canvas.
          if (p1.colorStr === 'transparent') return `rgb(${rgba2[0]},${rgba2[1]},${rgba2[2]})`;
          if (p2.colorStr === 'transparent') return `rgb(${rgba1[0]},${rgba1[1]},${rgba1[2]})`;
          const a = p1.pct * rgba1[3] + p2.pct * rgba2[3];
          if (a <= 0) return 'transparent';
          const mixR = clamp8((p1.pct * rgba1[3] * rgba1[0] + p2.pct * rgba2[3] * rgba2[0]) / a);
          const mixG = clamp8((p1.pct * rgba1[3] * rgba1[1] + p2.pct * rgba2[3] * rgba2[1]) / a);
          const mixB = clamp8((p1.pct * rgba1[3] * rgba1[2] + p2.pct * rgba2[3] * rgba2[2]) / a);
          return a >= 1 ? `rgb(${mixR},${mixG},${mixB})` : `rgba(${mixR},${mixG},${mixB},${+a.toFixed(4)})`;
        }
      }
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
 * Converts 8-digit hex (#RRGGBBAA) to rgba() — html2canvas cannot parse 8-digit hex.
 * Also handles 4-digit hex (#RGBA).
 */
function expand8DigitHex(text: string): string {
  // #RRGGBBAA → rgba(R,G,B,A)
  text = text.replace(/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})\b/gi,
    (_, r, g, b, a) =>
      `rgba(${parseInt(r,16)},${parseInt(g,16)},${parseInt(b,16)},${+(parseInt(a,16)/255).toFixed(4)})`
  );
  // #RGBA → rgba(R,G,B,A)
  text = text.replace(/#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])\b/gi,
    (_, r, g, b, a) =>
      `rgba(${parseInt(r+r,16)},${parseInt(g+g,16)},${parseInt(b+b,16)},${+(parseInt(a+a,16)/255).toFixed(4)})`
  );
  return text;
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
  // Step 1: Fetch and inline all same-origin <link rel="stylesheet"> WITHOUT converting
  // colors yet — we need the full CSS so we can build the CSS variable map first.
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
        style.textContent = css; // raw — converted in step 3
        link.parentNode?.replaceChild(style, link);
      } catch {
        link.remove();
      }
    }),
  );

  // Step 2: Build a CSS custom-property map from ALL style elements.
  // Tailwind v4 compiles opacity utilities like `text-white/60` to:
  //   color-mix(in oklab, var(--color-white) 60%, transparent)
  // We need to know what --color-white (etc.) resolves to before we can convert.
  const varMap = new Map<string, string>();
  clonedDoc.querySelectorAll('style').forEach((el) => {
    if (!el.textContent) return;
    const re = /(--[\w-]+)\s*:\s*([^;}{]+)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(el.textContent)) !== null) {
      if (!varMap.has(m[1].trim())) varMap.set(m[1].trim(), m[2].trim());
    }
  });

  // Step 3: Substitute CSS vars, then convert modern color functions in every style.
  // Also strip all letter-spacing / word-spacing values from the CSS — html2canvas has
  // a known bug where non-zero letter-spacing is applied to space characters too, which
  // causes words to run together or have wrong spacing in the exported PDF.
  const substituteVars = (css: string, depth = 0): string => {
    if (depth > 5 || !css.includes('var(')) return css;
    return css.replace(/var\(\s*(--[\w-]+)\s*\)/g, (_: string, name: string) => {
      const val = varMap.get(name.trim());
      return val ? substituteVars(val, depth + 1) : _;
    });
  };

  const stripLetterWordSpacing = (css: string): string =>
    css
      .replace(/letter-spacing\s*:[^;!{}]*/gi, 'letter-spacing: 0')
      .replace(/word-spacing\s*:[^;!{}]*/gi, 'word-spacing: normal');

  clonedDoc.querySelectorAll('style').forEach((el) => {
    if (el.textContent) {
      el.textContent = stripLetterWordSpacing(
        expand8DigitHex(replaceModernColorFunctions(substituteVars(el.textContent))),
      );
    }
  });

  // Step 4a: Fix inline styles on every element:
  //   - letter-spacing / word-spacing → reset
  //   - 8-digit hex (#RRGGBBAA) → rgba()
  //   - modern color functions (oklch/oklab/color-mix/etc.) → rgb()/rgba()
  //   - CSS variable references → substitute from varMap
  //   - also collect any element-level CSS vars into varMap first
  clonedDoc.querySelectorAll<HTMLElement>('*').forEach((el) => {
    const style = el.style;
    if (!style || style.length === 0) return;

    // Collect CSS vars from inline styles into varMap (e.g. --invoice-accent on root element)
    for (let i = 0; i < style.length; i++) {
      const prop = style[i];
      if (prop.startsWith('--')) {
        const val = style.getPropertyValue(prop).trim();
        if (val && !varMap.has(prop)) varMap.set(prop, val);
      }
    }
  });

  clonedDoc.querySelectorAll<HTMLElement>('*').forEach((el) => {
    const style = el.style;
    if (!style || style.length === 0) return;

    if (style.letterSpacing) style.letterSpacing = '0';
    if (style.wordSpacing) style.wordSpacing = 'normal';

    // Fix ALL inline style properties that may contain colors or var() refs
    // (covers background, border shorthand, color, fill, etc.)
    const props: string[] = [];
    for (let i = 0; i < style.length; i++) props.push(style[i]);
    for (const prop of props) {
      if (prop.startsWith('--')) continue; // skip CSS vars themselves
      const val = style.getPropertyValue(prop);
      if (!val) continue;
      // Only process if it might contain a color value
      if (!/oklch|oklab|lab|lch|hwb|color-mix|color\s*\(|var\s*\(|#[0-9a-f]{8}|#[0-9a-f]{4}\b/i.test(val)) continue;
      const fixed = expand8DigitHex(replaceModernColorFunctions(substituteVars(val)));
      if (fixed !== val) {
        try { style.setProperty(prop, fixed, style.getPropertyPriority(prop)); } catch { /* skip */ }
      }
    }
  });

  // Step 4b: Belt-and-suspenders CSS override for anything computed via cascade.
  const fix = clonedDoc.createElement('style');
  fix.textContent = '* { letter-spacing: 0 !important; word-spacing: normal !important; }';
  clonedDoc.head.appendChild(fix);
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ExportToolbar() {
  const { invoice, loadSavedInvoice, resetInvoice } = useInvoiceStore();

  const handleDownloadPDF = useCallback(async () => {
    const el = document.getElementById('invoice-preview-root');
    if (!el) return;

    // Dynamically import html2pdf.js (browser-only)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const html2pdf = ((await import('html2pdf.js')) as any).default ?? (await import('html2pdf.js'));

    // Encode invoice data into the PDF Subject metadata for roundtrip loading
    const encodedData = btoa(encodeURIComponent(JSON.stringify(invoice)));

    const pageSize = invoice.customization?.pageSize ?? 'A4';
    // A4: 794px / 210×297mm  |  Letter: 816px / 215.9×279.4mm
    const pageWidthPx  = pageSize === 'Letter' ? 816 : 794;
    const jsPDFFormat  = pageSize === 'Letter' ? [215.9, 279.4] as [number, number] : 'a4';

    const opts = {
      margin: 0,
      filename: `Invoice-${invoice.invoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, onclone: fixClonedDoc, scrollX: 0, scrollY: 0, windowWidth: pageWidthPx },
      jsPDF: { unit: 'mm', format: jsPDFFormat, orientation: 'portrait' as const },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (html2pdf() as any)
      .set(opts)
      .from(el)
      .toPdf()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .get('pdf').then((pdf: any) => {
        pdf.setProperties({
          title: `Invoice ${invoice.invoiceNumber}`,
          subject: `INVOICE_DATA:${encodedData}`,
        });
      })
      .save();
  }, [invoice]);

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

      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        // PDF: extract invoice JSON embedded in the Subject metadata field
        reader.onload = (ev) => {
          try {
            const buffer = ev.target?.result as ArrayBuffer;
            const bytes = new Uint8Array(buffer);
            // Decode as latin1 so each byte maps 1-to-1 to a character
            let pdfText = '';
            for (let i = 0; i < bytes.length; i++) pdfText += String.fromCharCode(bytes[i]);

            const marker = 'INVOICE_DATA:';
            const markerIdx = pdfText.indexOf(marker);
            if (markerIdx === -1) throw new Error('No invoice data found in PDF');

            const dataStart = markerIdx + marker.length;
            // Capture base64 chars (strip any whitespace jsPDF may insert for line-wrapping)
            const match = pdfText.slice(dataStart).match(/^[A-Za-z0-9+/=\s]+/);
            if (!match) throw new Error('Could not read embedded data');
            const encodedData = match[0].replace(/\s/g, '');
            const data = JSON.parse(decodeURIComponent(atob(encodedData)));
            loadSavedInvoice(data);
          } catch {
            alert('No invoice data found in this PDF.\nOnly PDFs downloaded from this app can be loaded.');
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        // JSON
        reader.onload = (ev) => {
          try {
            const data = JSON.parse(ev.target?.result as string);
            loadSavedInvoice(data);
          } catch {
            alert('Invalid invoice file');
          }
        };
        reader.readAsText(file);
      }

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
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-sm font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
        title="Clear all data"
      >
        <RotateCcw size={15} />
        Clear
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".json,.pdf"
        className="hidden"
        onChange={handleLoad}
      />
    </div>
  );
}
