export enum ItemStatus {
  Draft = 0,
  Active = 1,
  Sold = 2,
  Archived = 3,
}

export const ITEM_STATUS_LABELS: Record<ItemStatus, string> = {
  [ItemStatus.Draft]: "Draft",
  [ItemStatus.Active]: "Active",
  [ItemStatus.Sold]: "Sold",
  [ItemStatus.Archived]: "Archived",
};

export type ItemResponse = {
  id: string;
  name: string;
  price: number;
};

export type ItemDetailResponse = {
  id: string;
  name: string;
  price: number;
  categoryId: string | null;
  status: ItemStatus;
  createdAtUtc: string;
};

export type CategoryResponse = {
  id: string;
  name: string;
  slug: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  expiresAt: string;
};

export type DashboardStatsResponse = {
  totalItems: number;
  totalOrders: number;
  totalLeads: number;
  openInquiries: number;
};

export type OrderResponse = {
  id: string;
  itemId: string;
  amount: number;
  status: string;
};

export type InquiryResponse = {
  id: string;
  itemId: string;
  email: string;
  message: string;
  status: string;
};

export type LeadResponse = {
  id: string;
  email: string;
  name: string;
  status: string;
};

export type ItemWriteRequest = {
  name: string;
  price: number;
  categoryId?: string;
  status: ItemStatus;
};

export type ItemStatusPatchRequest = {
  status: ItemStatus;
};

export type StatusPatchRequest = {
  status: string;
};
