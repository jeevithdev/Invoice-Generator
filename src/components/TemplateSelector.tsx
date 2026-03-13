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
        {TEMPLATES.map((t) => {
          // Determine generic styling hints based on template ID
          const isDark = ['dark', 'charcoal', 'terminal', 'oceanic'].includes(t.id);
          const bgClass = isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200';
          const textClass = isDark ? 'text-slate-200' : 'text-slate-700';

          return (
          <div key={t.id} className="relative group">
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
              className={`w-full flex justify-between flex-col items-start p-3 h-full rounded-xl border-2 text-left transition-all hover:shadow-md
                ${selected === t.id ? 'border-indigo-500 bg-indigo-50/50' : `hover:border-indigo-300 ${t.id === 'custom' ? 'border-dashed border-slate-300 bg-white' : 'border-slate-100 bg-white'}`}
              `}
            >
              <div className={`w-full h-16 rounded-md mb-3 flex items-center justify-center text-3xl shadow-sm border ${bgClass}`}>
                <span>{t.preview}</span>
              </div>
              
              <div className="flex flex-col w-full relative">
                <p className={`text-xs font-bold truncate pr-6 ${selected === t.id ? 'text-indigo-700' : 'text-slate-800'}`}>
                  {t.id === 'custom' ? (invoice.customTemplateConfig?.templateName ?? 'My Custom Template') : t.name}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">{t.description}</p>
              </div>

              {selected === t.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center shadow-sm pointer-events-none">
                  <Check size={11} className="text-white" strokeWidth={3} />
                </div>
              )}
            </button>
            {t.id === 'custom' && (
              <button
                type="button"
                title="Edit custom template"
                onClick={() => setShowBuilder((v) => !v)}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-white shadow-sm border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 text-slate-400 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
              >
                <Pencil size={12} />
              </button>
            )}
          </div>
        )})}
      </div>

      {showBuilder && <CustomTemplateBuilder onClose={() => setShowBuilder(false)} />}
    </div>
  );
}
