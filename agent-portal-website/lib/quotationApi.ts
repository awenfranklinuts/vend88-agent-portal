/**
 * Quotation Management API client.
 *
 * Talks to the portal backend's /portal/quotations and /portal/quotation-catalogue
 * endpoints (vend88-dashboard-app/backend/src/routes/quotation.js), which store
 * data in the `quotation`, `quotation_catalogue` and `counter` MongoDB collections.
 * The backend uses snake_case; this file maps to the camelCase types in lib/quotations.ts.
 */

import axios from "axios";
import { API_CONFIG, getApiUrl } from "@/config/api";
import type {
  BillingPeriod,
  CatalogueItem,
  LineItemType,
  Quotation,
  QuotationInput,
  QuotationStatus,
} from "@/lib/quotations";

/* ─── Backend shapes ─── */

interface ApiLineItem {
  _id?: string;
  catalogue_item_id?: string;
  type: LineItemType;
  billing: BillingPeriod;
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
}

interface ApiQuotation {
  _id: string;
  number: string;
  version: number;
  status: QuotationStatus;
  customer: {
    contact_name?: string;
    company_name?: string;
    email?: string;
    mobile?: string;
    abn?: string;
    address?: string;
    state?: string;
  };
  inquiry_id?: string;
  items: ApiLineItem[];
  discount_percent: number;
  prices_include_gst: boolean;
  valid_until: string;
  notes?: string;
  terms?: string;
  created_by?: string;
  owner_user_id?: string | null;
  attributed_to_name?: string;
  team_id?: string | null;
  team_name?: string;
  created_at: string;
  updated_at: string;
  sent_at?: string;
  accepted_at?: string;
  declined_at?: string;
  superseded_by_id?: string;
}

interface ApiCatalogueItem {
  _id: string;
  name: string;
  description?: string;
  sku?: string;
  type: LineItemType;
  billing: BillingPeriod;
  unit_price: number;
  active: boolean;
}

/* ─── Mapping ─── */

const fromApiQuotation = (q: ApiQuotation): Quotation => ({
  id: q._id,
  number: q.number,
  version: q.version,
  status: q.status,
  customer: {
    contactName: q.customer?.contact_name || "",
    companyName: q.customer?.company_name || "",
    email: q.customer?.email || "",
    mobile: q.customer?.mobile || "",
    abn: q.customer?.abn || "",
    address: q.customer?.address || "",
    state: q.customer?.state || "",
  },
  inquiryId: q.inquiry_id,
  items: (q.items || []).map((item, index) => ({
    id: item._id || `line-${index}`,
    catalogueItemId: item.catalogue_item_id,
    type: item.type,
    billing: item.billing,
    name: item.name,
    description: item.description,
    quantity: item.quantity,
    unitPrice: item.unit_price,
    discountPercent: item.discount_percent || 0,
  })),
  discountPercent: q.discount_percent || 0,
  pricesIncludeGst: !!q.prices_include_gst,
  validUntil: q.valid_until,
  notes: q.notes || "",
  terms: q.terms || "",
  createdBy: q.created_by || "",
  ownerUserId: q.owner_user_id ?? null,
  attributedToName: q.attributed_to_name || "",
  teamId: q.team_id ?? null,
  teamName: q.team_name || "",
  createdAt: q.created_at,
  updatedAt: q.updated_at,
  sentAt: q.sent_at,
  acceptedAt: q.accepted_at,
  declinedAt: q.declined_at,
  supersededById: q.superseded_by_id,
});

const toApiInput = (input: QuotationInput) => ({
  customer: {
    contact_name: input.customer.contactName,
    company_name: input.customer.companyName,
    email: input.customer.email,
    mobile: input.customer.mobile,
    abn: input.customer.abn,
    address: input.customer.address,
    state: input.customer.state,
  },
  inquiry_id: input.inquiryId,
  items: input.items.map(item => ({
    catalogue_item_id: item.catalogueItemId,
    type: item.type,
    billing: item.billing,
    name: item.name,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    discount_percent: item.discountPercent,
  })),
  discount_percent: input.discountPercent,
  prices_include_gst: input.pricesIncludeGst,
  valid_until: input.validUntil,
  notes: input.notes,
  terms: input.terms,
});

const fromApiCatalogueItem = (item: ApiCatalogueItem): CatalogueItem => ({
  id: item._id,
  name: item.name,
  description: item.description || undefined,
  sku: item.sku || undefined,
  type: item.type,
  billing: item.billing,
  unitPrice: item.unit_price,
  active: item.active,
});

/* ─── Transport ─── */

const readToken = () => {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

/** POSTs with the portal token and surfaces the backend's error message */
async function post<T>(endpoint: string, body: Record<string, unknown> = {}): Promise<T> {
  try {
    const response = await axios.post(getApiUrl(endpoint), { ...body, token: readToken() });
    return response.data as T;
  } catch (error) {
    const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
    throw new Error(message || "Unable to reach the server. Please try again.");
  }
}

const E = API_CONFIG.ENDPOINTS;

/* ─── Quotations ─── */

export const listQuotations = async (params: {
  search?: string;
  status?: QuotationStatus | "";
  includeSuperseded?: boolean;
  page?: number;
  limit?: number;
}): Promise<{ quotations: Quotation[]; total: number }> => {
  const data = await post<{ quotations: ApiQuotation[]; total: number }>(E.QUOTATIONS_LIST, {
    search: params.search || undefined,
    status: params.status || undefined,
    include_superseded: params.includeSuperseded,
    page: params.page,
    limit: params.limit,
  });
  return { quotations: data.quotations.map(fromApiQuotation), total: data.total };
};

export const getQuotation = async (id: string): Promise<{ quotation: Quotation; versions: Quotation[] }> => {
  const data = await post<{ quotation: ApiQuotation; versions: ApiQuotation[] }>(E.QUOTATIONS_DETAIL, { id });
  return { quotation: fromApiQuotation(data.quotation), versions: data.versions.map(fromApiQuotation) };
};

/** The backend records the creator from the token */
export const createQuotation = async (input: QuotationInput): Promise<Quotation> =>
  fromApiQuotation((await post<{ quotation: ApiQuotation }>(E.QUOTATIONS_CREATE, toApiInput(input))).quotation);

export const updateQuotation = async (id: string, input: QuotationInput): Promise<Quotation> =>
  fromApiQuotation((await post<{ quotation: ApiQuotation }>(E.QUOTATIONS_UPDATE, { id, ...toApiInput(input) })).quotation);

export const setQuotationStatus = async (id: string, status: QuotationStatus): Promise<Quotation> =>
  fromApiQuotation((await post<{ quotation: ApiQuotation }>(E.QUOTATIONS_STATUS, { id, status })).quotation);

/** Creates an editable draft as the next version and marks the original as superseded */
export const reviseQuotation = async (id: string): Promise<Quotation> =>
  fromApiQuotation((await post<{ quotation: ApiQuotation }>(E.QUOTATIONS_REVISE, { id })).quotation);

/** Creates a brand new quote (new number) with the same content */
export const duplicateQuotation = async (id: string): Promise<Quotation> =>
  fromApiQuotation((await post<{ quotation: ApiQuotation }>(E.QUOTATIONS_DUPLICATE, { id })).quotation);

export const deleteQuotation = async (id: string): Promise<void> => {
  await post(E.QUOTATIONS_DELETE, { id });
};

/* ─── Price list ─── */

export const listCatalogue = async (params?: { includeInactive?: boolean }): Promise<CatalogueItem[]> => {
  const data = await post<{ items: ApiCatalogueItem[] }>(E.QUOTATION_CATALOGUE_LIST, { include_inactive: params?.includeInactive });
  return data.items.map(fromApiCatalogueItem);
};

export const saveCatalogueItem = async (item: Omit<CatalogueItem, "id"> & { id?: string }): Promise<CatalogueItem> => {
  const data = await post<{ item: ApiCatalogueItem }>(E.QUOTATION_CATALOGUE_SAVE, {
    id: item.id,
    name: item.name,
    description: item.description,
    sku: item.sku,
    type: item.type,
    billing: item.billing,
    unit_price: item.unitPrice,
    active: item.active,
  });
  return fromApiCatalogueItem(data.item);
};
