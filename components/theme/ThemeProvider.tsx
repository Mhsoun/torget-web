"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from "next-themes";
import { brands, DEFAULT_BRAND_ID, getBrand } from "@/lib/themes";
import type { BrandConfig } from "@/lib/themes";
import { resolveTenantFromBrowser } from "@/src/lib/tenant/resolveTenant";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeContextValue {
  /** Currently active brand config */
  brand: BrandConfig;
  /** Currently active brand id */
  brandId: string;
  /** Current mode preference (may be "system") */
  mode: ThemeMode;
  /** Whether dark mode is actually active (resolves "system") */
  isDark: boolean;
  /** Change the active brand */
  setBrand: (id: string) => void;
  /** Change the mode preference */
  setMode: (mode: ThemeMode) => void;
  /** Toggle between light and dark (sets an explicit mode, never "system") */
  toggleMode: () => void;
  /** All available brands */
  availableBrands: BrandConfig[];
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Storage keys ─────────────────────────────────────────────────────────────

const STORAGE_BRAND_KEY = "torget-brand";
const STORAGE_TENANT_KEY = "torget-tenant";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readStorage(key: string, fallback: string): string {
  if (typeof localStorage === "undefined") return fallback;
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore — storage may be unavailable
  }
}

function applyThemeToDom(brandId: string): void {
  const el = document.documentElement;
  el.setAttribute("data-tenant", brandId);
  el.setAttribute("data-brand", brandId);
}

function ThemeContextBridge({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [brandId, setBrandIdState] = useState<string>(DEFAULT_BRAND_ID);
  const mode: ThemeMode =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : "system";
  const isDark = resolvedTheme === "dark";
  const brand = useMemo(() => getBrand(brandId), [brandId]);

  // Initialize from storage on mount to avoid server/client hydration mismatch.
  useEffect(() => {
    const resolvedTenant = resolveTenantFromBrowser();
    const storedBrand = readStorage(STORAGE_BRAND_KEY, resolvedTenant.brandId);
    setBrandIdState(getBrand(storedBrand).id);
  }, []);

  // Apply tenant/brand attribute whenever the active brand changes.
  useEffect(() => {
    applyThemeToDom(brandId);
  }, [brandId]);

  const setBrand = useCallback((id: string) => {
    const resolved = brands.find((b) => b.id === id)?.id ?? DEFAULT_BRAND_ID;
    setBrandIdState(resolved);
    writeStorage(STORAGE_BRAND_KEY, resolved);
    writeStorage(STORAGE_TENANT_KEY, resolved);
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setTheme(newMode);
  }, [setTheme]);

  const toggleMode = useCallback(() => {
    setMode(isDark ? "light" : "dark");
  }, [isDark, setMode]);

  return (
    <ThemeContext.Provider
      value={{
        brand,
        brandId,
        mode,
        isDark,
        setBrand,
        setMode,
        toggleMode,
        availableBrands: brands,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="torget-mode"
      disableTransitionOnChange
    >
      <ThemeContextBridge>{children}</ThemeContextBridge>
    </NextThemesProvider>
  );
}

// ─── Internal hook (consumed by use-theme.ts) ─────────────────────────────────

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return ctx;
}
