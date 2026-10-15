import { describe, expect, it } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { Lokasi } from "./Lokasi";

describe("Lokasi Component", () => {
  const sampleAlamat = "Jl. Contoh Industri Tekstil No. 12, Grogol, Sukoharjo";
  const sampleJam = "Senin - Sabtu: 08.00 - 17.00 WIB";
  const samplePetaUrl = "https://maps.google.com/?q=Sukoharjo";

  it("renders workshop address and operational hours", () => {
    const html = renderToString(
      <Lokasi alamat={sampleAlamat} jamOperasional={sampleJam} />
    );
    expect(html).toContain('id="lokasi"');
    expect(html).toContain("Lokasi Workshop &amp; Jam Operasional");
    expect(html).toContain(sampleAlamat);
    expect(html).toContain(sampleJam);
  });

  it("renders Google Maps button when petaUrl is provided with secure attributes and 48px target", () => {
    const html = renderToString(
      <Lokasi
        alamat={sampleAlamat}
        jamOperasional={sampleJam}
        petaUrl={samplePetaUrl}
      />
    );
    expect(html).toContain("Buka di Google Maps");
    expect(html).toContain(`href="${samplePetaUrl}"`);
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain("min-h-[48px]");
  });

  it("omits Google Maps button when petaUrl is undefined", () => {
    const html = renderToString(
      <Lokasi alamat={sampleAlamat} jamOperasional={sampleJam} petaUrl={undefined} />
    );
    expect(html).not.toContain("Buka di Google Maps");
  });

  it("omits Google Maps button when petaUrl is an empty string", () => {
    const html = renderToString(
      <Lokasi alamat={sampleAlamat} jamOperasional={sampleJam} petaUrl="   " />
    );
    expect(html).not.toContain("Buka di Google Maps");
  });

  it("omits Google Maps button when petaUrl has unsafe non-http protocol", () => {
    const html = renderToString(
      <Lokasi
        alamat={sampleAlamat}
        jamOperasional={sampleJam}
        petaUrl="javascript:alert('xss')"
      />
    );
    expect(html).not.toContain("Buka di Google Maps");
  });

  it("handles missing alamat gracefully with fallback text", () => {
    const html = renderToString(
      <Lokasi alamat="   " jamOperasional={sampleJam} />
    );
    expect(html).toContain("Konfirmasi alamat workshop melalui WhatsApp");
  });

  it("handles missing jamOperasional gracefully with fallback text", () => {
    const html = renderToString(
      <Lokasi alamat={sampleAlamat} jamOperasional={undefined} />
    );
    expect(html).toContain("Konfirmasi jam buka melalui WhatsApp");
  });

  it("contains no emoticons or emojis in the rendered output", () => {
    const html = renderToString(
      <Lokasi
        alamat={sampleAlamat}
        jamOperasional={sampleJam}
        petaUrl={samplePetaUrl}
      />
    );
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(emojiRegex.test(html)).toBe(false);
  });
});

