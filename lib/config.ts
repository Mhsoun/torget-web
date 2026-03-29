import { cache } from "react";
import { getBusinessConfig } from "@/lib/api";
import type { BusinessConfigResponse } from "@/types/torget";

const DEFAULT_CONFIG: BusinessConfigResponse = {
  name: "Torget",
  tagline: "Torget marketplace",
  slug: "torget",
  locale: "nb-NO",
  currency: "NOK",
  brandKey: "default",
  contactEmail: undefined,
  features: {
    showInquiries: true,
    showPrices: true,
    showCategories: true,
  },
};

/**
 * Fetches business config once per request, deduplicating across nested layouts.
 * Falls back to a safe default when the API is unavailable.
 */
export const getCachedBusinessConfig = cache(
  async (): Promise<BusinessConfigResponse> => {
    try {
      return await getBusinessConfig();
    } catch {
      return DEFAULT_CONFIG;
    }
  }
);
