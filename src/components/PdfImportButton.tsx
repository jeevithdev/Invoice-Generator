'use client';
import { useRef, useState } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { parsePdfInvoice, ParsedInvoiceResult } from '@/utils/parsePdfInvoice';
import { InvoiceData } from '@/types/invoice';
import { FileUp, X, Check, AlertTriangle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

export function PdfImportButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { invoice, loadSavedInvoice } = useInvoiceStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ParsedInvoiceResult | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const parsed = await parsePdfInvoice(file);
      setResult(parsed);
    } catch {
      setError('Failed to read PDF. Make sure it is a text-based (not scanned) PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!result) return;
    // Deep merge parsed fields into existing invoice, keeping defaults for anything missing
    const merged: InvoiceData = {
      ...invoice,
      invoiceNumber: result.partial.invoiceNumber || invoice.invoiceNumber,
      invoiceDate: result.partial.invoiceDate || invoice.invoiceDate,
      dueDate: result.partial.dueDate || invoice.dueDate,
      currency: result.partial.currency || invoice.currency,
      notes: result.partial.notes || invoice.notes,
      terms: result.partial.terms || invoice.terms,
      company: { ...invoice.company, ...result.partial.company },
      client: { ...invoice.client, ...result.partial.client },
      items: result.partial.items?.length ? result.partial.items : invoice.items,
      ...(result.partial.taxConfig ? { taxConfig: { ...invoice.taxConfig, ...result.partial.taxConfig } } : {}),
      bankDetails: {
        ...invoice.bankDetails,
        ...(result.partial.bankDetails?.bankName ? result.partial.bankDetails : {}),
      },
    };
    loadSavedInvoice(merged);
    setResult(null);
  };

  const Field = ({ label, value }: { label: string; value: string }) =>
    value ? (
      <div className="flex gap-2 text-xs">
        <span className="text-slate-400 w-28 shrink-0">{label}</span>
        <span className="text-slate-700 font-medium truncate">{value}</span>
      </div>
    ) : null;

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm disabled:opacity-50"
        title="Import an existing PDF invoice to pre-fill the form"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <FileUp size={15} className="text-slate-500" />}
        <span className="hidden sm:inline">Import PDF</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFile}
      />

      {/* Error toast */}
      {error && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl shadow-lg">
          <AlertTriangle size={14} />
          {error}
          <button type="button" onClick={() => setError(null)}><X size={13} /></button>
        </div>
      )}

      {/* Review panel */}
      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-800">PDF Import Preview</h2>
                <p className="text-xs text-slate-400 mt-0.5">Review extracted data before applying</p>
              </div>
              <button type="button" onClick={() => setResult(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={15} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <AlertTriangle size={13} className="text-amber-500 mt-0.5 shrink-0" />
                  <div className="text-xs text-amber-700 space-y-0.5">
                    {result.warnings.map((w, i) => <p key={i}>{w}</p>)}
                    <p className="mt-1 text-amber-500">Missing fields will keep their current values.</p>
                  </div>
                </div>
              )}

              {/* Invoice meta */}
              <section>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Invoice</p>
                <div className="space-y-1 bg-slate-50 rounded-xl p-3">
                  <Field label="Invoice #" value={result.partial.invoiceNumber || ''} />
                  <Field label="Date" value={result.partial.invoiceDate || ''} />
                  <Field label="Due Date" value={result.partial.dueDate || ''} />
                  <Field label="Currency" value={result.partial.currency || ''} />
                </div>
              </section>

              {/* Company */}
              <section>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Your Company</p>
                <div className="space-y-1 bg-slate-50 rounded-xl p-3">
                  <Field label="Name" value={result.partial.company?.name || ''} />
                  <Field label="Address" value={result.partial.company?.address || ''} />
                  <Field label="City/State" value={[result.partial.company?.city, result.partial.company?.state].filter(Boolean).join(', ')} />
                  <Field label="Email" value={result.partial.company?.email || ''} />
                  <Field label="Phone" value={result.partial.company?.phone || ''} />
                  <Field label="GSTIN" value={result.partial.company?.gstin || ''} />
                </div>
              </section>

              {/* Client */}
              <section>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Client</p>
                <div className="space-y-1 bg-slate-50 rounded-xl p-3">
                  <Field label="Name" value={result.partial.client?.name || ''} />
                  <Field label="Company" value={result.partial.client?.company || ''} />
                  <Field label="City/State" value={[result.partial.client?.city, result.partial.client?.state].filter(Boolean).join(', ')} />
                  <Field label="Email" value={result.partial.client?.email || ''} />
                  <Field label="GSTIN" value={result.partial.client?.gstin || ''} />
                </div>
              </section>

              {/* Items */}
              {result.partial.items?.length ? (
                <section>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Line Items ({result.partial.items.length})
                  </p>
                  <div className="space-y-1.5">
                    {result.partial.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs bg-slate-50 rounded-xl px-3 py-2">
                        <span className="text-slate-700 flex-1 truncate">{item.description}</span>
                        <span className="text-slate-500 ml-2 shrink-0">
                          {item.quantity} × {item.rate} = <strong className="text-slate-700">{item.subtotal}</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <div className="text-xs text-slate-400 bg-slate-50 rounded-xl p-3">
                  No line items detected — existing items will be kept.
                </div>
              )}

              {/* Raw text toggle */}
              <button
                type="button"
                onClick={() => setShowRaw(v => !v)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600"
              >
                {showRaw ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                {showRaw ? 'Hide' : 'Show'} raw extracted text
              </button>
              {showRaw && (
                <pre className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3 whitespace-pre-wrap max-h-48 overflow-y-auto font-mono">
                  {result.rawText}
                </pre>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 px-5 py-4 border-t border-slate-100 bg-slate-50">
              <button
                type="button"
                onClick={() => setResult(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 font-medium hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check size={14} />
                Apply to Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
