import { describe, expect, it } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { TombolWA } from "./TombolWA";
import { calculateContrastRatio, getAccessibleTextColor, getRelativeLuminance } from "@/lib/color";

describe("TombolWA Component", () => {
  const sampleWa = "6285191294341";
  const sampleNama = "Konveksi Sukoharjo";
  const sampleDarkBrand = "#1e3a8a"; // Navy
  const sampleLightBrand = "#facc15"; // Yellow-400

  it("renders floating WhatsApp CTA with normalized wa.me URL and secure attributes", () => {
    const html = renderToString(
      <TombolWA wa={sampleWa} namaBisnis={sampleNama} warnaUtama={sampleDarkBrand} />
    );

    expect(html).toContain('id="tombol-wa-floating"');
    expect(html).toContain(`https://wa.me/${sampleWa}?text=`);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("has mobile-only responsive classes and fixed viewport coordinates", () => {
    const html = renderToString(
      <TombolWA wa={sampleWa} namaBisnis={sampleNama} warnaUtama={sampleDarkBrand} />
    );

    expect(html).toContain("fixed");
    expect(html).toContain("bottom-4");
    expect(html).toContain("right-4");
    expect(html).toContain("sm:hidden");
  });

  it("satisfies touch target requirements of at least 48x48px (56x56px used)", () => {
    const html = renderToString(
      <TombolWA wa={sampleWa} namaBisnis={sampleNama} warnaUtama={sampleDarkBrand} />
    );

    // h-14 w-14 corresponds to 56px x 56px in Tailwind CSS (56 >= 48)
    expect(html).toContain("h-14");
    expect(html).toContain("w-14");
  });

  it("provides accessible aria-label mentioning the business name", () => {
    const html = renderToString(
      <TombolWA wa={sampleWa} namaBisnis={sampleNama} warnaUtama={sampleDarkBrand} />
    );

    expect(html).toContain(`aria-label="Hubungi WhatsApp ${sampleNama}"`);
  });

  it("calculates high contrast text/icon colors conforming to WCAG standards for dark brand colors", () => {
    const html = renderToString(
      <TombolWA wa={sampleWa} namaBisnis={sampleNama} warnaUtama={sampleDarkBrand} />
    );

    const expectedText = getAccessibleTextColor(sampleDarkBrand);
    expect(expectedText).toBe("#ffffff");
    expect(html).toContain(`background-color:${sampleDarkBrand}`);
    expect(html).toContain(`color:${expectedText}`);

    const bgLum = getRelativeLuminance(sampleDarkBrand);
    const textLum = getRelativeLuminance(expectedText);
    const ratio = calculateContrastRatio(bgLum, textLum);
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });

  it("calculates high contrast text/icon colors conforming to WCAG standards for light brand colors", () => {
    const html = renderToString(
      <TombolWA wa={sampleWa} namaBisnis={sampleNama} warnaUtama={sampleLightBrand} />
    );

    const expectedText = getAccessibleTextColor(sampleLightBrand);
    expect(expectedText).toBe("#0f172a");
    expect(html).toContain(`background-color:${sampleLightBrand}`);
    expect(html).toContain(`color:${expectedText}`);

    const bgLum = getRelativeLuminance(sampleLightBrand);
    const textLum = getRelativeLuminance(expectedText);
    const ratio = calculateContrastRatio(bgLum, textLum);
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });

  it("provides high contrast focus outline indicator", () => {
    const html = renderToString(
      <TombolWA wa={sampleWa} namaBisnis={sampleNama} warnaUtama={sampleDarkBrand} />
    );
    expect(html).toContain("focus-visible:outline-neutral-900");
  });

  it("renders in unoccluded accessible state without tabIndex restriction on initial mount", () => {
    const html = renderToString(
      <TombolWA wa={sampleWa} namaBisnis={sampleNama} warnaUtama={sampleDarkBrand} />
    );

    // When not occluded, aside container should not have aria-hidden="true" and a tag should not have tabIndex="-1"
    expect(html).not.toMatch(/<aside[^>]+aria-hidden="true"/);
    expect(html).not.toContain('tabindex="-1"');
    expect(html).toContain("opacity-100");
  });

  it("contains no emoticons or emojis in the rendered output", () => {
    const html = renderToString(
      <TombolWA wa={sampleWa} namaBisnis={sampleNama} warnaUtama={sampleDarkBrand} />
    );
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(emojiRegex.test(html)).toBe(false);
  });
});

