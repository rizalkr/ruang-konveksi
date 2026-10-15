import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { Kalkulator } from "./Kalkulator";
import { hitungEstimasi } from "@/lib/estimasi";
import { demoGenerikConfig } from "@/config/demo-generik";

describe("Kalkulator Component", () => {
  const kalkulatorConfig = demoGenerikConfig.kalkulator;
  const dummyResult = hitungEstimasi(
    {
      produk: "Kaos",
      bahan: "Katun Combed",
      branding: "Sablon",
      jumlah: 50,
    },
    kalkulatorConfig
  );

  it("renders all form control selectors with accessible labels", () => {
    const html = renderToString(
      <Kalkulator
        kalkulatorConfig={kalkulatorConfig}
        produk="Kaos"
        bahan="Katun Combed"
        branding="Sablon"
        jumlah={50}
        onProdukChange={vi.fn()}
        onBahanChange={vi.fn()}
        onBrandingChange={vi.fn()}
        onJumlahChange={vi.fn()}
        estimasiResult={dummyResult}
      />
    );

    // Connected labels and inputs
    expect(html).toContain('for="kalkulator-produk"');
    expect(html).toContain('id="kalkulator-produk"');
    expect(html).toContain('for="kalkulator-bahan"');
    expect(html).toContain('id="kalkulator-bahan"');
    expect(html).toContain('for="kalkulator-branding"');
    expect(html).toContain('id="kalkulator-branding"');
    expect(html).toContain('for="kalkulator-jumlah"');
    expect(html).toContain('id="kalkulator-jumlah"');
  });

  it("displays live price range formatted in Rupiah", () => {
    const html = renderToString(
      <Kalkulator
        kalkulatorConfig={kalkulatorConfig}
        produk="Kaos"
        bahan="Katun Combed"
        branding="Sablon"
        jumlah={50}
        onProdukChange={vi.fn()}
        onBahanChange={vi.fn()}
        onBrandingChange={vi.fn()}
        onJumlahChange={vi.fn()}
        estimasiResult={dummyResult}
      />
    );

    expect(html).toContain("Rp 3.105.000 - Rp 3.795.000");
    expect(html).toContain("Estimasi per pcs:");
    expect(html).toContain("Rp 75.000");
    expect(html).toContain("Diskon volume 8%");
  });

  it("renders the mandatory visible disclaimer", () => {
    const html = renderToString(
      <Kalkulator
        kalkulatorConfig={kalkulatorConfig}
        produk="Kaos"
        bahan="Katun Combed"
        branding="Sablon"
        jumlah={50}
        onProdukChange={vi.fn()}
        onBahanChange={vi.fn()}
        onBrandingChange={vi.fn()}
        onJumlahChange={vi.fn()}
        estimasiResult={dummyResult}
      />
    );

    expect(html).toContain("Estimasi, harga final dikonfirmasi via WhatsApp.");
  });

  it("renders sub-MOQ notice when jumlah < moq without blocking", () => {
    const subMoqResult = hitungEstimasi(
      {
        produk: "Kaos",
        bahan: "Katun Combed",
        branding: "Sablon",
        jumlah: 10,
      },
      kalkulatorConfig
    );

    const html = renderToString(
      <Kalkulator
        kalkulatorConfig={kalkulatorConfig}
        produk="Kaos"
        bahan="Katun Combed"
        branding="Sablon"
        jumlah={10}
        onProdukChange={vi.fn()}
        onBahanChange={vi.fn()}
        onBrandingChange={vi.fn()}
        onJumlahChange={vi.fn()}
        estimasiResult={subMoqResult}
      />
    );

    expect(html).toContain(
      `Ketentuan untuk pesanan di bawah batas minimum pemesanan (${kalkulatorConfig.moq} pcs) dikonfirmasi via WhatsApp.`
    );
    // Ensure form controls remain enabled (not disabled)
    expect(html).not.toContain("disabled");
  });

  it("does not render sub-MOQ notice when jumlah meets or exceeds MOQ", () => {
    const html = renderToString(
      <Kalkulator
        kalkulatorConfig={kalkulatorConfig}
        produk="Kaos"
        bahan="Katun Combed"
        branding="Sablon"
        jumlah={50}
        onProdukChange={vi.fn()}
        onBahanChange={vi.fn()}
        onBrandingChange={vi.fn()}
        onJumlahChange={vi.fn()}
        estimasiResult={dummyResult}
      />
    );

    expect(html).not.toContain(
      `Ketentuan untuk pesanan di bawah batas minimum pemesanan (${kalkulatorConfig.moq} pcs) dikonfirmasi via WhatsApp.`
    );
  });

  it("ensures touch targets and inputs conform to >= 48px and >= 16px text size", () => {
    const html = renderToString(
      <Kalkulator
        kalkulatorConfig={kalkulatorConfig}
        produk="Kaos"
        bahan="Katun Combed"
        branding="Sablon"
        jumlah={50}
        onProdukChange={vi.fn()}
        onBahanChange={vi.fn()}
        onBrandingChange={vi.fn()}
        onJumlahChange={vi.fn()}
        estimasiResult={dummyResult}
      />
    );

    expect(html).toContain("min-h-[48px]");
    expect(html).toContain("text-base");
    // Quick quantity chips meet >= 44px mobile touch target with focus ring
    expect(html).toContain("min-h-[44px]");
    expect(html).toContain("min-w-[56px]");
    expect(html).toContain("focus-visible:outline");
  });
});

