import type { TenantConfig, TenantId } from "./types";

export const DEFAULT_TENANT_ID: TenantId = "default";

export const TENANTS: Record<TenantId, TenantConfig> = {
  default: {
    id: "default",
    displayName: "Default",
    brandId: "default",
    hostnames: ["localhost", "127.0.0.1"],
  },
  torget: {
    id: "torget",
    displayName: "Torget",
    brandId: "torget",
    hostnames: [],
  },
  furniture: {
    id: "furniture",
    displayName: "Nordic Furniture",
    brandId: "furniture",
    hostnames: [],
  },
};

export function isTenantId(value: string): value is TenantId {
  return value in TENANTS;
}
