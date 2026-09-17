/**
 * Quotation domain types and pricing maths.
 *
 * All prices are stored EXCLUDING GST. `pricesIncludeGst` on a quotation only
 * changes how prices are entered and displayed, never what is stored.
 */

export const GST_RATE = 0.1;

export type QuotationStatus = "draft" | "sent" | "accepted" | "declined" | "expired" | "superseded";

export const QUOTATION_STATUSES: QuotationStatus[] = ["draft", "sent", "accepted", "declined", "expired", "superseded"];

export type LineItemType = "hardware" | "subscription" | "service";

/** How often a line is charged. Hardware and services are always one-off. */
export type BillingPeriod = "once" | "monthly" | "yearly";

export interface CatalogueItem {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  type: LineItemType;
  billing: BillingPeriod;
  /** Excluding GST */
  unitPrice: number;
  active: boolean;
}

export interface QuotationLineItem {
  id: string;
  catalogueItemId?: string;
  type: LineItemType;
  billing: BillingPeriod;
  name: string;
  description?: string;
  quantity: number;
  /** Excluding GST, snapshotted when the item is added so later price-list changes don't alter the quote */
  unitPrice: number;
  discountPercent: number;
}

export interface QuotationCustomer {
  contactName: string;
  companyName: string;
  email: string;
  mobile: string;
  abn: string;
  address: string;
  state: string;
}

export interface Quotation {
  id: string;
  /** Shared by every version of the same quote, e.g. V88-QUO-0001 */
  number: string;
  version: number;
  status: QuotationStatus;
  customer: QuotationCustomer;
  inquiryId?: string;
  items: QuotationLineItem[];
  /** Applied to every line after line discounts */
  discountPercent: number;
  pricesIncludeGst: boolean;
  /** YYYY-MM-DD */
  validUntil: string;
  notes: string;
  terms: string;
  createdBy: string;
  /** Attribution: the portal user credited with the deal, and their team */
  ownerUserId?: string | null;
  attributedToName?: string;
  teamId?: string | null;
  teamName?: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  acceptedAt?: string;
  declinedAt?: string;
  /** Id of the version that replaced this one */
  supersededById?: string;
}

export type QuotationInput = Pick<
  Quotation,
  "customer" | "inquiryId" | "items" | "discountPercent" | "pricesIncludeGst" | "validUntil" | "notes" | "terms"
>;

export const LINE_ITEM_TYPES: { id: LineItemType; label: { en: string; zh: string } }[] = [
  { id: "hardware", label: { en: "Hardware", zh: "硬件" } },
  { id: "subscription", label: { en: "Subscription", zh: "订阅" } },
  { id: "service", label: { en: "Service", zh: "服务" } },
];

export const BILLING_LABELS: Record<BillingPeriod, { en: string; zh: string }> = {
  once: { en: "One-off", zh: "一次性" },
  monthly: { en: "Monthly", zh: "每月" },
  yearly: { en: "Yearly", zh: "每年" },
};

export const STATUS_LABELS: Record<QuotationStatus, { en: string; zh: string }> = {
  draft: { en: "Draft", zh: "草稿" },
  sent: { en: "Sent", zh: "已发送" },
  accepted: { en: "Accepted", zh: "已接受" },
  declined: { en: "Declined", zh: "已拒绝" },
  expired: { en: "Expired", zh: "已过期" },
  superseded: { en: "Superseded", zh: "已被替代" },
};

export const AU_STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

export const EMPTY_CUSTOMER: QuotationCustomer = {
  contactName: "",
  companyName: "",
  email: "",
  mobile: "",
  abn: "",
  address: "",
  state: "",
};

/* ─── Money ─── */

const roundCents = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

const audFormatter = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });
export const formatMoney = (value: number) => audFormatter.format(roundCents(value));

export const toDisplayPrice = (exGst: number, includeGst: boolean) =>
  includeGst ? exGst * (1 + GST_RATE) : exGst;

export const fromDisplayPrice = (display: number, includeGst: boolean) =>
  includeGst ? display / (1 + GST_RATE) : display;

/* ─── Totals ─── */

const clampPercent = (value: number) => Math.min(100, Math.max(0, value || 0));

/** Line amount excluding GST, after the line discount but before the quote discount */
export const lineSubtotal = (item: QuotationLineItem) =>
  (item.quantity || 0) * (item.unitPrice || 0) * (1 - clampPercent(item.discountPercent) / 100);

export interface BillingTotals {
  /** After line discounts, before quote discount, excluding GST */
  subtotal: number;
  quoteDiscount: number;
  exGst: number;
  gst: number;
  total: number;
}

export type QuotationTotals = Record<BillingPeriod, BillingTotals>;

export const calculateTotals = (quote: Pick<Quotation, "items" | "discountPercent">): QuotationTotals => {
  const discountRate = clampPercent(quote.discountPercent) / 100;
  const forBilling = (billing: BillingPeriod): BillingTotals => {
    const subtotal = quote.items.filter(i => i.billing === billing).reduce((sum, i) => sum + lineSubtotal(i), 0);
    const exGst = roundCents(subtotal * (1 - discountRate));
    const gst = roundCents(exGst * GST_RATE);
    return {
      subtotal: roundCents(subtotal),
      quoteDiscount: roundCents(subtotal - exGst),
      exGst,
      gst,
      total: roundCents(exGst + gst),
    };
  };
  return { once: forBilling("once"), monthly: forBilling("monthly"), yearly: forBilling("yearly") };
};

/* ─── Helpers ─── */

export const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

// Calendar dates are Sydney dates, matching how the backend decides when a quote expires
const dateInSydney = (date: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Australia/Sydney" }).format(date);

export const todayIso = () => dateInSydney(new Date());

export const addDaysIso = (days: number) => dateInSydney(new Date(Date.now() + days * 24 * 60 * 60 * 1000));

export const displayNumber = (quote: Pick<Quotation, "number" | "version">) =>
  quote.version > 1 ? `${quote.number} (v${quote.version})` : quote.number;

export const customerDisplayName = (customer: QuotationCustomer) =>
  customer.companyName || customer.contactName || "—";
