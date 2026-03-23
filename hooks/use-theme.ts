"use client";

import { useThemeContext } from "@/components/theme/ThemeProvider";
import type { ThemeContextValue } from "@/components/theme/ThemeProvider";

export type { ThemeContextValue, ThemeMode } from "@/components/theme/ThemeProvider";

/**
 * Access the current theme context.
 *
 * Returns: { brand, brandId, mode, isDark, setBrand, setMode, toggleMode, availableBrands }
 *
 * Must be used inside a component rendered under <ThemeProvider>.
 */
export function useTheme(): ThemeContextValue {
  return useThemeContext();
}
