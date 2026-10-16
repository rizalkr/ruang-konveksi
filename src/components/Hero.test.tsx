import { describe, expect, it } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { Hero } from "./Hero";
import { demoGenerikConfig } from "@/config/demo-generik";
import { calculateContrastRatio, getAccessibleTextColor, getRelativeLuminance } from "@/lib/color";

describe("Hero Component (Product Editorial)", () => {
  it("renders Product Editorial headline, eyebrow, and value proposition description", () => {
    const html = renderToString(<Hero config={demoGenerikConfig} />);
    expect(html).toContain("KONVEKSI CUSTOM · SOLO RAYA");
    expect(html).toContain("Seragam &amp; Apparel untuk Kebutuhan Bisnis");
    expect(html).toContain(demoGenerikConfig.tagline);
    expect(html).toContain(`aria-label="Profil ${demoGenerikConfig.nama}"`);
  });

  it("renders WhatsApp CTA button with 'Konsultasi via WhatsApp' and accessible colors", () => {
    const html = renderToString(<Hero config={demoGenerikConfig} />);

    // Button label
    expect(html).toContain("Konsultasi via WhatsApp");

    // Font size check: text-[19px] font-bold sm:text-xl
    expect(html).toContain("text-[19px]");
    expect(html).toContain("font-bold");
    expect(html).toContain("sm:text-xl");

    // Accessible colors
    const expectedTextColor = getAccessibleTextColor(demoGenerikConfig.warnaUtama);
    expect(expectedTextColor).toBe("#ffffff");
    expect(html).toContain(`background-color:${demoGenerikConfig.warnaUtama}`);
    expect(html).toContain(`color:${expectedTextColor}`);

    // Contrast ratio check
    const bgLum = getRelativeLuminance(demoGenerikConfig.warnaUtama);
    const textLum = getRelativeLuminance(expectedTextColor);
    const contrastRatio = calculateContrastRatio(bgLum, textLum);
    expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio).toBeGreaterThan(11.0);

    // Link attributes
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain("wa.me/6281529964902");

    // Focus indicator accessibility
    expect(html).toContain("focus-visible:outline-neutral-900");
  });

  it("renders Katalog CTA button targeting #katalog with 'Lihat Katalog' text", () => {
    const html = renderToString(<Hero config={demoGenerikConfig} />);

    // Anchor link
    expect(html).toContain('href="#katalog"');
    expect(html).toContain("Lihat Katalog");

    // Typography & Contrast check
    expect(html).toContain("text-neutral-800");
    const whiteLum = getRelativeLuminance("#ffffff");
    const textLum = getRelativeLuminance("#262626");
    const contrastRatio = calculateContrastRatio(whiteLum, textLum);
    expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio).toBeGreaterThan(14.0);

    // Focus indicator
    expect(html).toContain("focus-visible:outline-neutral-900");
  });

  it("does not render production summary metrics in Hero section", () => {
    const html = renderToString(<Hero config={demoGenerikConfig} />);

    expect(html).not.toContain(`MOQ ${demoGenerikConfig.kalkulator.moq} pcs`);
    expect(html).not.toContain("Lama Pengerjaan");
    expect(html).not.toContain("Bahan Pilihan");
  });

  it("renders high quality studio apparel editorial visual in the right column", () => {
    const html = renderToString(<Hero config={demoGenerikConfig} />);

    expect(html).toContain('src="/images/hero-apparel.jpg"');
    expect(html).toContain('/images/hero-apparel.webp');
    expect(html).toContain(`alt="Contoh produk apparel dan seragam kerja ${demoGenerikConfig.nama}"`);
    expect(html).toContain('loading="eager"');
  });

  it("adapts text color for light brand colors to preserve contrast >= 3.0:1", () => {
    const lightBrandConfig = {
      ...demoGenerikConfig,
      warnaUtama: "#facc15", // Yellow-400
    };
    const html = renderToString(<Hero config={lightBrandConfig} />);
    expect(html).toContain("background-color:#facc15");
    expect(html).toContain("color:#0f172a"); // Dark slate selected for yellow

    const bgLum = getRelativeLuminance("#facc15");
    const textLum = getRelativeLuminance("#0f172a");
    const contrastRatio = calculateContrastRatio(bgLum, textLum);
    expect(contrastRatio).toBeGreaterThanOrEqual(3.0);
  });
});
