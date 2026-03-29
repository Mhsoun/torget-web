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
  description?: string;
  status: ItemStatus;
  categoryName?: string;
  categorySlug?: string;
  primaryImageUrl?: string;
};

export type ItemImageResponse = {
  id: string;
  url: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
};

export type ItemAttributeResponse = {
  attributeId: string;
  name: string;
  slug: string;
  type: string;
  value: string;
  label: string;
};

export type ItemDetailResponse = {
  id: string;
  name: string;
  price: number;
  categoryId: string | null;
  status: ItemStatus;
  createdAtUtc: string;
  description?: string;
  categoryName?: string;
  categorySlug?: string;
  primaryImageUrl?: string;
  images: ItemImageResponse[];
  attributes: ItemAttributeResponse[];
};

export type CategoryResponse = {
  id: string;
  name: string;
  slug: string;
};

export type PublicAttributeOptionResponse = {
  value: string;
  label: string;
};

export type PublicAttributeFilterResponse = {
  id: string;
  name: string;
  slug: string;
  type: string;
  options: PublicAttributeOptionResponse[];
};

export type ItemBrowseSort = "newest" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

export type AdminAttributeOptionResponse = {
  id: string;
  value: string;
  label: string;
  sortOrder: number;
};

export type AdminAttributeDefinitionResponse = {
  id: string;
  name: string;
  slug: string;
  type: string;
  isRequired: boolean;
  isSearchable: boolean;
  sortOrder: number;
  options: AdminAttributeOptionResponse[];
};

export type AdminAttributeOptionWriteRequest = {
  value: string;
  label: string;
  sortOrder: number;
};

export type AdminAttributeDefinitionWriteRequest = {
  name: string;
  slug: string;
  type: string;
  isRequired: boolean;
  isSearchable: boolean;
  sortOrder: number;
  options: AdminAttributeOptionWriteRequest[];
};

export type AdminItemAttributeValueResponse = {
  attributeId: string;
  value: string;
};

export type AdminItemAttributeValueWriteRequest = {
  attributeId: string;
  value?: string;
};

export type AdminItemAttributesUpdateRequest = {
  attributes: AdminItemAttributeValueWriteRequest[];
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
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  createdAtUtc: string;
};

export type InquiryCreateRequest = {
  itemId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
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
  description?: string;
  categoryId?: string;
  status: ItemStatus;
};

export type ItemStatusPatchRequest = {
  status: ItemStatus;
};

export type StatusPatchRequest = {
  status: string;
};

export type BusinessFeaturesResponse = {
  showInquiries: boolean;
  showPrices: boolean;
  showCategories: boolean;
};

export type BusinessConfigResponse = {
  name: string;
  tagline?: string;
  slug: string;
  locale: string;
  currency: string;
  brandKey: string;
  contactEmail?: string;
  features: BusinessFeaturesResponse;
};

export type BusinessConfigWriteRequest = {
  name: string;
  tagline?: string;
  slug: string;
  locale: string;
  currency: string;
  brandKey: string;
  contactEmail?: string;
  showInquiries: boolean;
  showPrices: boolean;
  showCategories: boolean;
};

export const INQUIRY_STATUSES = ["New", "Open", "In Progress", "Resolved", "Closed"] as const;
