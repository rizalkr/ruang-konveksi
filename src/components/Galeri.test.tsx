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

describe("Galeri Component (Single-Image Preview)", () => {
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

  it("renders null when image array contains only empty or whitespace strings", () => {
    const html = renderToString(
      <Galeri foto={["", "   "]} namaBisnis="Konveksi Maju" />
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

  it("renders only ONE preview image on the main page rather than a multi-image grid", () => {
    const html = renderToString(
      <Galeri foto={fixtureSampleImages} namaBisnis="Konveksi Maju" />
    );

    // Only the first valid image is rendered as the preview banner
    expect(html).toContain(`src="${fixtureSampleImages[0]}"`);
    expect(html).not.toContain(`src="${fixtureSampleImages[1]}"`);
    expect(html).not.toContain(`src="${fixtureSampleImages[2]}"`);
    expect(html).not.toContain(`src="${fixtureSampleImages[3]}"`);

    // Verify exactly one <img> tag rendered in the section
    const imgMatches = html.match(/<img\s/g);
    expect(imgMatches).toHaveLength(1);
  });

  it("renders preview image with loading='lazy' and decoding='async'", () => {
    const html = renderToString(
      <Galeri foto={fixtureSampleImages} namaBisnis="Konveksi Maju" />
    );

    expect(html).toContain('loading="lazy"');
    expect(html).toContain('decoding="async"');
    expect(html).toContain('alt="Preview dokumentasi hasil produksi Konveksi Maju"');
  });

  it("renders an accessible interactive button wrapping the preview area", () => {
    const html = renderToString(
      <Galeri foto={fixtureSampleImages} namaBisnis="Konveksi Maju" />
    );

    expect(html).toContain('type="button"');
    expect(html).toContain(
      'aria-label="Buka galeri foto Konveksi Maju. Tersedia 4 foto dokumentasi."'
    );
  });

  it("displays 'Lihat Semua Foto' CTA badge with the total photo count", () => {
    const html = renderToString(
      <Galeri foto={fixtureSampleImages} namaBisnis="Konveksi Maju" />
    );

    expect(html).toContain("Lihat Semua Foto (4 Foto)");
  });

  it("omits count suffix in CTA badge when only a single image is configured", () => {
    const html = renderToString(
      <Galeri foto={["/images/products/pdh.webp"]} namaBisnis="Konveksi Maju" />
    );

    expect(html).toContain("Lihat Semua Foto");
    expect(html).not.toContain("(1 Foto)");
  });

  it("renders demo configuration preview with 10 total images represented in badge", () => {
    const html = renderToString(
      <Galeri foto={demoGenerikConfig.galeri} namaBisnis={demoGenerikConfig.nama} />
    );

    expect(demoGenerikConfig.galeri.length).toBe(10);
    expect(html).toContain("Lihat Semua Foto (10 Foto)");
    expect(html).toContain(`src="${demoGenerikConfig.galeri[0]}"`);
  });

  it("provides fallback business name when namaBisnis is empty or whitespace", () => {
    const html = renderToString(
      <Galeri foto={fixtureSampleImages} namaBisnis="   " />
    );
    expect(html).toContain("Workshop Konveksi");
    expect(html).toContain('alt="Preview dokumentasi hasil produksi Workshop Konveksi"');
  });

  it("contains no emoticons or emojis in the rendered output", () => {
    const html = renderToString(
      <Galeri foto={fixtureSampleImages} namaBisnis="Konveksi Maju" />
    );
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(emojiRegex.test(html)).toBe(false);
  });
});
