export type CapabilityState = "live" | "partial" | "unavailable" | "read_only";

export type CapabilityDomain =
  | "auth"
  | "dashboard"
  | "items"
  | "attributes"
  | "inquiries"
  | "orders"
  | "leads"
  | "business_config"
  | "item_images";

export interface AdminCapability {
  domain: CapabilityDomain;
  label: string;
  state: CapabilityState;
  description: string;
}

export const ADMIN_CAPABILITIES: Record<CapabilityDomain, AdminCapability> = {
  auth: {
    domain: "auth",
    label: "Admin auth",
    state: "unavailable",
    description: "Credential validation is currently backend-stubbed.",
  },
  dashboard: {
    domain: "dashboard",
    label: "Dashboard stats",
    state: "partial",
    description: "Orders and leads totals are currently partial placeholders.",
  },
  items: {
    domain: "items",
    label: "Items",
    state: "live",
    description: "CRUD and status management are available.",
  },
  attributes: {
    domain: "attributes",
    label: "Attributes",
    state: "live",
    description: "Definition and item-value workflows are available.",
  },
  inquiries: {
    domain: "inquiries",
    label: "Inquiries",
    state: "live",
    description: "List/detail/status workflows are available.",
  },
  orders: {
    domain: "orders",
    label: "Orders",
    state: "read_only",
    description: "Listing is available; status mutation is not yet implemented.",
  },
  leads: {
    domain: "leads",
    label: "Leads",
    state: "read_only",
    description: "Read-only visibility only while backend workflows are incomplete.",
  },
  business_config: {
    domain: "business_config",
    label: "Business settings",
    state: "live",
    description: "Read/write business configuration is available.",
  },
  item_images: {
    domain: "item_images",
    label: "Item images",
    state: "live",
    description: "Add/edit/delete/upload/set-primary image workflows are available.",
  },
};

export function getAdminCapability(domain: CapabilityDomain): AdminCapability {
  return ADMIN_CAPABILITIES[domain];
}

export function canMutateDomain(domain: CapabilityDomain): boolean {
  const state = ADMIN_CAPABILITIES[domain].state;
  return state === "live" || state === "partial";
}

export function getCapabilityTone(state: CapabilityState): "default" | "secondary" | "outline" | "destructive" {
  switch (state) {
    case "live":
      return "default";
    case "partial":
      return "secondary";
    case "read_only":
      return "outline";
    case "unavailable":
      return "destructive";
    default:
      return "outline";
  }
}

export function getCapabilityStateLabel(state: CapabilityState): string {
  switch (state) {
    case "live":
      return "Live";
    case "partial":
      return "Partial";
    case "read_only":
      return "Read-only";
    case "unavailable":
      return "Unavailable";
    default:
      return "Unknown";
  }
}
