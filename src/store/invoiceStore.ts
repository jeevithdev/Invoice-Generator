import { InvoiceData, InvoiceItem, TaxBreakdown, TemplateId, CustomTemplateConfig } from '@/types/invoice';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Simple unique id generator
const genId = () => Math.random().toString(36).substr(2, 9);

interface InvoiceStore {
  invoice: InvoiceData;
  updateCompany: (data: Partial<InvoiceData['company']>) => void;
  updateClient: (data: Partial<InvoiceData['client']>) => void;
  updateInvoiceMeta: (data: Partial<Pick<InvoiceData, 'invoiceNumber' | 'invoiceDate' | 'dueDate' | 'currency' | 'notes' | 'terms'>>) => void;
  addItem: () => void;
  updateItem: (id: string, data: Partial<InvoiceItem>) => void;
  removeItem: (id: string) => void;
  reorderItems: (items: InvoiceItem[]) => void;
  updateTaxConfig: (data: Partial<InvoiceData['taxConfig']>) => void;
  updateBankDetails: (data: Partial<InvoiceData['bankDetails']>) => void;
  updateCustomization: (data: Partial<InvoiceData['customization']>) => void;
  updateCustomTemplateConfig: (data: Partial<CustomTemplateConfig>) => void;
  setTemplate: (template: TemplateId) => void;
  computeTax: () => TaxBreakdown;
  loadSavedInvoice: (data: InvoiceData) => void;
  resetInvoice: () => void;
}

const defaultInvoice: InvoiceData = {
  invoiceNumber: 'INV-001',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  currency: 'INR',
  company: {
    name: 'Your Company Name',
    address: '123 Business Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    zip: '400001',
    country: 'India',
    phone: '+91 98765 43210',
    email: 'hello@yourcompany.com',
    website: 'www.yourcompany.com',
    gstin: '27AXXXX1234X1Z5',
    logo: null,
  },
  client: {
    name: 'Client Name',
    company: 'Client Company Ltd.',
    address: '456 Client Avenue',
    city: 'Delhi',
    state: 'Delhi',
    zip: '110001',
    country: 'India',
    phone: '+91 91234 56789',
    email: 'client@example.com',
    gstin: '07BXXXX5678Y2A6',
  },
  items: [
    {
      id: genId(),
      description: 'Web Design Services',
      quantity: 1,
      rate: 25000,
      subtotal: 25000,
    },
    {
      id: genId(),
      description: 'SEO Optimization',
      quantity: 3,
      rate: 5000,
      subtotal: 15000,
    },
  ],
  taxConfig: {
    enableGST: true,
    gstRate: 18,
    isIGST: false,
    enableDiscount: false,
    discountType: 'percentage',
    discountValue: 0,
  },
  bankDetails: {
    bankName: 'State Bank of India',
    accountName: 'Your Company Name',
    accountNumber: '1234567890',
    ifscCode: 'SBIN0001234',
    branchName: 'Fort Branch, Mumbai',
  },
  notes: 'Thank you for your business! Payment is due within 30 days.',
  terms: 'All payments should be made via bank transfer. Late payments may incur a 2% monthly charge.',
  customization: {
    accentColor: '#6366f1',
    secondaryColor: '#f1f5f9',
    fontFamily: 'inter',
    fontSize: 'md',
    borderRadius: 'md',
    invoiceTitle: 'INVOICE',
    dateFormat: 'YYYY-MM-DD',
    watermarkText: 'PAID',
    customHeaderNote: '',
    customFooterNote: '',
    pageSize: 'A4',
    showLogo: true,
    showGSTBreakdown: true,
    showBankDetails: true,
    showNotes: true,
    showTerms: true,
    showWatermark: false,
    showCustomHeaderNote: false,
    showCustomFooterNote: false,
    columnNames: {
      description: 'Description',
      quantity: 'Qty',
      rate: 'Rate',
      amount: 'Amount',
    },
  },
  selectedTemplate: 'minimal',
  customTemplateConfig: {
    templateName: 'My Custom Template',
    headerBg: '#1e293b',
    headerTextColor: '#ffffff',
    accentColor: '#6366f1',
    pageBg: '#ffffff',
    tableHeaderBg: '#f1f5f9',
    tableHeaderTextColor: '#334155',
    tableRowStriped: true,
    tableBordered: false,
    headerLayout: 'standard',
    showDivider: true,
    footerText: 'Thank you for your business!',
    showSignatureArea: false,
    pdfBackground: null,
    pdfBackgroundOpacity: 0.15,
  },
};

export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoice: defaultInvoice,

      updateCompany: (data) =>
        set((state) => ({
          invoice: { ...state.invoice, company: { ...state.invoice.company, ...data } },
        })),

      updateClient: (data) =>
        set((state) => ({
          invoice: { ...state.invoice, client: { ...state.invoice.client, ...data } },
        })),

      updateInvoiceMeta: (data) =>
        set((state) => ({ invoice: { ...state.invoice, ...data } })),

      addItem: () =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            items: [
              ...state.invoice.items,
              { id: genId(), description: '', quantity: 1, rate: 0, subtotal: 0 },
            ],
          },
        })),

      updateItem: (id, data) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            items: state.invoice.items.map((item) => {
              if (item.id !== id) return item;
              const updated = { ...item, ...data };
              updated.subtotal = updated.quantity * updated.rate;
              return updated;
            }),
          },
        })),

      removeItem: (id) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            items: state.invoice.items.filter((item) => item.id !== id),
          },
        })),

      reorderItems: (items) =>
        set((state) => ({ invoice: { ...state.invoice, items } })),

      updateTaxConfig: (data) =>
        set((state) => ({
          invoice: { ...state.invoice, taxConfig: { ...state.invoice.taxConfig, ...data } },
        })),

      updateBankDetails: (data) =>
        set((state) => ({
          invoice: { ...state.invoice, bankDetails: { ...state.invoice.bankDetails, ...data } },
        })),

      updateCustomization: (data) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            customization: { ...state.invoice.customization, ...data },
          },
        })),

      updateCustomTemplateConfig: (data) =>
        set((state) => ({
          invoice: {
            ...state.invoice,
            customTemplateConfig: { ...state.invoice.customTemplateConfig, ...data },
          },
        })),

      setTemplate: (template) =>
        set((state) => ({ invoice: { ...state.invoice, selectedTemplate: template } })),

      computeTax: () => {
        const { invoice } = get();
        const { items, taxConfig } = invoice;
        const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
        let discountAmount = 0;
        if (taxConfig.enableDiscount) {
          discountAmount =
            taxConfig.discountType === 'percentage'
              ? (subtotal * taxConfig.discountValue) / 100
              : taxConfig.discountValue;
        }
        const taxableAmount = subtotal - discountAmount;
        let cgst = 0;
        let sgst = 0;
        let igst = 0;
        if (taxConfig.enableGST) {
          if (taxConfig.isIGST) {
            igst = (taxableAmount * taxConfig.gstRate) / 100;
          } else {
            cgst = (taxableAmount * (taxConfig.gstRate / 2)) / 100;
            sgst = (taxableAmount * (taxConfig.gstRate / 2)) / 100;
          }
        }
        const totalTax = cgst + sgst + igst;
        const grandTotal = taxableAmount + totalTax;
        return { subtotal, discountAmount, taxableAmount, cgst, sgst, igst, totalTax, grandTotal };
      },

      loadSavedInvoice: (data) => set(() => ({ invoice: data })),

      resetInvoice: () => set(() => ({ invoice: defaultInvoice })),
    }),
    {
      name: 'invoice-store',
      version: 1,
      merge: (persisted, current) => {
        const p = persisted as typeof current;
        return {
          ...current,
          ...p,
          invoice: {
            ...current.invoice,
            ...(p.invoice ?? {}),
            customization: {
              ...current.invoice.customization,
              ...(p.invoice?.customization ?? {}),
              columnNames: {
                ...current.invoice.customization.columnNames,
                ...(p.invoice?.customization?.columnNames ?? {}),
              },
            },
            customTemplateConfig: {
              ...current.invoice.customTemplateConfig,
              ...(p.invoice?.customTemplateConfig ?? {}),
            },
          },
        };
      },
    }
  )
);
