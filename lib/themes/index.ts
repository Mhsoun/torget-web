import type { BrandConfig } from "./types";
import { defaultBrand } from "./brands/default";
import { torgetBrand } from "./brands/torget";
import { furnitureBrand } from "./brands/furniture";

export type { BrandConfig, ThemeTokens, RadiusPersonality } from "./types";
export { RADIUS_VALUES } from "./types";

/** All registered brands. Add new brands here. */
export const brands: BrandConfig[] = [defaultBrand, torgetBrand, furnitureBrand];

/** The brand used when no preference is set. */
export const DEFAULT_BRAND_ID = "default";

/**
 * Look up a brand by its id.
 * Falls back to the default brand if the id is not found.
 */
export function getBrand(id: string): BrandConfig {
  return brands.find((b) => b.id === id) ?? defaultBrand;
}

/** Brand ids for use in type-safe contexts. */
export type BrandId = (typeof brands)[number]["id"];
