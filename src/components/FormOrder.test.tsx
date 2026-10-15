import { describe, expect, it } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { FormOrder } from "./FormOrder";

describe("FormOrder Component", () => {
  const baseProps = {
    phone: "08123456789",
    namaBisnis: "Konveksi Solo Prima",
    warnaUtama: "#2563eb",
    produk: "Kaos",
    bahan: "Katun Combed",
    branding: "Sablon",
    jumlah: 50,
    estimasiString: "Rp 3.105.000 - Rp 3.795.000",
  };

  it("renders accessible labels connected to form inputs via htmlFor and id", () => {
    const html = renderToString(<FormOrder {...baseProps} />);

    expect(html).toContain('for="order-nama"');
    expect(html).toContain('id="order-nama"');
    expect(html).toContain('for="order-ukuran"');
    expect(html).toContain('id="order-ukuran"');
    expect(html).toContain('for="order-catatan"');
    expect(html).toContain('id="order-catatan"');
  });

  it("renders live order summary with current specifications", () => {
    const html = renderToString(<FormOrder {...baseProps} />);

    expect(html).toContain("Ringkasan Spesifikasi:");
    expect(html).toContain("Kaos");
    expect(html).toContain("Katun Combed");
    expect(html).toContain("Sablon");
    expect(html).toContain("50 pcs");
    expect(html).toContain("Rp 3.105.000 - Rp 3.795.000");
  });

  it("ensures input font size is text-base (16px) to avoid iOS auto-zoom", () => {
    const html = renderToString(<FormOrder {...baseProps} />);

    expect(html).toContain("text-base");
    expect(html).toContain("min-h-[48px]");
  });

  it("synthesizes a valid WhatsApp URL with normalized phone and encoded message", () => {
    const html = renderToString(<FormOrder {...baseProps} />);

    // Phone 08123456789 must normalize to 628123456789
    expect(html).toContain("https://wa.me/628123456789?text=");

    // Extract href from rendered HTML
    const hrefMatch = html.match(/href="(https:\/\/wa\.me\/[^"]+)"/);
    expect(hrefMatch).not.toBeNull();

    const decoded = decodeURIComponent(hrefMatch![1]);
    expect(decoded).toContain("Halo Konveksi Solo Prima, saya ingin pesan.");
    expect(decoded).toContain("Produk: Kaos");
    expect(decoded).toContain("Bahan: Katun Combed");
    expect(decoded).toContain("Branding: Sablon");
    expect(decoded).toContain("Jumlah: 50 pcs");
    expect(decoded).toContain("Estimasi dari web: Rp 3.105.000 - Rp 3.795.000");
  });

  it("applies accessible text color based on brand color contrast and provides focus indicators", () => {
    const html = renderToString(<FormOrder {...baseProps} />);

    // #2563eb is dark enough that white (#ffffff) provides higher contrast
    expect(html).toContain("background-color:#2563eb");
    expect(html).toContain("color:#ffffff");
    expect(html).toContain("focus-visible:outline-neutral-900");
    expect(html).toContain("focus-visible:ring-2");
  });
});

