'use client';
import { useInvoiceStore } from '@/store/invoiceStore';
import { TEMPLATES } from './templates/index';
import { TemplateId } from '@/types/invoice';
import { Check } from 'lucide-react';

export function TemplateSelector() {
  const { invoice, setTemplate } = useInvoiceStore();
  const selected = invoice.selectedTemplate;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">Choose Template</h3>
      <div className="grid grid-cols-2 gap-3">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTemplate(t.id as TemplateId)}
            className={`relative flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all hover:shadow-md
              ${selected === t.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}
          >
            {selected === t.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                <Check size={10} className="text-white" />
              </div>
            )}
            <span className="text-2xl mb-1">{t.preview}</span>
            <p className={`text-xs font-semibold ${selected === t.id ? 'text-indigo-700' : 'text-slate-700'}`}>{t.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{t.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
