import { describe, expect, it } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { KatalogKategori, isValidImagePath, resolveImageSrc } from "./KatalogKategori";
import { demoGenerikConfig } from "@/config/demo-generik";
import type { KategoriItem } from "@/config/types";

describe("KatalogKategori Component", () => {
  it("renders all 7 categories from demo configuration with correct titles and descriptions", () => {
    const html = renderToString(<KatalogKategori kategori={demoGenerikConfig.kategori} />);

    expect(demoGenerikConfig.kategori).toHaveLength(7);
    for (const item of demoGenerikConfig.kategori) {
      expect(html).toContain(item.nama);
      expect(html).toContain(item.deskripsi);
    }
  });


  it("renders formatted starting prices in 'Mulai Rp ... / pcs' format", () => {
    const html = renderToString(<KatalogKategori kategori={demoGenerikConfig.kategori} />);

    expect(html).toContain("Rp 120.000"); // PDH
    expect(html).toContain("Rp 55.000"); // Kaos
    expect(html).toContain("Rp 135.000"); // Jaket
    expect(html).toContain("Rp 150.000"); // Almamater
    expect(html).toContain("Rp 140.000"); // Wearpack
    expect(html).toContain("Rp 90.000"); // Jersey
    expect(html).toContain("Rp 85.000"); // Seragam Sekolah
    expect(html).toContain("/ pcs");
    expect(html).toContain("Mulai");
  });

  it("renders CTA buttons targeting #kalkulator with 'Hitung Estimasi' text and min-h-[48px]", () => {
    const html = renderToString(<KatalogKategori kategori={demoGenerikConfig.kategori} />);

    expect(html).toContain('href="#kalkulator"');
    expect(html).toContain("Hitung Estimasi");
    expect(html).toContain("min-h-[48px]");
  });

  it("renders <img> tag using the first photo from array with lazy loading", () => {
    const html = renderToString(<KatalogKategori kategori={demoGenerikConfig.kategori} />);

    expect(html).toContain('loading="lazy"');
    expect(html).toContain('src="/images/placeholders/pdh.svg"');
    expect(html).toContain('alt="Contoh produk PDH"');
    expect(html).toContain('src="/images/placeholders/kaos.svg"');
  });

  it("validates image path syntax correctly with isValidImagePath", () => {
    // Valid root-relative images
    expect(isValidImagePath("/images/placeholders/pdh.svg")).toBe(true);
    expect(isValidImagePath("/images/custom.png")).toBe(true);
    expect(isValidImagePath("/uploads/photo.jpg")).toBe(true);
    expect(isValidImagePath("/uploads/photo.jpeg")).toBe(true);
    expect(isValidImagePath("/uploads/photo.webp?v=1")).toBe(true);

    // Valid remote URLs
    expect(isValidImagePath("https://images.unsplash.com/photo-123")).toBe(true);
    expect(isValidImagePath("http://cdn.example.com/asset.svg")).toBe(true);

    // Invalid paths
    expect(isValidImagePath("pdh.svg")).toBe(false); // missing leading slash
    expect(isValidImagePath("images/placeholders/kaos.svg")).toBe(false);
    expect(isValidImagePath("/docs/specs.pdf")).toBe(false); // non-image extension
    expect(isValidImagePath("not-a-path")).toBe(false);
    expect(isValidImagePath("")).toBe(false);
    expect(isValidImagePath("   ")).toBe(false);
    expect(isValidImagePath("javascript:alert(1)")).toBe(false);
    expect(isValidImagePath(null)).toBe(false);
    expect(isValidImagePath(123)).toBe(false);
  });

  it("safely falls back to local fallback SVG when photo array is empty or path is invalid", () => {
    expect(resolveImageSrc([])).toBe("/images/placeholders/fallback.svg");
    expect(resolveImageSrc(undefined)).toBe("/images/placeholders/fallback.svg");
    expect(resolveImageSrc(null)).toBe("/images/placeholders/fallback.svg");
    expect(resolveImageSrc([""])).toBe("/images/placeholders/fallback.svg");
    expect(resolveImageSrc(["   "])).toBe("/images/placeholders/fallback.svg");
    expect(resolveImageSrc(["invalid-relative-path.jpg"])).toBe("/images/placeholders/fallback.svg");
    expect(resolveImageSrc(["/docs/manual.pdf"])).toBe("/images/placeholders/fallback.svg");
    expect(resolveImageSrc([123 as unknown as string])).toBe("/images/placeholders/fallback.svg");
    expect(resolveImageSrc([null as unknown as string])).toBe("/images/placeholders/fallback.svg");

    // Valid paths
    expect(resolveImageSrc(["/custom/shirt.png"])).toBe("/custom/shirt.png");
    expect(resolveImageSrc("/images/placeholders/kaos.svg")).toBe("/images/placeholders/kaos.svg");
    expect(resolveImageSrc(["https://cdn.example.com/item.svg"])).toBe("https://cdn.example.com/item.svg");

    const customCategory: KategoriItem[] = [
      {
        nama: "Topi",
        deskripsi: "Topi baseball dan snapback bordir timbul.",
        foto: ["invalid-path-without-slash.png"],
        hargaMulai: 25000,
      },
    ];

    const html = renderToString(<KatalogKategori kategori={customCategory} />);
    expect(html).toContain('src="/images/placeholders/fallback.svg"');
    expect(html).toContain('alt="Contoh produk Topi"');
  });

  it("handles empty category list gracefully", () => {
    const html = renderToString(<KatalogKategori kategori={[]} />);
    expect(html).toContain("Belum ada kategori produk yang ditampilkan.");
    expect(html).toContain("Katalog Produk");
  });

  it("handles undefined category gracefully", () => {
    const html = renderToString(<KatalogKategori kategori={undefined} />);
    expect(html).toContain("Belum ada kategori produk yang ditampilkan.");
  });
});
