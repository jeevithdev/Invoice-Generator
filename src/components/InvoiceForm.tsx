'use client';
import { useInvoiceStore } from '@/store/invoiceStore';
import { Input, Textarea, Select, SectionCard } from '@/components/ui/FormControls';
import { Building2, User, FileText, UploadCloud, X, Shuffle } from 'lucide-react';
import { useRef } from 'react';
import { generateRandomGSTIN } from '@/utils/gstin';

function generateInvoiceNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const part = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `INV-${part(3)}-${part(5)}`;
}

const CURRENCIES = [
  { value: 'INR', label: '₹ INR - Indian Rupee' },
  { value: 'USD', label: '$ USD - US Dollar' },
  { value: 'EUR', label: '€ EUR - Euro' },
  { value: 'GBP', label: '£ GBP - British Pound' },
  { value: 'AUD', label: 'A$ AUD - Australian Dollar' },
  { value: 'CAD', label: 'C$ CAD - Canadian Dollar' },
  { value: 'SGD', label: 'S$ SGD - Singapore Dollar' },
  { value: 'AED', label: 'AED - UAE Dirham' },
];

export function InvoiceForm() {
  const { invoice, updateCompany, updateClient, updateInvoiceMeta } = useInvoiceStore();
  const logoRef = useRef<HTMLInputElement>(null);

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateCompany({ logo: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Invoice Meta */}
      <SectionCard title="Invoice Details" icon={<FileText size={16} className="text-indigo-500" />}>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Invoice Number</label>
              <button
                type="button"
                onClick={() => updateInvoiceMeta({ invoiceNumber: generateInvoiceNumber() })}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 px-1.5 py-0.5 rounded transition-all duration-150"
                title="Generate random invoice number"
              >
                <Shuffle size={11} />
                <span>Random</span>
              </button>
            </div>
            <input
              value={invoice.invoiceNumber}
              onChange={(e) => updateInvoiceMeta({ invoiceNumber: e.target.value })}
              placeholder="INV-001"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-150"
            />
          </div>
          <Select
            label="Currency"
            value={invoice.currency}
            onChange={(e) => updateInvoiceMeta({ currency: e.target.value })}
            options={CURRENCIES}
          />
          <Input
            label="Invoice Date"
            type="date"
            value={invoice.invoiceDate}
            onChange={(e) => updateInvoiceMeta({ invoiceDate: e.target.value })}
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Due Date</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={invoice.dueDate}
                onChange={(e) => updateInvoiceMeta({ dueDate: e.target.value })}
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-150"
              />
              {invoice.dueDate && (
                <button
                  type="button"
                  onClick={() => updateInvoiceMeta({ dueDate: '' })}
                  className="text-xs text-slate-400 hover:text-red-500 transition-colors px-2 py-2 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-200"
                  title="Remove due date"
                >
                  ✕
                </button>
              )}
            </div>
            {!invoice.dueDate && (
              <p className="text-xs text-slate-400 italic">No due date set — will be hidden on invoice</p>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Company Details */}
      <SectionCard title="Your Business" icon={<Building2 size={16} className="text-indigo-500" />}>
        {/* Logo upload */}
        <div className="mt-3 mb-4">
          {invoice.company.logo ? (
            <div className="flex items-center gap-3">
              <img
                src={invoice.company.logo}
                alt="Logo"
                className="h-14 w-14 object-contain rounded-lg border border-slate-200 bg-slate-50"
              />
              <div>
                <p className="text-sm font-medium text-slate-700">Logo uploaded</p>
                <button
                  type="button"
                  onClick={() => updateCompany({ logo: null })}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 mt-1"
                >
                  <X size={12} /> Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => logoRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            >
              <UploadCloud size={16} />
              Upload Company Logo
            </button>
          )}
          <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        </div>
        <div className="grid grid-cols-1 gap-3">
          <Input
            label="Company Name"
            value={invoice.company.name}
            onChange={(e) => updateCompany({ name: e.target.value })}
          />
          <Input
            label="Address"
            value={invoice.company.address}
            onChange={(e) => updateCompany({ address: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              value={invoice.company.city}
              onChange={(e) => updateCompany({ city: e.target.value })}
            />
            <Input
              label="State"
              value={invoice.company.state}
              onChange={(e) => updateCompany({ state: e.target.value })}
            />
            <Input
              label="ZIP / Pincode"
              value={invoice.company.zip}
              onChange={(e) => updateCompany({ zip: e.target.value })}
            />
            <Input
              label="Country"
              value={invoice.company.country}
              onChange={(e) => updateCompany({ country: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone"
              value={invoice.company.phone}
              onChange={(e) => updateCompany({ phone: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={invoice.company.email}
              onChange={(e) => updateCompany({ email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Website"
              value={invoice.company.website}
              onChange={(e) => updateCompany({ website: e.target.value })}
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">GSTIN</label>
                <button
                  type="button"
                  onClick={() => updateCompany({ gstin: generateRandomGSTIN() })}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 px-1.5 py-0.5 rounded transition-all duration-150"
                  title="Generate random GSTIN"
                >
                  <Shuffle size={11} />
                  <span>Random</span>
                </button>
              </div>
              <input
                value={invoice.company.gstin}
                onChange={(e) => updateCompany({ gstin: e.target.value.toUpperCase() })}
                placeholder="22AAAAA0000A1Z5"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-150"
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Client Details */}
      <SectionCard title="Bill To (Client)" icon={<User size={16} className="text-indigo-500" />}>
        <div className="grid grid-cols-1 gap-3 mt-3">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Client Name"
              value={invoice.client.name}
              onChange={(e) => updateClient({ name: e.target.value })}
            />
            <Input
              label="Company Name"
              value={invoice.client.company}
              onChange={(e) => updateClient({ company: e.target.value })}
            />
          </div>
          <Input
            label="Address"
            value={invoice.client.address}
            onChange={(e) => updateClient({ address: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              value={invoice.client.city}
              onChange={(e) => updateClient({ city: e.target.value })}
            />
            <Input
              label="State"
              value={invoice.client.state}
              onChange={(e) => updateClient({ state: e.target.value })}
            />
            <Input
              label="ZIP / Pincode"
              value={invoice.client.zip}
              onChange={(e) => updateClient({ zip: e.target.value })}
            />
            <Input
              label="Country"
              value={invoice.client.country}
              onChange={(e) => updateClient({ country: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone"
              value={invoice.client.phone}
              onChange={(e) => updateClient({ phone: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={invoice.client.email}
              onChange={(e) => updateClient({ email: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Client GSTIN</label>
              <button
                type="button"
                onClick={() => updateClient({ gstin: generateRandomGSTIN() })}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 px-1.5 py-0.5 rounded transition-all duration-150"
                title="Generate random client GSTIN"
              >
                <Shuffle size={11} />
                <span>Random</span>
              </button>
            </div>
            <input
              value={invoice.client.gstin}
              onChange={(e) => updateClient({ gstin: e.target.value.toUpperCase() })}
              placeholder="22AAAAA0000A1Z5"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-150"
            />
          </div>
        </div>
      </SectionCard>

      {/* Notes & Terms */}
      <SectionCard title="Notes & Terms" icon={<FileText size={16} className="text-indigo-500" />} defaultOpen={false}>
        <div className="flex flex-col gap-3 mt-3">
          <Textarea
            label="Notes"
            rows={3}
            value={invoice.notes}
            onChange={(e) => updateInvoiceMeta({ notes: e.target.value })}
            placeholder="Thank you for your business..."
          />
          <Textarea
            label="Terms & Conditions"
            rows={3}
            value={invoice.terms}
            onChange={(e) => updateInvoiceMeta({ terms: e.target.value })}
            placeholder="Payment terms, late fees..."
          />
        </div>
      </SectionCard>
    </div>
  );
}
