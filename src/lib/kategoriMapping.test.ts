import { describe, expect, it } from "vitest";
import { mapKategoriToProduk } from "./kategoriMapping";

describe("mapKategoriToProduk helper", () => {
  const configuredKeys = [
    "PDH",
    "Kaos",
    "Jaket",
    "Almamater",
    "Wearpack",
    "Jersey",
    "Seragam Sekolah",
  ];

  it("maps exact product names correctly", () => {
    for (const key of configuredKeys) {
      expect(mapKategoriToProduk(key, configuredKeys)).toBe(key);
    }
  });

  it("handles case-insensitivity and extra whitespace", () => {
    expect(mapKategoriToProduk("kaos", configuredKeys)).toBe("Kaos");
    expect(mapKategoriToProduk("  JAKET  ", configuredKeys)).toBe("Jaket");
    expect(mapKategoriToProduk("seragam sekolah", configuredKeys)).toBe(
      "Seragam Sekolah"
    );
  });

  it("maps known aliases correctly to configured keys", () => {
    expect(mapKategoriToProduk("PDH / PDL", configuredKeys)).toBe("PDH");
    expect(mapKategoriToProduk("pdh/pdl", configuredKeys)).toBe("PDH");
    expect(mapKategoriToProduk("Kemeja PDH", configuredKeys)).toBe("PDH");
    expect(mapKategoriToProduk("T-Shirt", configuredKeys)).toBe("Kaos");
    expect(mapKategoriToProduk("Kaos Polo", configuredKeys)).toBe("Kaos");
    expect(mapKategoriToProduk("Hoodie", configuredKeys)).toBe("Jaket");
    expect(mapKategoriToProduk("Jas Almamater", configuredKeys)).toBe(
      "Almamater"
    );
    expect(mapKategoriToProduk("Wearpack Safety", configuredKeys)).toBe(
      "Wearpack"
    );
    expect(mapKategoriToProduk("Jersey Sublim", configuredKeys)).toBe("Jersey");
    expect(mapKategoriToProduk("Seragam Batik", configuredKeys)).toBe(
      "Seragam Sekolah"
    );
  });

  it("returns undefined without guessing when product is not in available keys", () => {
    const limitedKeys = ["Kaos", "Jaket"];
    expect(mapKategoriToProduk("PDH", limitedKeys)).toBeUndefined();
    expect(mapKategoriToProduk("Almamater", limitedKeys)).toBeUndefined();
    expect(mapKategoriToProduk("Wearpack", limitedKeys)).toBeUndefined();
  });

  it("returns undefined for unrecognized or non-clothing categories", () => {
    expect(mapKategoriToProduk("Sepatu Boots", configuredKeys)).toBeUndefined();
    expect(mapKategoriToProduk("Topi Bordir", configuredKeys)).toBeUndefined();
    expect(mapKategoriToProduk("Tas Ransel", configuredKeys)).toBeUndefined();
    expect(mapKategoriToProduk("", configuredKeys)).toBeUndefined();
    expect(mapKategoriToProduk("   ", configuredKeys)).toBeUndefined();
    expect(mapKategoriToProduk(null, configuredKeys)).toBeUndefined();
    expect(mapKategoriToProduk(undefined, configuredKeys)).toBeUndefined();
  });

  it("falls back to canonical check when availableProductKeys is omitted", () => {
    expect(mapKategoriToProduk("Kaos")).toBe("Kaos");
    expect(mapKategoriToProduk("PDH / PDL")).toBe("PDH");
    expect(mapKategoriToProduk("NonExistent")).toBeUndefined();
  });
});

