import { describe, expect, it } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { Hero } from "./Hero";
import { demoGenerikConfig } from "@/config/demo-generik";
import { calculateContrastRatio, getAccessibleTextColor, getRelativeLuminance } from "@/lib/color";

describe("Hero Component", () => {
  it("renders business name and tagline correctly", () => {
    const html = renderToString(<Hero config={demoGenerikConfig} />);
    expect(html).toContain("Rumah Konveksi");
    expect(html).toContain("Konveksi Seragam, Kaos, Jaket, dan Busana Berkualitas di Solo Raya");
  });

  it("renders WhatsApp CTA button with correct typography (>= 18.67px) and accessible colors", () => {
    const html = renderToString(<Hero config={demoGenerikConfig} />);

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
    expect(contrastRatio).toBeGreaterThanOrEqual(3.0); // WCAG Large Text
    expect(contrastRatio).toBeGreaterThanOrEqual(4.5); // Also satisfies normal text
    expect(contrastRatio).toBeGreaterThan(10.0);

    // Link attributes
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain("wa.me/6281529964902");

    // Focus indicator accessibility
    expect(html).toContain("focus-visible:outline-neutral-900");
  });

  it("renders Estimasi CTA button with correct typography (>= 18.67px) and anchor link", () => {
    const html = renderToString(<Hero config={demoGenerikConfig} />);

    // Anchor link
    expect(html).toContain('href="#kalkulator"');

    // Font size check
    expect(html).toContain("text-neutral-800");

    // Secondary contrast check: #262626 on #ffffff
    const whiteLum = getRelativeLuminance("#ffffff");
    const textLum = getRelativeLuminance("#262626");
    const contrastRatio = calculateContrastRatio(whiteLum, textLum);
    expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio).toBeGreaterThan(14.0);

    // Focus indicator
    expect(html).toContain("focus-visible:outline-neutral-900");
  });

  it("renders logo when present, and omits logo container when undefined", () => {
    const withoutLogo = renderToString(
      <Hero config={{ ...demoGenerikConfig, logo: undefined }} />
    );
    expect(withoutLogo).not.toContain("<img");

    const withLogo = renderToString(<Hero config={demoGenerikConfig} />);
    expect(withLogo).toContain("<img");
    expect(withLogo).toContain('src="/pp-nalar.jpeg"');
    expect(withLogo).toContain('alt="Logo Rumah Konveksi"');
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

