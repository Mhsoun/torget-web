import type {
  CategoryResponse,
  DashboardStatsResponse,
  InquiryResponse,
  ItemDetailResponse,
  ItemResponse,
  ItemStatus,
  ItemWriteRequest,
  ItemStatusPatchRequest,
  LeadResponse,
  LoginRequest,
  LoginResponse,
  OrderResponse,
  StatusPatchRequest,
} from "@/types/torget";

const BASE_URL = (
  process.env.TORGET_API_URL ?? process.env.NEXT_PUBLIC_TORGET_API_URL ?? ""
).replace(/\/$/, "");

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
    throw new Error(`API error ${res.status}: ${text}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

// --- Public ---

export function getItems(params?: {
  categoryId?: string;
  status?: ItemStatus;
}): Promise<ItemResponse[]> {
  const query = new URLSearchParams();
  if (params?.categoryId) query.set("categoryId", params.categoryId);
  if (params?.status !== undefined) query.set("status", String(params.status));
  const qs = query.toString();
  return apiFetch<ItemResponse[]>(`/api/items${qs ? `?${qs}` : ""}`);
}

export function getItem(id: string): Promise<ItemDetailResponse> {
  return apiFetch<ItemDetailResponse>(`/api/items/${id}`);
}

export function getCategories(): Promise<CategoryResponse[]> {
  return apiFetch<CategoryResponse[]>("/api/categories");
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

export function getInquiries(token: string): Promise<InquiryResponse[]> {
  return apiFetch<InquiryResponse[]>("/api/admin/inquiries", { token });
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
