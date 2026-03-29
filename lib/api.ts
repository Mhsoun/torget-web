import type {
  AdminAttributeDefinitionResponse,
  AdminAttributeDefinitionWriteRequest,
  AdminItemAttributesUpdateRequest,
  AdminItemAttributeValueResponse,
  BusinessConfigResponse,
  BusinessConfigWriteRequest,
  CategoryResponse,
  DashboardStatsResponse,
  InquiryCreateRequest,
  InquiryResponse,
  ItemBrowseSort,
  ItemDetailResponse,
  ItemImageResponse,
  ItemResponse,
  ItemStatus,
  ItemWriteRequest,
  ItemStatusPatchRequest,
  LeadResponse,
  LoginRequest,
  LoginResponse,
  OrderResponse,
  PublicAttributeFilterResponse,
  StatusPatchRequest,
} from "@/types/torget";

export type ItemImageWriteRequest = {
  url: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
};

const resolvedBaseUrl =
  process.env.NEXT_PUBLIC_TORGET_API_URL ??
  process.env.TORGET_API_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:5000" : "");

const BASE_URL = resolvedBaseUrl.replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const { token, ...rest } = options ?? {};
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(rest.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...rest, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, `API error ${res.status}: ${text}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

// --- Public ---

export function getItems(params?: {
  q?: string;
  categoryId?: string;
  status?: ItemStatus;
  sort?: ItemBrowseSort;
  attributeFilters?: Record<string, string>;
}): Promise<ItemResponse[]> {
  const query = new URLSearchParams();
  if (params?.q) query.set("q", params.q);
  if (params?.categoryId) query.set("categoryId", params.categoryId);
  if (params?.status !== undefined) query.set("status", String(params.status));
  if (params?.sort) query.set("sort", params.sort);
  if (params?.attributeFilters) {
    for (const [slug, value] of Object.entries(params.attributeFilters)) {
      if (value) query.set(`attr_${slug}`, value);
    }
  }
  const qs = query.toString();
  return apiFetch<ItemResponse[]>(`/api/items${qs ? `?${qs}` : ""}`);
}

export function getItem(id: string): Promise<ItemDetailResponse> {
  return apiFetch<ItemDetailResponse>(`/api/items/${id}`);
}

export function getBusinessConfig(): Promise<BusinessConfigResponse> {
  return apiFetch<BusinessConfigResponse>("/api/config");
}

export function getAdminBusinessConfig(token: string): Promise<BusinessConfigResponse> {
  return apiFetch<BusinessConfigResponse>("/api/admin/settings/business", { token });
}

export function upsertBusinessConfig(
  body: BusinessConfigWriteRequest,
  token: string,
): Promise<BusinessConfigResponse> {
  return apiFetch<BusinessConfigResponse>("/api/admin/settings/business", {
    method: "PUT",
    body: JSON.stringify(body),
    token,
  });
}

export function getCategories(): Promise<CategoryResponse[]> {
  return apiFetch<CategoryResponse[]>("/api/categories");
}

export function getCategoryBySlug(slug: string): Promise<CategoryResponse> {
  return apiFetch<CategoryResponse>(`/api/categories/${encodeURIComponent(slug)}`);
}

export function getPublicBrowseFilters(): Promise<PublicAttributeFilterResponse[]> {
  return apiFetch<PublicAttributeFilterResponse[]>("/api/browse/filters");
}

// --- Auth ---

export function login(body: LoginRequest): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// --- Admin ---

export function getDashboardStats(token: string): Promise<DashboardStatsResponse> {
  return apiFetch<DashboardStatsResponse>("/api/admin/dashboard", { token });
}

export function getAdminAttributes(token: string): Promise<AdminAttributeDefinitionResponse[]> {
  return apiFetch<AdminAttributeDefinitionResponse[]>("/api/admin/attributes", { token });
}

export function getAdminAttribute(id: string, token: string): Promise<AdminAttributeDefinitionResponse> {
  return apiFetch<AdminAttributeDefinitionResponse>(`/api/admin/attributes/${id}`, { token });
}

export function createAdminAttribute(
  body: AdminAttributeDefinitionWriteRequest,
  token: string
): Promise<AdminAttributeDefinitionResponse> {
  return apiFetch<AdminAttributeDefinitionResponse>("/api/admin/attributes", {
    method: "POST",
    body: JSON.stringify(body),
    token,
  });
}

export function updateAdminAttribute(
  id: string,
  body: AdminAttributeDefinitionWriteRequest,
  token: string
): Promise<AdminAttributeDefinitionResponse> {
  return apiFetch<AdminAttributeDefinitionResponse>(`/api/admin/attributes/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
    token,
  });
}

export function deleteAdminAttribute(id: string, token: string): Promise<void> {
  return apiFetch<void>(`/api/admin/attributes/${id}`, {
    method: "DELETE",
    token,
  });
}

export function getAdminItemAttributes(itemId: string, token: string): Promise<AdminItemAttributeValueResponse[]> {
  return apiFetch<AdminItemAttributeValueResponse[]>(`/api/admin/items/${itemId}/attributes`, { token });
}

export function updateAdminItemAttributes(
  itemId: string,
  body: AdminItemAttributesUpdateRequest,
  token: string
): Promise<void> {
  return apiFetch<void>(`/api/admin/items/${itemId}/attributes`, {
    method: "PUT",
    body: JSON.stringify(body),
    token,
  });
}

export function createItem(body: ItemWriteRequest, token: string): Promise<ItemDetailResponse> {
  return apiFetch<ItemDetailResponse>("/api/admin/items", {
    method: "POST",
    body: JSON.stringify(body),
    token,
  });
}

export function updateItem(id: string, body: ItemWriteRequest, token: string): Promise<void> {
  return apiFetch<void>(`/api/admin/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
    token,
  });
}

export function deleteItem(id: string, token: string): Promise<void> {
  return apiFetch<void>(`/api/admin/items/${id}`, {
    method: "DELETE",
    token,
  });
}

export function patchItemStatus(id: string, body: ItemStatusPatchRequest, token: string): Promise<void> {
  return apiFetch<void>(`/api/admin/items/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(body),
    token,
  });
}

export function getOrders(token: string): Promise<OrderResponse[]> {
  return apiFetch<OrderResponse[]>("/api/admin/orders", { token });
}

export function patchOrderStatus(id: string, body: StatusPatchRequest, token: string): Promise<void> {
  return apiFetch<void>(`/api/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(body),
    token,
  });
}

export function createInquiry(body: InquiryCreateRequest): Promise<void> {
  return apiFetch<void>("/api/inquiries", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getInquiries(token: string): Promise<InquiryResponse[]> {
  return apiFetch<InquiryResponse[]>("/api/admin/inquiries", { token });
}

export function getInquiry(id: string, token: string): Promise<InquiryResponse> {
  return apiFetch<InquiryResponse>(`/api/admin/inquiries/${id}`, { token });
}

export function patchInquiryStatus(id: string, body: StatusPatchRequest, token: string): Promise<void> {
  return apiFetch<void>(`/api/admin/inquiries/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(body),
    token,
  });
}

export function getLeads(token: string): Promise<LeadResponse[]> {
  return apiFetch<LeadResponse[]>("/api/admin/leads", { token });
}

// --- Admin: Item Images ---

export function listItemImages(itemId: string, token: string): Promise<ItemImageResponse[]> {
  return apiFetch<ItemImageResponse[]>(`/api/admin/items/${itemId}/images`, { token });
}

export function addItemImage(itemId: string, body: ItemImageWriteRequest, token: string): Promise<ItemImageResponse> {
  return apiFetch<ItemImageResponse>(`/api/admin/items/${itemId}/images`, {
    method: "POST",
    body: JSON.stringify(body),
    token,
  });
}

export function updateItemImage(itemId: string, imageId: string, body: ItemImageWriteRequest, token: string): Promise<void> {
  return apiFetch<void>(`/api/admin/items/${itemId}/images/${imageId}`, {
    method: "PUT",
    body: JSON.stringify(body),
    token,
  });
}

export function deleteItemImage(itemId: string, imageId: string, token: string): Promise<void> {
  return apiFetch<void>(`/api/admin/items/${itemId}/images/${imageId}`, {
    method: "DELETE",
    token,
  });
}

export function setItemImagePrimary(itemId: string, imageId: string, token: string): Promise<void> {
  return apiFetch<void>(`/api/admin/items/${itemId}/images/${imageId}/set-primary`, {
    method: "POST",
    body: JSON.stringify({}),
    token,
  });
}

export async function uploadItemImage(
  itemId: string,
  file: File,
  meta: { altText?: string; sortOrder: number; isPrimary: boolean },
  token: string,
): Promise<ItemImageResponse> {
  const form = new FormData();
  form.append("file", file);
  form.append("sortOrder", String(meta.sortOrder));
  form.append("isPrimary", String(meta.isPrimary));
  if (meta.altText) {
    form.append("altText", meta.altText);
  }

  const res = await fetch(`${BASE_URL}/api/admin/items/${itemId}/images/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(res.status, `Upload failed ${res.status}: ${text}`);
  }

  return res.json() as Promise<ItemImageResponse>;
}
