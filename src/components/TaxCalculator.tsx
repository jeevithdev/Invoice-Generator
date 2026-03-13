'use client';
import { useInvoiceStore } from '@/store/invoiceStore';
import { Input, Select, Toggle, SectionCard } from '@/components/ui/FormControls';
import { formatCurrency } from '@/utils/format';
import { Calculator, Landmark } from 'lucide-react';
import { useState, useEffect } from 'react';

const GST_RATES = [
  { value: '0', label: '0% (Exempt)' },
  { value: '5', label: '5% GST' },
  { value: '12', label: '12% GST' },
  { value: '18', label: '18% GST' },
  { value: '28', label: '28% GST' },
];

export function TaxCalculator() {
  const { invoice, updateTaxConfig, computeTax } = useInvoiceStore();
  const { taxConfig, currency } = invoice;
  const tax = computeTax();

  const [discountStr, setDiscountStr] = useState(taxConfig.discountValue.toString());

  useEffect(() => {
    const val = parseFloat(discountStr);
    const num = isNaN(val) ? 0 : val;
    if (num !== taxConfig.discountValue) {
      setDiscountStr(taxConfig.discountValue.toString());
    }
  }, [taxConfig.discountValue, discountStr]);

  return (
    <div className="flex flex-col gap-4">
      {/* Tax Settings */}
      <SectionCard title="Tax Settings" icon={<Calculator size={16} className="text-indigo-500" />}>
        <div className="flex flex-col gap-1 mt-1">
          <Toggle
            label="Enable GST"
            description="Apply Goods & Services Tax to invoice"
            checked={taxConfig.enableGST}
            onChange={(v) => updateTaxConfig({ enableGST: v })}
          />
          {taxConfig.enableGST && (
            <div className="mt-2 flex flex-col gap-3">
              <Select
                label="GST Rate"
                value={taxConfig.gstRate.toString()}
                onChange={(e) => updateTaxConfig({ gstRate: parseFloat(e.target.value) })}
                options={GST_RATES}
              />
              <Toggle
                label="Apply as IGST"
                description="Interstate supply — single IGST instead of CGST + SGST"
                checked={taxConfig.isIGST}
                onChange={(v) => updateTaxConfig({ isIGST: v })}
              />
            </div>
          )}
          <Toggle
            label="Enable Discount"
            description="Apply a discount before tax"
            checked={taxConfig.enableDiscount}
            onChange={(v) => updateTaxConfig({ enableDiscount: v })}
          />
          {taxConfig.enableDiscount && (
            <div className="mt-2 grid grid-cols-2 gap-3">
              <Select
                label="Discount Type"
                value={taxConfig.discountType}
                onChange={(e) => updateTaxConfig({ discountType: e.target.value as 'percentage' | 'fixed' })}
                options={[
                  { value: 'percentage', label: 'Percentage (%)' },
                  { value: 'fixed', label: 'Fixed Amount' },
                ]}
              />
              <Input
                label={taxConfig.discountType === 'percentage' ? 'Discount %' : 'Discount Amount'}
                type="number"
                min={0}
                step="any"
                max={taxConfig.discountType === 'percentage' ? 100 : undefined}
                value={discountStr}
                onChange={(e) => {
                  setDiscountStr(e.target.value);
                  const raw = parseFloat(e.target.value);
                  let value = isNaN(raw) ? 0 : raw;
                  if (taxConfig.discountType === 'percentage') {
                    value = Math.min(100, Math.max(0, value));
                  } else {
                    value = Math.max(0, value);
                  }
                  updateTaxConfig({ discountValue: value });
                }}
              />
            </div>
          )}
        </div>
      </SectionCard>

      {/* Tax Breakdown Preview */}
      <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl border border-indigo-100 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-indigo-700 mb-4 flex items-center gap-2">
          <span className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
            <Calculator size={14} />
          </span>
          Tax Breakdown Preview
        </h3>
        <div className="flex flex-col gap-2">
          <TaxRow label="Subtotal" value={formatCurrency(tax.subtotal, currency)} />
          {taxConfig.enableDiscount && tax.discountAmount > 0 && (
            <>
              <TaxRow label={`Discount (${taxConfig.discountType === 'percentage' ? taxConfig.discountValue + '%' : 'fixed'})`} value={`– ${formatCurrency(tax.discountAmount, currency)}`} muted />
              <div className="border-t border-indigo-100 pt-1" />
              <TaxRow label="Taxable Amount" value={formatCurrency(tax.taxableAmount, currency)} />
            </>
          )}
          {taxConfig.enableGST && (
            <>
              <div className="border-t border-indigo-100 pt-1" />
              {taxConfig.isIGST ? (
                <TaxRow label={`IGST (${taxConfig.gstRate}%)`} value={formatCurrency(tax.igst, currency)} muted />
              ) : (
                <>
                  <TaxRow label={`CGST (${taxConfig.gstRate / 2}%)`} value={formatCurrency(tax.cgst, currency)} muted />
                  <TaxRow label={`SGST (${taxConfig.gstRate / 2}%)`} value={formatCurrency(tax.sgst, currency)} muted />
                </>
              )}
            </>
          )}
          <div className="border-t border-indigo-200 pt-2 mt-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 text-base">Grand Total</span>
              <span className="font-bold text-indigo-700 text-xl">
                {formatCurrency(tax.grandTotal, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <BankDetailsForm />
    </div>
  );
}

function TaxRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className={muted ? 'text-slate-500' : 'text-slate-700'}>{label}</span>
      <span className={muted ? 'text-slate-500' : 'font-medium text-slate-800'}>{value}</span>
    </div>
  );
}

function BankDetailsForm() {
  const { invoice, updateBankDetails, updateCustomization } = useInvoiceStore();
  const { bankDetails, customization } = invoice;

  return (
    <SectionCard title="Bank Details" icon={<Landmark size={16} className="text-indigo-500" />} defaultOpen={false}>
      <div className="flex flex-col gap-3 mt-3">
        <Toggle
          label="Show Bank Details"
          checked={customization.showBankDetails}
          onChange={(v) => updateCustomization({ showBankDetails: v })}
        />
        {customization.showBankDetails && (
          <>
            <Input
              label="Bank Name"
              value={bankDetails.bankName}
              onChange={(e) => updateBankDetails({ bankName: e.target.value })}
            />
            <Input
              label="Account Name"
              value={bankDetails.accountName}
              onChange={(e) => updateBankDetails({ accountName: e.target.value })}
            />
            <Input
              label="Account Number"
              value={bankDetails.accountNumber}
              onChange={(e) => updateBankDetails({ accountNumber: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="IFSC Code"
                value={bankDetails.ifscCode}
                onChange={(e) => updateBankDetails({ ifscCode: e.target.value })}
              />
              <Input
                label="Branch Name"
                value={bankDetails.branchName}
                onChange={(e) => updateBankDetails({ branchName: e.target.value })}
              />
            </div>
          </>
        )}
      </div>
    </SectionCard>
  );
}
