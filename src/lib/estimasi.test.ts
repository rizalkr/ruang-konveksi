import { describe, expect, it } from "vitest";
import { formatRentangEstimasi, hitungEstimasi } from "./estimasi";
import type { KalkulatorConfig } from "@/config/types";
import { demoGenerikConfig } from "@/config/demo-generik";

const testConfig: KalkulatorConfig = {
  produk: {
    PDH: 120000,
    Kaos: 55000,
    Jaket: 135000,
    Almamater: 150000,
    Wearpack: 140000,
    Jersey: 90000,
    "Seragam Sekolah": 85000,
  },
  bahan: {
    Katun: 0,
    "Katun Combed": 10000,
    Drill: 15000,
    "Dry-fit": 12000,
  },
  branding: {
    Tanpa: 0,
    Sablon: 10000,
    Bordir: 20000,
  },
  diskonVolume: [
    { minJumlah: 24, diskon: 0.05 },
    { minJumlah: 50, diskon: 0.08 },
    { minJumlah: 100, diskon: 0.12 },
  ],
  rentangPersen: 10,
  moq: 12,
};

describe("hitungEstimasi", () => {
  it("matches the exact PRD Section 7 verification test case", () => {
    // Kaos (55.000) + Katun Combed (10.000) + Sablon (10.000) = 75.000 / pcs
    // 50 pcs qualifies for 8% volume discount (minJumlah: 50)
    // Total = 75.000 * 50 * (1 - 0.08) = 3.450.000
    // Range (10%): Min = 3.105.000, Max = 3.795.000
    const result = hitungEstimasi(
      {
        produk: "Kaos",
        bahan: "Katun Combed",
        branding: "Sablon",
        jumlah: 50,
      },
      testConfig
    );

    expect(result.hargaDasar).toBe(55000);
    expect(result.tambahanBahan).toBe(10000);
    expect(result.tambahanBranding).toBe(10000);
    expect(result.estimasiPerPcs).toBe(75000);
    expect(result.diskonPersen).toBe(0.08);
    expect(result.total).toBe(3450000);
    expect(result.rentangMin).toBe(3105000);
    expect(result.rentangMax).toBe(3795000);
    expect(result.isBelowMoq).toBe(false);
  });

  describe("volume discount boundaries", () => {
    it("tests boundary between 23 pcs (0% discount) and 24 pcs (5% discount)", () => {
      // 23 pcs Kaos + Katun Combed + Sablon: 75.000 * 23 = 1.725.000 (0% discount)
      const res23 = hitungEstimasi(
        { produk: "Kaos", bahan: "Katun Combed", branding: "Sablon", jumlah: 23 },
        testConfig
      );
      expect(res23.diskonPersen).toBe(0);
      expect(res23.total).toBe(1725000);
      expect(res23.rentangMin).toBe(1552500);
      expect(res23.rentangMax).toBe(1897500);

      // 24 pcs Kaos + Katun Combed + Sablon: 75.000 * 24 * 0.95 = 1.710.000 (5% discount)
      const res24 = hitungEstimasi(
        { produk: "Kaos", bahan: "Katun Combed", branding: "Sablon", jumlah: 24 },
        testConfig
      );
      expect(res24.diskonPersen).toBe(0.05);
      expect(res24.total).toBe(1710000);
      expect(res24.rentangMin).toBe(1539000);
      expect(res24.rentangMax).toBe(1881000);
    });

    it("tests boundary between 49 pcs (5% discount) and 50 pcs (8% discount)", () => {
      // 49 pcs: 75.000 * 49 * 0.95 = 3.491.250
      const res49 = hitungEstimasi(
        { produk: "Kaos", bahan: "Katun Combed", branding: "Sablon", jumlah: 49 },
        testConfig
      );
      expect(res49.diskonPersen).toBe(0.05);
      expect(res49.total).toBe(3491250);

      // 50 pcs: 75.000 * 50 * 0.92 = 3.450.000
      const res50 = hitungEstimasi(
        { produk: "Kaos", bahan: "Katun Combed", branding: "Sablon", jumlah: 50 },
        testConfig
      );
      expect(res50.diskonPersen).toBe(0.08);
      expect(res50.total).toBe(3450000);
    });

    it("tests boundary between 99 pcs (8% discount) and 100 pcs (12% discount)", () => {
      // 99 pcs: 75.000 * 99 * 0.92 = 6.831.000
      const res99 = hitungEstimasi(
        { produk: "Kaos", bahan: "Katun Combed", branding: "Sablon", jumlah: 99 },
        testConfig
      );
      expect(res99.diskonPersen).toBe(0.08);
      expect(res99.total).toBe(6831000);

      // 100 pcs: 75.000 * 100 * 0.88 = 6.600.000
      const res100 = hitungEstimasi(
        { produk: "Kaos", bahan: "Katun Combed", branding: "Sablon", jumlah: 100 },
        testConfig
      );
      expect(res100.diskonPersen).toBe(0.12);
      expect(res100.total).toBe(6600000);
    });

    it("correctly sorts unsorted diskonVolume arrays descending by minJumlah", () => {
      const unsortedConfig: KalkulatorConfig = {
        ...testConfig,
        diskonVolume: [
          { minJumlah: 50, diskon: 0.08 },
          { minJumlah: 100, diskon: 0.12 },
          { minJumlah: 24, diskon: 0.05 },
        ],
      };

      const res = hitungEstimasi(
        { produk: "Kaos", bahan: "Katun Combed", branding: "Sablon", jumlah: 100 },
        unsortedConfig
      );
      expect(res.diskonPersen).toBe(0.12);
    });

    it("safely handles malformed and NaN minJumlah values in diskonVolume", () => {
      const malformedConfig: KalkulatorConfig = {
        ...testConfig,
        diskonVolume: [
          { minJumlah: Number.NaN, diskon: 0.5 },
          { minJumlah: 50, diskon: 0.08 },
          // @ts-expect-error testing malformed tier
          { minJumlah: null, diskon: 0.2 },
          { minJumlah: 24, diskon: 0.05 },
        ],
      };

      const res = hitungEstimasi(
        { produk: "Kaos", bahan: "Katun Combed", branding: "Sablon", jumlah: 50 },
        malformedConfig
      );
      expect(res.diskonPersen).toBe(0.08);
    });
  });

  describe("MOQ threshold detection", () => {
    it("respects explicit moq = 0 so positive quantity is never marked as below MOQ", () => {
      const zeroMoqConfig: KalkulatorConfig = {
        ...testConfig,
        moq: 0,
      };

      const res1 = hitungEstimasi(
        { produk: "Kaos", bahan: "Katun", branding: "Tanpa", jumlah: 1 },
        zeroMoqConfig
      );
      expect(res1.isBelowMoq).toBe(false);
    });
    it("flags isBelowMoq = true when quantity is strictly less than MOQ", () => {
      // moq = 12
      const res10 = hitungEstimasi(
        { produk: "Kaos", bahan: "Katun", branding: "Tanpa", jumlah: 10 },
        testConfig
      );
      expect(res10.isBelowMoq).toBe(true);

      const res11 = hitungEstimasi(
        { produk: "Kaos", bahan: "Katun", branding: "Tanpa", jumlah: 11 },
        testConfig
      );
      expect(res11.isBelowMoq).toBe(true);
    });

    it("flags isBelowMoq = false when quantity meets or exceeds MOQ", () => {
      const res12 = hitungEstimasi(
        { produk: "Kaos", bahan: "Katun", branding: "Tanpa", jumlah: 12 },
        testConfig
      );
      expect(res12.isBelowMoq).toBe(false);

      const res13 = hitungEstimasi(
        { produk: "Kaos", bahan: "Katun", branding: "Tanpa", jumlah: 13 },
        testConfig
      );
      expect(res13.isBelowMoq).toBe(false);
    });
  });

  describe("defensive input handling and robustness", () => {
    it("safely handles zero quantity by returning zero amounts and isBelowMoq = true", () => {
      const res = hitungEstimasi(
        { produk: "Kaos", bahan: "Katun", branding: "Tanpa", jumlah: 0 },
        testConfig
      );
      expect(res.total).toBe(0);
      expect(res.rentangMin).toBe(0);
      expect(res.rentangMax).toBe(0);
      expect(res.diskonPersen).toBe(0);
      expect(res.isBelowMoq).toBe(true);
    });

    it("safely handles negative quantity by clamping to zero", () => {
      const res = hitungEstimasi(
        { produk: "Kaos", bahan: "Katun", branding: "Tanpa", jumlah: -25 },
        testConfig
      );
      expect(res.total).toBe(0);
      expect(res.rentangMin).toBe(0);
      expect(res.rentangMax).toBe(0);
      expect(res.isBelowMoq).toBe(true);
    });

    it("safely handles NaN and non-finite quantities", () => {
      const resNaN = hitungEstimasi(
        { produk: "Kaos", bahan: "Katun", branding: "Tanpa", jumlah: Number.NaN },
        testConfig
      );
      expect(resNaN.total).toBe(0);
      expect(resNaN.isBelowMoq).toBe(true);

      const resInf = hitungEstimasi(
        { produk: "Kaos", bahan: "Katun", branding: "Tanpa", jumlah: Number.POSITIVE_INFINITY },
        testConfig
      );
      expect(resInf.total).toBe(0);
      expect(resInf.isBelowMoq).toBe(true);
    });

    it("falls back to 0 for unknown product, fabric, or branding without throwing", () => {
      const res = hitungEstimasi(
        {
          produk: "NonExistentProduct",
          bahan: "NonExistentFabric",
          branding: "NonExistentBranding",
          jumlah: 20,
        },
        testConfig
      );
      expect(res.hargaDasar).toBe(0);
      expect(res.tambahanBahan).toBe(0);
      expect(res.tambahanBranding).toBe(0);
      expect(res.estimasiPerPcs).toBe(0);
      expect(res.total).toBe(0);
    });

    it("works seamlessly with live demoGenerikConfig", () => {
      const res = hitungEstimasi(
        {
          produk: "PDH",
          bahan: "Drill",
          branding: "Bordir",
          jumlah: 24,
        },
        demoGenerikConfig.kalkulator
      );
      // PDH: 120.000 + Drill: 15.000 + Bordir: 20.000 = 155.000 / pcs
      // 24 pcs -> 5% discount -> 155.000 * 24 * 0.95 = 3.534.000
      // 10% range: Min 3.180.600, Max 3.887.400
      expect(res.estimasiPerPcs).toBe(155000);
      expect(res.diskonPersen).toBe(0.05);
      expect(res.total).toBe(3534000);
      expect(res.rentangMin).toBe(3180600);
      expect(res.rentangMax).toBe(3887400);
      expect(res.isBelowMoq).toBe(false);
    });
  });
});

describe("formatRentangEstimasi", () => {
  it("formats range in standard Indonesian Rupiah with space separator", () => {
    expect(formatRentangEstimasi(3105000, 3795000)).toBe("Rp 3.105.000 - Rp 3.795.000");
  });

  it("handles zero range values", () => {
    expect(formatRentangEstimasi(0, 0)).toBe("Rp 0 - Rp 0");
  });
});

