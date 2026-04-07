export type TenantId = "default" | "torget" | "furniture";

export interface TenantConfig {
  id: TenantId;
  displayName: string;
  brandId: TenantId;
  hostnames: string[];
}

export interface TenantResolutionInput {
  host?: string;
  pathname?: string;
  preferredTenantId?: string;
}
