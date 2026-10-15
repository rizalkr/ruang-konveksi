/**
 * Utility functions for WCAG 2.1 relative luminance and contrast ratio calculation,
 * and color validation for safe CSS custom property injection.
 */

const DARK_SLATE = "#0f172a";
const WHITE = "#ffffff";

/**
 * Validates whether a string is a safe hex color value (#RGB or #RRGGBB).
 * Used to sanitize config values before injecting them as CSS custom properties.
 */
export function isValidHexColor(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

/**
 * Derives a hover-darkened variant from a hex color by reducing each channel by ~20%.
 */
export function deriveHoverColor(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const darken = (v: number) => Math.max(0, Math.round(v * 0.78));
  const toHex = (v: number) => v.toString(16).padStart(2, "0");
  return `#${toHex(darken(r))}${toHex(darken(g))}${toHex(darken(b))}`;
}

/**
 * Parses a 3-character or 6-character hex string into RGB numeric values [0-255].
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.trim().replace(/^#/, "");

  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (cleanHex.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(cleanHex)) {
    // Default to dark slate fallback if invalid hex
    return { r: 15, g: 23, b: 42 };
  }

  const num = Number.parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Calculates WCAG 2.1 relative luminance of an sRGB color.
 */
export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);

  const normalizeChannel = (val: number): number => {
    const c = val / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  const rLin = normalizeChannel(r);
  const gLin = normalizeChannel(g);
  const bLin = normalizeChannel(b);

  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Calculates contrast ratio between two luminance values according to WCAG 2.1:
 * (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter luminance.
 */
export function calculateContrastRatio(lum1: number, lum2: number): number {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

export type ColorContrastResult = {
  textColor: "#ffffff" | "#0f172a";
  ratio: number;
  passesAA: boolean;
  passesAALarge: boolean;
};

const warnedColors = new Set<string>();

/**
 * Determines optimal accessible text color (White or Dark Slate) against a background hex.
 * Computes luminance of #0f172a dynamically from hex at runtime (~0.0088).
 * Warns in development if best ratio is below WCAG AA 4.5:1 for normal text.
 */
export function getAccessibleTextColor(bgHex: string): "#ffffff" | "#0f172a" {
  return evaluateColorContrast(bgHex).textColor;
}

export function evaluateColorContrast(bgHex: string): ColorContrastResult {
  const bgLum = getRelativeLuminance(bgHex);
  const whiteLum = getRelativeLuminance(WHITE);
  const slateLum = getRelativeLuminance(DARK_SLATE);

  const ratioWhite = calculateContrastRatio(bgLum, whiteLum);
  const ratioDark = calculateContrastRatio(bgLum, slateLum);

  const useWhite = ratioWhite >= ratioDark;
  const textColor = useWhite ? WHITE : DARK_SLATE;
  const bestRatio = useWhite ? ratioWhite : ratioDark;

  const passesAA = bestRatio >= 4.5;
  const passesAALarge = bestRatio >= 3.0;

  const normalizedHex = bgHex.toLowerCase().trim();
  if (
    process.env.NODE_ENV !== "production" &&
    !passesAA &&
    !warnedColors.has(normalizedHex)
  ) {
    warnedColors.add(normalizedHex);
    if (!passesAALarge) {
      console.warn(
        `[color] Contrast ratio ${bestRatio.toFixed(2)}:1 for background "${bgHex}" fails WCAG AA minimum contrast (requires at least 3.0:1 for large text or 4.5:1 for normal text).`,
      );
    } else {
      console.warn(
        `[color] Contrast ratio ${bestRatio.toFixed(2)}:1 for background "${bgHex}" satisfies large text (at least 18.67px / 14pt bold or 24px / 18pt normal, 3.0:1) but is below WCAG AA 4.5:1 for normal text.`,
      );
    }
  }

  return {
    textColor,
    ratio: bestRatio,
    passesAA,
    passesAALarge,
  };
}

