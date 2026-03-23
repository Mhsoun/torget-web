import type { BrandConfig } from "../types";

/**
 * Torget brand.
 *
 * Norwegian marketplace. Teal / blue-green primary color.
 * Clean, Scandinavian aesthetic. Slightly rounded corners.
 *
 * Personality: open, trustworthy, Nordic.
 * Primary hue: teal (OKLCH hue ≈ 200).
 */
export const torgetBrand: BrandConfig = {
  id: "torget",
  name: "Torget",
  description: "Norwegian marketplace — clean, Scandinavian, teal accent.",
  logoPath: "/brands/torget/logo.svg",
  faviconPath: "/brands/torget/favicon.ico",
  radiusPersonality: "default",

  light: {
    primary: "oklch(0.5 0.18 200)",
    primaryForeground: "oklch(0.98 0 0)",
    accent: "oklch(0.94 0.05 195)",
    accentForeground: "oklch(0.25 0.08 200)",
    ring: "oklch(0.5 0.18 200)",
    sidebarPrimary: "oklch(0.5 0.18 200)",
    sidebarPrimaryForeground: "oklch(0.98 0 0)",
    chart1: "oklch(0.5 0.18 200)",
    chart2: "oklch(0.6 0.14 190)",
    chart3: "oklch(0.7 0.1 185)",
    chart4: "oklch(0.8 0.07 180)",
    chart5: "oklch(0.88 0.04 175)",
  },

  dark: {
    primary: "oklch(0.65 0.16 200)",
    primaryForeground: "oklch(0.1 0.01 200)",
    accent: "oklch(0.28 0.06 200)",
    accentForeground: "oklch(0.88 0.06 200)",
    ring: "oklch(0.65 0.16 200)",
    sidebarPrimary: "oklch(0.65 0.16 200)",
    sidebarPrimaryForeground: "oklch(0.1 0.01 200)",
    chart1: "oklch(0.65 0.16 200)",
    chart2: "oklch(0.72 0.12 190)",
    chart3: "oklch(0.78 0.08 185)",
    chart4: "oklch(0.83 0.05 180)",
    chart5: "oklch(0.88 0.03 175)",
  },
};
