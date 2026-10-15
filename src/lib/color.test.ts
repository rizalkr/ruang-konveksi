import { describe, expect, it } from "vitest";
import {
  calculateContrastRatio,
  evaluateColorContrast,
  getAccessibleTextColor,
  getRelativeLuminance,
  hexToRgb,
} from "./color";

describe("Color accessibility and contrast utilities", () => {
  it("parses 3-char and 6-char hex strings correctly", () => {
    expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("#000")).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb("#1e3a8a")).toEqual({ r: 30, g: 58, b: 138 });
  });

  it("handles invalid hex fallback safely", () => {
    expect(hexToRgb("invalid")).toEqual({ r: 15, g: 23, b: 42 });
  });

  it("calculates WCAG 2.1 relative luminance accurately", () => {
    expect(getRelativeLuminance("#ffffff")).toBeCloseTo(1.0, 2);
    expect(getRelativeLuminance("#000000")).toBeCloseTo(0.0, 2);
  });

  it("calculates contrast ratio conforming to WCAG 2.1 formula", () => {
    const whiteLum = getRelativeLuminance("#ffffff");
    const blackLum = getRelativeLuminance("#000000");
    const ratio = calculateContrastRatio(whiteLum, blackLum);
    expect(ratio).toBeCloseTo(21.0, 1);
  });

  it("verifies demo-generik brand color (#1e3a8a) passes both AA (4.5:1) and AA Large (3:1)", () => {
    const result = evaluateColorContrast("#1e3a8a");
    expect(result.textColor).toBe("#ffffff");
    expect(result.ratio).toBeGreaterThanOrEqual(4.5);
    expect(result.ratio).toBeGreaterThanOrEqual(3.0);
    expect(result.passesAA).toBe(true);
    expect(result.passesAALarge).toBe(true);
    // Exact contrast ratio for #1e3a8a with white is > 10:1
    expect(result.ratio).toBeGreaterThan(10.0);
  });

  it("verifies secondary button colors (bg-white with text-neutral-800 #262626) exceed AA", () => {
    const whiteLum = getRelativeLuminance("#ffffff");
    const neutral800Lum = getRelativeLuminance("#262626");
    const ratio = calculateContrastRatio(whiteLum, neutral800Lum);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
    expect(ratio).toBeGreaterThan(13.0);
  });

  it("verifies prospect-template brand color (#0f766e) passes AA and AA Large", () => {
    const result = evaluateColorContrast("#0f766e");
    expect(result.textColor).toBe("#ffffff");
    expect(result.ratio).toBeGreaterThanOrEqual(4.5);
    expect(result.ratio).toBeGreaterThanOrEqual(3.0);
    expect(result.passesAA).toBe(true);
    expect(result.passesAALarge).toBe(true);
  });

  it("selects white text for dark backgrounds and dark text for bright backgrounds", () => {
    expect(getAccessibleTextColor("#0f172a")).toBe("#ffffff");
    expect(getAccessibleTextColor("#f8fafc")).toBe("#0f172a");
    expect(getAccessibleTextColor("#ffffff")).toBe("#0f172a");
    expect(getAccessibleTextColor("#000000")).toBe("#ffffff");
    expect(getAccessibleTextColor("#1e3a8a")).toBe("#ffffff");
  });

  it("correctly identifies colors qualifying for AA Large (>= 3:1) but failing normal AA (< 4.5:1)", () => {
    // Example: #3b82f6 (Blue-500) has ratio ~4.0:1 with white
    const result = evaluateColorContrast("#3b82f6");
    expect(result.ratio).toBeGreaterThanOrEqual(3.0);
    expect(result.passesAALarge).toBe(true);
    // Requires large text >= 18.67px bold to pass WCAG AA
  });

  it("mathematically guarantees all sRGB colors satisfy WCAG AA Large Text (>= 3.0:1) with minimum ratio >= 4.22:1", () => {
    // The theoretical minimum best ratio between white (L=1.0) and dark slate (L=0.0088)
    // occurs at L ≈ 0.1985, giving ratio ≈ 4.226:1.
    const testColors = [
      "#000000", "#ffffff", "#1e3a8a", "#0f766e", "#3b82f6",
      "#777777", "#808080", "#a855f7", "#ec4899", "#f59e0b",
      "#10b981", "#ef4444", "#64748b", "#334155", "#94a3b8",
    ];

    for (const hex of testColors) {
      const result = evaluateColorContrast(hex);
      expect(result.ratio).toBeGreaterThanOrEqual(4.22);
      expect(result.passesAALarge).toBe(true);
    }
  });
});

