"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { brands, DEFAULT_BRAND_ID, getBrand } from "@/lib/themes";
import type { BrandConfig } from "@/lib/themes";

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
const STORAGE_MODE_KEY = "torget-mode";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  // "system" — check media query
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
}

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

function applyThemeToDom(brandId: string, isDark: boolean): void {
  const el = document.documentElement;
  el.setAttribute("data-brand", brandId);
  if (isDark) {
    el.classList.add("dark");
  } else {
    el.classList.remove("dark");
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [brandId, setBrandIdState] = useState<string>(DEFAULT_BRAND_ID);
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [isDark, setIsDark] = useState<boolean>(false);

  const brand = getBrand(brandId);

  // Initialize from storage on mount to avoid server/client hydration mismatch.
  useEffect(() => {
    const storedBrand = readStorage(STORAGE_BRAND_KEY, DEFAULT_BRAND_ID);
    const storedMode = readStorage(STORAGE_MODE_KEY, "system");
    const resolvedMode: ThemeMode =
      storedMode === "light" || storedMode === "dark" || storedMode === "system"
        ? (storedMode as ThemeMode)
        : "system";

    setBrandIdState(storedBrand);
    setModeState(resolvedMode);
    setIsDark(resolveIsDark(resolvedMode));
  }, []);

  // Apply DOM changes whenever brandId or isDark changes
  useEffect(() => {
    applyThemeToDom(brandId, isDark);
  }, [brandId, isDark]);

  // Re-resolve "system" when prefers-color-scheme changes
  useEffect(() => {
    if (mode !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };

    mq.addEventListener("change", handleChange);
    // Sync immediately in case it changed between renders
    setIsDark(mq.matches);

    return () => mq.removeEventListener("change", handleChange);
  }, [mode]);

  const setBrand = useCallback((id: string) => {
    const resolved = brands.find((b) => b.id === id)?.id ?? DEFAULT_BRAND_ID;
    setBrandIdState(resolved);
    writeStorage(STORAGE_BRAND_KEY, resolved);
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    writeStorage(STORAGE_MODE_KEY, newMode);
    setIsDark(resolveIsDark(newMode));
  }, []);

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

// ─── Internal hook (consumed by use-theme.ts) ─────────────────────────────────

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return ctx;
}
