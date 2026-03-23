import type { BrandConfig } from "../types";

/**
 * Default neutral brand.
 *
 * Achromatic, fully neutral — works across any market segment.
 * This is the platform baseline: all other brands override only what differs.
 * Token values mirror the :root / .dark blocks in globals.css.
 */
export const defaultBrand: BrandConfig = {
  id: "default",
  name: "Default",
  description: "Neutral platform default. Achromatic, clean, and versatile.",
  radiusPersonality: "default",

  light: {
    background: "oklch(1 0 0)",
    foreground: "oklch(0.145 0 0)",
    card: "oklch(1 0 0)",
    cardForeground: "oklch(0.145 0 0)",
    popover: "oklch(1 0 0)",
    popoverForeground: "oklch(0.145 0 0)",
    primary: "oklch(0.205 0 0)",
    primaryForeground: "oklch(0.985 0 0)",
    secondary: "oklch(0.97 0 0)",
    secondaryForeground: "oklch(0.205 0 0)",
    accent: "oklch(0.97 0 0)",
    accentForeground: "oklch(0.205 0 0)",
    muted: "oklch(0.97 0 0)",
    mutedForeground: "oklch(0.556 0 0)",
    destructive: "oklch(0.577 0.245 27.325)",
    destructiveForeground: "oklch(0.985 0 0)",
    success: "oklch(0.52 0.17 155)",
    successForeground: "oklch(0.985 0 0)",
    warning: "oklch(0.72 0.18 70)",
    warningForeground: "oklch(0.15 0 0)",
    border: "oklch(0.922 0 0)",
    input: "oklch(0.922 0 0)",
    ring: "oklch(0.708 0 0)",
    radius: "0.75rem",
  },

  dark: {
    background: "oklch(0.13 0.008 250)",
    foreground: "oklch(0.94 0.005 250)",
    card: "oklch(0.18 0.007 250)",
    cardForeground: "oklch(0.94 0.005 250)",
    popover: "oklch(0.18 0.007 250)",
    popoverForeground: "oklch(0.94 0.005 250)",
    primary: "oklch(0.88 0.005 250)",
    primaryForeground: "oklch(0.18 0.007 250)",
    secondary: "oklch(0.24 0.008 250)",
    secondaryForeground: "oklch(0.94 0.005 250)",
    accent: "oklch(0.24 0.008 250)",
    accentForeground: "oklch(0.94 0.005 250)",
    muted: "oklch(0.24 0.006 250)",
    mutedForeground: "oklch(0.62 0.008 250)",
    destructive: "oklch(0.66 0.2 22)",
    destructiveForeground: "oklch(0.985 0 0)",
    success: "oklch(0.62 0.15 155)",
    successForeground: "oklch(0.1 0 0)",
    warning: "oklch(0.78 0.14 70)",
    warningForeground: "oklch(0.12 0 0)",
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 14%)",
    ring: "oklch(0.55 0.01 250)",
  },
};
