'use client';
import { useState } from 'react';
import { useInvoiceStore } from '@/store/invoiceStore';
import { TEMPLATES } from './templates/index';
import { TemplateId } from '@/types/invoice';
import { Check, Pencil } from 'lucide-react';
import { CustomTemplateBuilder } from './CustomTemplateBuilder';

export function TemplateSelector() {
  const { invoice, setTemplate } = useInvoiceStore();
  const selected = invoice.selectedTemplate;
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h3 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">Choose Template</h3>
      <div className="grid grid-cols-2 gap-3">
        {TEMPLATES.map((t) => (
          <div key={t.id} className="relative">
            <button
              type="button"
              onClick={() => {
                if (t.id === 'custom') {
                  setTemplate('custom');
                  setShowBuilder((v) => !v);
                } else {
                  setTemplate(t.id as TemplateId);
                  setShowBuilder(false);
                }
              }}
              className={`w-full flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all hover:shadow-md
                ${selected === t.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}
                ${t.id === 'custom' ? 'border-dashed' : ''}`}
            >
              {selected === t.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center z-10">
                  <Check size={10} className="text-white" />
                </div>
              )}
              <span className="text-2xl mb-1">{t.preview}</span>
              <p className={`text-xs font-semibold ${selected === t.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                {t.id === 'custom' ? (invoice.customTemplateConfig?.templateName ?? 'My Custom Template') : t.name}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{t.description}</p>
            </button>
            {t.id === 'custom' && (
              <button
                type="button"
                title="Edit custom template"
                onClick={() => setShowBuilder((v) => !v)}
                className="absolute bottom-2 right-2 p-1 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-600 transition-colors"
              >
                <Pencil size={11} />
              </button>
            )}
          </div>
        ))}
      </div>

      {showBuilder && <CustomTemplateBuilder onClose={() => setShowBuilder(false)} />}
    </div>
  );
}
