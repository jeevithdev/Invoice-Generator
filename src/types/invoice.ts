export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  subtotal: number;
}

export interface CompanyDetails {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  gstin: string;
  logo: string | null;
}

export interface ClientDetails {
  name: string;
  company: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
  gstin: string;
}

export interface TaxConfig {
  enableGST: boolean;
  gstRate: number; // total GST percentage e.g. 18
  isIGST: boolean; // if false, split into CGST + SGST
  enableDiscount: boolean;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
}

export interface InvoiceCustomization {
  accentColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: 'sm' | 'md' | 'lg';
  borderRadius: 'none' | 'sm' | 'md' | 'lg';
  invoiceTitle: string;
  dateFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'DD MMM YYYY';
  watermarkText: string;
  customHeaderNote: string;
  customFooterNote: string;
  pageSize: 'A4' | 'Letter';
  showLogo: boolean;
  showGSTBreakdown: boolean;
  showBankDetails: boolean;
  showNotes: boolean;
  showTerms: boolean;
  showWatermark: boolean;
  showCustomHeaderNote: boolean;
  showCustomFooterNote: boolean;
  columnNames: {
    description: string;
    quantity: string;
    rate: string;
    amount: string;
  };
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
}

export interface CustomTemplateConfig {
  templateName: string;
  headerBg: string;
  headerTextColor: string;
  accentColor: string;
  pageBg: string;
  tableHeaderBg: string;
  tableHeaderTextColor: string;
  tableRowStriped: boolean;
  tableBordered: boolean;
  headerLayout: 'standard' | 'centered' | 'reversed';
  showDivider: boolean;
  footerText: string;
  showSignatureArea: boolean;
  pdfBackground: string | null;
  pdfBackgroundOpacity: number;
}

export type TemplateId =
  | 'minimal'
  | 'corporate'
  | 'grid'
  | 'bold'
  | 'elegant'
  | 'dark'
  | 'retro'
  | 'pastel'
  | 'sidebar'
  | 'monochrome'
  | 'aurora'
  | 'blueprint'
  | 'sunrise'
  | 'zen'
  | 'charcoal'
  | 'oceanic'
  | 'luxe'
  | 'wave'
  | 'ledger'
  | 'terminal'
  | 'classic-blue'
  | 'executive'
  | 'soft-green'
  | 'crimson'
  | 'mono-grid'
  | 'custom';

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  company: CompanyDetails;
  client: ClientDetails;
  items: InvoiceItem[];
  taxConfig: TaxConfig;
  bankDetails: BankDetails;
  notes: string;
  terms: string;
  customization: InvoiceCustomization;
  selectedTemplate: TemplateId;
  customTemplateConfig: CustomTemplateConfig;
}

export interface TaxBreakdown {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
}
