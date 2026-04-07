import { DEFAULT_TENANT_ID, isTenantId, TENANTS } from "./config";
import type { TenantConfig, TenantResolutionInput } from "./types";

const STORAGE_TENANT_KEY = "torget-tenant";
const STORAGE_BRAND_KEY = "torget-brand";

function normalizeHost(host?: string): string {
  if (!host) return "";
  return host.toLowerCase().split(":")[0];
}

function resolveByHost(host?: string): TenantConfig | null {
  const normalized = normalizeHost(host);
  if (!normalized) return null;

  const found = Object.values(TENANTS).find((tenant) =>
    tenant.hostnames.some((h) => h.toLowerCase() === normalized)
  );

  return found ?? null;
}

function resolveByPath(pathname?: string): TenantConfig | null {
  if (!pathname) return null;

  const segments = pathname.split("/");
  const first = segments.length > 1 ? segments[1] : undefined;
  if (first && isTenantId(first)) {
    return TENANTS[first];
  }

  return null;
}

export function resolveTenant(input: TenantResolutionInput = {}): TenantConfig {
  if (input.preferredTenantId && isTenantId(input.preferredTenantId)) {
    return TENANTS[input.preferredTenantId];
  }

  const byHost = resolveByHost(input.host);
  if (byHost) return byHost;

  const byPath = resolveByPath(input.pathname);
  if (byPath) return byPath;

  return TENANTS[DEFAULT_TENANT_ID];
}

export function resolveTenantFromBrowser(): TenantConfig {
  if (typeof window === "undefined") {
    return TENANTS[DEFAULT_TENANT_ID];
  }

  let preferred: string | undefined;
  try {
    preferred =
      window.localStorage.getItem(STORAGE_TENANT_KEY) ??
      window.localStorage.getItem(STORAGE_BRAND_KEY) ??
      undefined;
  } catch {
    preferred = undefined;
  }

  return resolveTenant({
    host: window.location.host,
    pathname: window.location.pathname,
    preferredTenantId: preferred ?? undefined,
  });
}
