import type { BrandConfig } from "../types";

/**
 * Nordic Furniture brand.
 *
 * Home goods / furniture retail. Warm amber-brown primary.
 * Refined, editorial aesthetic. Slightly sharper corners than default.
 *
 * Personality: warm, premium, tactile, Scandinavian craft.
 * Primary hue: amber-brown (OKLCH hue ≈ 55).
 */
export const furnitureBrand: BrandConfig = {
  id: "furniture",
  name: "Nordic Furniture",
  description: "Furniture & home goods — warm, editorial, amber accent.",
  logoPath: "/brands/furniture/logo.svg",
  faviconPath: "/brands/furniture/favicon.ico",
  /*
   * Optional editorial heading font. Load it via next/font/google if desired:
   *   const playfair = Playfair_Display({ variable: "--font-heading", subsets: ["latin"] })
   * Then set headingFont here:
   */
  headingFont: '"Playfair Display", Georgia, serif',
  radiusPersonality: "sharp",

  light: {
    primary: "oklch(0.52 0.12 55)",
    primaryForeground: "oklch(0.98 0 0)",
    secondary: "oklch(0.96 0.03 60)",
    secondaryForeground: "oklch(0.3 0.08 55)",
    accent: "oklch(0.93 0.06 65)",
    accentForeground: "oklch(0.35 0.1 55)",
    ring: "oklch(0.52 0.12 55)",
    radius: "0.5rem",
    sidebarPrimary: "oklch(0.52 0.12 55)",
    sidebarPrimaryForeground: "oklch(0.98 0 0)",
    sidebarAccent: "oklch(0.96 0.03 60)",
    sidebarAccentForeground: "oklch(0.3 0.08 55)",
    chart1: "oklch(0.52 0.12 55)",
    chart2: "oklch(0.62 0.1 50)",
    chart3: "oklch(0.72 0.08 45)",
    chart4: "oklch(0.81 0.06 40)",
    chart5: "oklch(0.89 0.04 35)",
  },

  dark: {
    primary: "oklch(0.68 0.1 55)",
    primaryForeground: "oklch(0.1 0.02 55)",
    secondary: "oklch(0.26 0.04 55)",
    secondaryForeground: "oklch(0.92 0.02 55)",
    accent: "oklch(0.28 0.05 58)",
    accentForeground: "oklch(0.88 0.04 58)",
    ring: "oklch(0.68 0.1 55)",
    sidebarPrimary: "oklch(0.68 0.1 55)",
    sidebarPrimaryForeground: "oklch(0.1 0.02 55)",
    sidebarAccent: "oklch(0.26 0.04 55)",
    sidebarAccentForeground: "oklch(0.92 0.02 55)",
    chart1: "oklch(0.68 0.1 55)",
    chart2: "oklch(0.75 0.08 50)",
    chart3: "oklch(0.81 0.06 45)",
    chart4: "oklch(0.86 0.04 40)",
    chart5: "oklch(0.9 0.02 35)",
  },
};
