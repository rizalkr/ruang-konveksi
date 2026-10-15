import { describe, expect, it } from "vitest";
import { formatRupiah } from "./format";

describe("formatRupiah", () => {
  it("formats standard positive amounts correctly", () => {
    expect(formatRupiah(55000)).toBe("Rp 55.000");
    expect(formatRupiah(120000)).toBe("Rp 120.000");
    expect(formatRupiah(1500000)).toBe("Rp 1.500.000");
  });

  it("formats zero correctly", () => {
    expect(formatRupiah(0)).toBe("Rp 0");
    expect(formatRupiah(-0)).toBe("Rp 0");
  });

  it("formats numbers without decimals (fractions rounded)", () => {
    expect(formatRupiah(85000.45)).toBe("Rp 85.000");
    expect(formatRupiah(85000.75)).toBe("Rp 85.001");
  });

  it("handles negative values consistently", () => {
    const result = formatRupiah(-50000);
    expect(result).toBe("-Rp 50.000");
  });

  it("gracefully falls back to Rp 0 on invalid non-finite numbers", () => {
    expect(formatRupiah(NaN)).toBe("Rp 0");
    expect(formatRupiah(Infinity)).toBe("Rp 0");
    expect(formatRupiah(-Infinity)).toBe("Rp 0");
    expect(formatRupiah(undefined as unknown as number)).toBe("Rp 0");
    expect(formatRupiah(null as unknown as number)).toBe("Rp 0");
  });
});
