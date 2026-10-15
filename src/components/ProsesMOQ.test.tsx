import { describe, expect, it } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { ProsesMOQ } from "./ProsesMOQ";
import { demoGenerikConfig } from "@/config/demo-generik";
import type { ProduksiConfig } from "@/config/types";

describe("ProsesMOQ Component", () => {
  it("renders MOQ and turnaround time directly from props", () => {
    const html = renderToString(
      <ProsesMOQ
        produksi={demoGenerikConfig.produksi}
        moq={demoGenerikConfig.kalkulator.moq}
      />,
    );

    expect(html).toContain("12 pcs");
    expect(html).toContain("10 sampai 14 hari kerja");
    expect(html).toContain("Minimal Pemesanan");
    expect(html).toContain("Lama Pengerjaan");
  });

  it("renders fabric options as inline pill chips from config", () => {
    const html = renderToString(
      <ProsesMOQ
        produksi={demoGenerikConfig.produksi}
        moq={demoGenerikConfig.kalkulator.moq}
      />,
    );

    for (const bahan of demoGenerikConfig.produksi.bahan) {
      expect(html).toContain(bahan);
    }
    expect(html).toContain("rounded-full");
    expect(html).toContain("4 Pilihan Bahan");
  });

  it("renders order workflow steps dynamically from produksi.alurPesan", () => {
    const html = renderToString(
      <ProsesMOQ
        produksi={demoGenerikConfig.produksi}
        moq={demoGenerikConfig.kalkulator.moq}
      />,
    );

    expect(demoGenerikConfig.produksi.alurPesan).toHaveLength(4);
    demoGenerikConfig.produksi.alurPesan.forEach((step, idx) => {
      expect(html).toContain(step);
      expect(html).toContain(`Langkah ${idx + 1}`);
    });
  });

  it("is truly data-driven and supports custom number of steps and fabrics", () => {
    const customProduksi: ProduksiConfig = {
      bahan: ["Fleece", "Baby Terry", "Taslan"],
      lamaPengerjaan: "7 hari kerja ekspres",
      alurPesan: [
        "Kirim mock-up via chat",
        "Persetujuan sampel & DP 50%",
        "Produksi massal dan QC",
        "Pelunasan invoice",
        "Pengiriman via kurir",
      ],
    };

    const html = renderToString(<ProsesMOQ produksi={customProduksi} moq={24} />);

    // Custom MOQ & turnaround
    expect(html).toContain("24 pcs");
    expect(html).toContain("7 hari kerja ekspres");

    // Custom fabrics
    expect(html).toContain("Fleece");
    expect(html).toContain("Baby Terry");
    expect(html).toContain("Taslan");
    expect(html).toContain("3 Pilihan Bahan");

    // All 5 custom steps rendered
    expect(html).toContain("Kirim mock-up via chat");
    expect(html).toContain("Persetujuan sampel &amp; DP 50%");
    expect(html).toContain("Produksi massal dan QC");
    expect(html).toContain("Pelunasan invoice");
    expect(html).toContain("Pengiriman via kurir");
    expect(html).toContain("Langkah 5");
  });

  it("handles empty fabrics and empty workflow steps gracefully", () => {
    const emptyProduksi: ProduksiConfig = {
      bahan: [],
      lamaPengerjaan: "Fleksibel",
      alurPesan: [],
    };

    const html = renderToString(<ProsesMOQ produksi={emptyProduksi} moq={12} />);
    expect(html).toContain("Bahan kain dapat disesuaikan dengan kebutuhan pesanan.");
    expect(html).toContain("Alur pemesanan akan dikonfirmasi langsung oleh tim kami melalui WhatsApp.");
  });
});
