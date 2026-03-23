/**
 * Platform design token types.
 *
 * These types define the stable API that brand configs must conform to.
 * Components must only reference the semantic tokens defined here —
 * never hardcode specific color values.
 */

/**
 * Controls the border-radius personality of a brand.
 * Maps to the --radius CSS variable which drives all radius-* scale values.
 *
 *   sharp    → 0.375rem  (structured, corporate)
 *   default  → 0.75rem   (clean, modern)
 *   soft     → 1rem      (friendly, approachable)
 *   pill     → 1.5rem    (very rounded, playful)
 */
export type RadiusPersonality = "sharp" | "default" | "soft" | "pill";

export const RADIUS_VALUES: Record<RadiusPersonality, string> = {
  sharp: "0.375rem",
  default: "0.75rem",
  soft: "1rem",
  pill: "1.5rem",
};

/**
 * A complete set of semantic design tokens for one mode (light or dark).
 * All values should be valid CSS color strings (OKLCH, RGB, hex, etc.).
 * All fields are optional — omitted tokens fall back to the neutral default.
 */
export type ThemeTokens = {
  /** Page / app background */
  background?: string;
  /** Default text on background */
  foreground?: string;

  /** Card surface */
  card?: string;
  /** Text on card */
  cardForeground?: string;

  /** Popover / dropdown surface */
  popover?: string;
  /** Text on popover */
  popoverForeground?: string;

  /** Primary brand action color */
  primary?: string;
  /** Text on primary */
  primaryForeground?: string;

  /** Secondary surface / subdued action */
  secondary?: string;
  /** Text on secondary */
  secondaryForeground?: string;

  /** Accent / highlight surface */
  accent?: string;
  /** Text on accent */
  accentForeground?: string;

  /** Quiet / subdued surface */
  muted?: string;
  /** Quiet / subdued text */
  mutedForeground?: string;

  /** Destructive / error color */
  destructive?: string;
  /** Text on destructive */
  destructiveForeground?: string;

  /** Positive feedback / success */
  success?: string;
  /** Text on success */
  successForeground?: string;

  /** Cautionary feedback / warning */
  warning?: string;
  /** Text on warning */
  warningForeground?: string;

  /** Default border color */
  border?: string;
  /** Input border color */
  input?: string;
  /** Focus ring color */
  ring?: string;

  /**
   * Border radius base value (CSS length).
   * Overrides the radius personality if set directly.
   * Prefer radiusPersonality on BrandConfig unless you need a precise value.
   */
  radius?: string;

  /** Chart / data-vis color 1 */
  chart1?: string;
  /** Chart / data-vis color 2 */
  chart2?: string;
  /** Chart / data-vis color 3 */
  chart3?: string;
  /** Chart / data-vis color 4 */
  chart4?: string;
  /** Chart / data-vis color 5 */
  chart5?: string;

  /** Sidebar surface */
  sidebar?: string;
  /** Sidebar text */
  sidebarForeground?: string;
  /** Sidebar primary action */
  sidebarPrimary?: string;
  /** Text on sidebar primary */
  sidebarPrimaryForeground?: string;
  /** Sidebar accent surface */
  sidebarAccent?: string;
  /** Text on sidebar accent */
  sidebarAccentForeground?: string;
  /** Sidebar border */
  sidebarBorder?: string;
  /** Sidebar ring */
  sidebarRing?: string;
};

/**
 * A complete brand configuration.
 * Defines the visual identity for one business / product line.
 */
export type BrandConfig = {
  /** Unique identifier used as the data-brand attribute value */
  id: string;
  /** Human-readable display name */
  name: string;
  /** Short description of the brand / market segment */
  description?: string;

  /** Path to logo image under /public (e.g. "/brands/torget/logo.svg") */
  logoPath?: string;
  /** Path to favicon under /public (e.g. "/brands/torget/favicon.ico") */
  faviconPath?: string;

  /**
   * Optional CSS font-family override for headings.
   * Defaults to the platform sans-serif (Inter).
   * The font must be loaded separately (next/font or @font-face).
   */
  headingFont?: string;

  /**
   * Border radius personality for the brand.
   * Drives the --radius base value which all radius-* scale values derive from.
   */
  radiusPersonality?: RadiusPersonality;

  /** Token overrides for light mode */
  light: ThemeTokens;

  /** Token overrides for dark mode */
  dark: ThemeTokens;
};
