import { describe, expect, it } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { PemesananContainer } from "./PemesananContainer";
import { demoGenerikConfig } from "@/config/demo-generik";
import { PemesananProvider } from "@/context/PemesananContext";

describe("PemesananContainer Component", () => {
  it("renders with id='kalkulator' to support smooth anchor scrolling", () => {
    const html = renderToString(<PemesananContainer config={demoGenerikConfig} />);

    expect(html).toContain('id="kalkulator"');
    expect(html).toContain('aria-label="Kalkulator Estimasi &amp; Formulir Pemesanan"');
  });

  it("renders both Kalkulator simulation and FormOrder dispatch controls", () => {
    const html = renderToString(<PemesananContainer config={demoGenerikConfig} />);

    // Kalkulator elements
    expect(html).toContain("Simulasi Biaya Produksi");
    expect(html).toContain("Kisaran Estimasi Total");
    expect(html).toContain("Estimasi, harga final dikonfirmasi via WhatsApp.");

    // FormOrder elements
    expect(html).toContain("Formulir Pemesanan");
    expect(html).toContain("Ringkasan Spesifikasi:");
    expect(html).toContain("Kirim Pesanan via WhatsApp");
  });

  it("initializes state from demo configuration safely", () => {
    const html = renderToString(<PemesananContainer config={demoGenerikConfig} />);

    // Default Kaos + Katun Combed + Sablon, 12 pcs (MOQ)
    // 75.000 * 12 = 900.000 (0% discount, since < 24)
    // 10% range: 810.000 - 990.000
    expect(html).toContain("Rp 810.000 - Rp 990.000");
    expect(html).toContain("12 pcs");
  });

  it("renders correctly within PemesananProvider", () => {
    const html = renderToString(
      <PemesananProvider>
        <PemesananContainer config={demoGenerikConfig} />
      </PemesananProvider>
    );

    expect(html).toContain('id="kalkulator"');
    expect(html).toContain("Simulasi Biaya Produksi");
    expect(html).toContain("Formulir Pemesanan");
  });

  it("contains no emoticons or emojis in rendered output", () => {
    const html = renderToString(<PemesananContainer config={demoGenerikConfig} />);
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(emojiRegex.test(html)).toBe(false);
  });
});

