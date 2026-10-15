import { describe, expect, it } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { Footer } from "./Footer";
import { demoGenerikConfig } from "@/config/demo-generik";

describe("Footer Component", () => {
  const sections = [
    { id: "beranda", label: "Beranda" },
    { id: "katalog", label: "Katalog Produk" },
    { id: "spesifikasi-produksi", label: "Proses Produksi" },
    { id: "kalkulator", label: "Kalkulator" },
    { id: "galeri", label: "Galeri" },
    { id: "lokasi", label: "Lokasi" },
  ];

  it("renders business identity (name and tagline) from configuration", () => {
    const html = renderToString(
      <Footer config={demoGenerikConfig} sections={sections} />
    );

    expect(html).toContain("Rumah Konveksi");
    expect(html).toContain(demoGenerikConfig.tagline);
  });

  it("renders navigation links only for available sections", () => {
    const html = renderToString(
      <Footer config={demoGenerikConfig} sections={sections} />
    );

    expect(html).toContain('href="#katalog"');
    expect(html).toContain("Katalog Produk");
    expect(html).toContain('href="#spesifikasi-produksi"');
    expect(html).toContain("Proses Produksi");
    expect(html).toContain('href="#kalkulator"');
    expect(html).toContain("Kalkulator");

    // Strictly ensure no fictional "Tentang Kami" link
    expect(html).not.toContain("Tentang Kami");
  });

  it("renders contact WhatsApp link with normalized number", () => {
    const html = renderToString(
      <Footer config={demoGenerikConfig} sections={sections} />
    );

    expect(html).toContain("https://wa.me/6281529964902?text=");
  });

  it("renders address and operating hours when available", () => {
    const html = renderToString(
      <Footer config={demoGenerikConfig} sections={sections} />
    );

    expect(html).toContain(demoGenerikConfig.alamat);
    expect(html).toContain(demoGenerikConfig.jamOperasional!);
  });

  it("omits Google Maps link when petaUrl is undefined", () => {
    const html = renderToString(
      <Footer config={demoGenerikConfig} sections={sections} />
    );

    expect(html).not.toContain("Buka di Google Maps");
  });

  it("renders Google Maps link when a valid petaUrl is provided", () => {
    const configWithMap = {
      ...demoGenerikConfig,
      petaUrl: "https://maps.google.com/?q=workshop",
    };
    const html = renderToString(
      <Footer config={configWithMap} sections={sections} />
    );

    expect(html).toContain("Buka di Google Maps");
    expect(html).toContain("https://maps.google.com/?q=workshop");
  });

  it("renders dynamic current year in copyright notice", () => {
    const html = renderToString(
      <Footer config={demoGenerikConfig} sections={sections} />
    );

    const currentYear = new Date().getFullYear().toString();
    expect(html).toContain(currentYear);
    expect(html).toContain("Rumah Konveksi. Semua hak dilindungi.");
  });

  it("renders mandated Nalar Solusi Digital demo attribution exclusively in the footer", () => {
    const html = renderToString(
      <Footer config={demoGenerikConfig} sections={sections} />
    );

    const expectedAttribution =
      "Website demo ini merupakan properti Nalar Solusi Digital dan dibuat untuk keperluan demonstrasi. Informasi bisnis yang ditampilkan dapat berupa data contoh.";
    expect(html).toContain(expectedAttribution);
  });
});

