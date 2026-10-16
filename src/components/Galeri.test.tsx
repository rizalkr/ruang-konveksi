import { describe, expect, it } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { Galeri } from "./Galeri";
import { demoGenerikConfig } from "@/config/demo-generik";

// Dedicated test fixtures
const fixtureEmptyImages: string[] = [];
const fixtureSampleImages: string[] = [
  "/images/placeholders/pdh.svg",
  "/images/placeholders/kaos.svg",
  "/images/placeholders/jaket.svg",
  "/images/placeholders/jersey.svg",
];

describe("Galeri Component", () => {
  it("renders null when image array is empty", () => {
    const html = renderToString(
      <Galeri foto={fixtureEmptyImages} namaBisnis="Konveksi Maju" />
    );
    expect(html).toBe("");
  });

  it("renders null when image array is undefined", () => {
    const html = renderToString(
      <Galeri foto={undefined} namaBisnis="Konveksi Maju" />
    );
    expect(html).toBe("");
  });

  it("renders gallery section, heading, and business name when images are present", () => {
    const html = renderToString(
      <Galeri foto={fixtureSampleImages} namaBisnis="Konveksi Maju" />
    );
    expect(html).toContain('id="galeri"');
    expect(html).toContain("Galeri Hasil Produksi");
    expect(html).toContain("Konveksi Maju");
    expect(html).toContain("Dokumentasi pengerjaan pesanan");
  });

  it("renders all images with loading='lazy' attribute for mobile data performance", () => {
    const html = renderToString(
      <Galeri foto={fixtureSampleImages} namaBisnis="Konveksi Maju" />
    );

    // Verify all 4 images are present with loading="lazy"
    for (const src of fixtureSampleImages) {
      expect(html).toContain(`src="${src}"`);
    }

    const lazyMatches = html.match(/loading="lazy"/g);
    expect(lazyMatches).toHaveLength(fixtureSampleImages.length);
  });

  it("provides accessible and descriptive alt text for each image", () => {
    const html = renderToString(
      <Galeri foto={fixtureSampleImages} namaBisnis="Konveksi Maju" />
    );

    fixtureSampleImages.forEach((_, idx) => {
      expect(html).toContain(`alt="Dokumentasi hasil produksi Konveksi Maju ${idx + 1}"`);
    });
  });

  it("uses responsive mobile-first grid layout classes", () => {
    const html = renderToString(
      <Galeri foto={fixtureSampleImages} namaBisnis="Konveksi Maju" />
    );
    expect(html).toContain("grid-cols-2");
    expect(html).toContain("sm:grid-cols-3");
    expect(html).toContain("lg:grid-cols-4");
  });

  it("renders null when image array contains only empty or whitespace strings", () => {
    const html = renderToString(
      <Galeri foto={["", "   "]} namaBisnis="Konveksi Maju" />
    );
    expect(html).toBe("");
  });

  it("renders all images with explicit dimensions and async decoding for layout stability", () => {
    const html = renderToString(
      <Galeri foto={fixtureSampleImages} namaBisnis="Konveksi Maju" />
    );

    expect(html).toContain('width="400"');
    expect(html).toContain('height="400"');
    expect(html).toContain('decoding="async"');
  });

  it("provides fallback business name when namaBisnis is empty or whitespace", () => {
    const html = renderToString(
      <Galeri foto={fixtureSampleImages} namaBisnis="   " />
    );
    expect(html).toContain("Workshop Konveksi");
    expect(html).toContain('alt="Dokumentasi hasil produksi Workshop Konveksi 1"');
  });

  it("wraps each image thumbnail in an interactive button with accessible label", () => {
    const html = renderToString(
      <Galeri foto={fixtureSampleImages} namaBisnis="Konveksi Maju" />
    );

    expect(html).toContain('type="button"');
    fixtureSampleImages.forEach((_, idx) => {
      expect(html).toContain(
        `aria-label="Buka foto dokumentasi hasil produksi Konveksi Maju ${idx + 1}"`
      );
    });
  });

  it("renders expanded gallery list with 8 to 12 images from demo configuration", () => {
    const html = renderToString(
      <Galeri foto={demoGenerikConfig.galeri} namaBisnis={demoGenerikConfig.nama} />
    );

    expect(demoGenerikConfig.galeri.length).toBeGreaterThanOrEqual(8);
    expect(demoGenerikConfig.galeri.length).toBeLessThanOrEqual(12);

    for (const src of demoGenerikConfig.galeri) {
      expect(html).toContain(`src="${src}"`);
    }
  });

  it("contains no emoticons or emojis in the rendered output", () => {
    const html = renderToString(
      <Galeri foto={fixtureSampleImages} namaBisnis="Konveksi Maju" />
    );
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(emojiRegex.test(html)).toBe(false);
  });
});

