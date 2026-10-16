import { describe, expect, it } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { Navbar } from "./Navbar";
import { demoGenerikConfig } from "@/config/demo-generik";

describe("Navbar Component", () => {
  const sections = [
    { id: "beranda", label: "Beranda" },
    { id: "katalog", label: "Katalog Produk" },
    { id: "spesifikasi-produksi", label: "Proses Produksi" },
    { id: "kalkulator", label: "Kalkulator" },
    { id: "galeri", label: "Galeri" },
    { id: "lokasi", label: "Lokasi" },
  ];

  it("renders business name and logo when configured", () => {
    const html = renderToString(
      <Navbar config={demoGenerikConfig} sections={sections} />
    );

    expect(html).toContain("Rumah Konveksi");
    expect(html).toContain('src="/pp-nalar.jpeg"');
    expect(html).toContain('alt="Logo Rumah Konveksi"');
  });

  it("renders text wordmark cleanly when logo is undefined", () => {
    const noLogoConfig = { ...demoGenerikConfig, logo: undefined };
    const html = renderToString(
      <Navbar config={noLogoConfig} sections={sections} />
    );

    expect(html).toContain("Rumah Konveksi");
    expect(html).not.toContain('alt="Logo Rumah Konveksi"');
  });

  it("renders navigation links only for available sections (never fictional sections)", () => {
    const html = renderToString(
      <Navbar config={demoGenerikConfig} sections={sections} />
    );

    expect(html).toContain('href="#katalog"');
    expect(html).toContain("Katalog Produk");
    expect(html).toContain('href="#spesifikasi-produksi"');
    expect(html).toContain("Proses Produksi");
    expect(html).toContain('href="#kalkulator"');
    expect(html).toContain("Kalkulator");
    expect(html).toContain('href="#galeri"');
    expect(html).toContain("Galeri");
    expect(html).toContain('href="#lokasi"');
    expect(html).toContain("Lokasi");

    // Strictly ensure no fictional "Tentang Kami" link
    expect(html).not.toContain("Tentang Kami");
  });

  it("omits Galeri link when galeri array is empty", () => {
    const sectionsWithoutGaleri = sections.filter((s) => s.id !== "galeri");
    const html = renderToString(
      <Navbar config={demoGenerikConfig} sections={sectionsWithoutGaleri} />
    );

    expect(html).not.toContain('href="#galeri"');
  });

  it("renders WhatsApp CTA with config phone number", () => {
    const html = renderToString(
      <Navbar config={demoGenerikConfig} sections={sections} />
    );

    expect(html).toContain("https://wa.me/6281529964902?text=");
    expect(html).toContain("Hubungi Kami");
  });

  it("provides accessible mobile menu button with proper ARIA attributes", () => {
    const html = renderToString(
      <Navbar config={demoGenerikConfig} sections={sections} />
    );

    expect(html).toContain('aria-label="Buka menu navigasi"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-controls="mobile-nav-menu"');
  });

  it("sets id='beranda' on header for anchor navigation", () => {
    const html = renderToString(
      <Navbar config={demoGenerikConfig} sections={sections} />
    );

    expect(html).toContain('id="beranda"');
  });

  it("applies mobile glassmorphism with backdrop blur and low-opacity Deep Petrol border", () => {
    const html = renderToString(
      <Navbar config={demoGenerikConfig} sections={sections} />
    );

    expect(html).toContain("max-md:backdrop-blur-xl");
    expect(html).toContain("max-md:border-[#153E46]/10");
    expect(html).toContain("max-md:bg-[#F7F5F0]");
    expect(html).toContain("max-md:supports-[backdrop-filter]:bg-[#F7F5F0]/80");
  });

  it("preserves clean desktop navbar styling and border tokens", () => {
    const html = renderToString(
      <Navbar config={demoGenerikConfig} sections={sections} />
    );

    expect(html).toContain("md:border-mist");
    expect(html).toContain("md:bg-white");
  });

  it("contains no emoticons or emojis in rendered navbar output", () => {
    const html = renderToString(
      <Navbar config={demoGenerikConfig} sections={sections} />
    );

    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(emojiRegex.test(html)).toBe(false);
  });
});

