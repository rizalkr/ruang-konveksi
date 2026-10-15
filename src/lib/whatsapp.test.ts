import { describe, expect, it } from "vitest";
import {
  createInquiryWhatsAppUrl,
  createOrderWhatsAppUrl,
  formatOrderMessage,
  normalizePhoneNumber,
} from "./whatsapp";

describe("normalizePhoneNumber", () => {
  it("normalizes standard Indonesian local format starting with 0", () => {
    expect(normalizePhoneNumber("08123456789")).toBe("628123456789");
  });

  it("normalizes international format with leading +", () => {
    expect(normalizePhoneNumber("+628123456789")).toBe("628123456789");
  });

  it("preserves international format already without +", () => {
    expect(normalizePhoneNumber("628123456789")).toBe("628123456789");
  });

  it("strips whitespace, dashes, and parentheses", () => {
    expect(normalizePhoneNumber("+62 812-3456-7890")).toBe("6281234567890");
    expect(normalizePhoneNumber("0812 (345) 6789")).toBe("628123456789");
  });

  it("normalizes numbers starting with 8 by prepending country code 62", () => {
    expect(normalizePhoneNumber("8123456789")).toBe("628123456789");
    expect(normalizePhoneNumber("857-1234-5678")).toBe("6285712345678");
  });
});

describe("formatOrderMessage", () => {
  it("formats order message matching PRD Section 8 schema exactly", () => {
    const message = formatOrderMessage({
      namaBisnis: "Konveksi Jaya",
      produk: "Kaos",
      bahan: "Katun Combed",
      branding: "Sablon",
      jumlah: 50,
      ukuran: "S: 10, M: 20, L: 20",
      catatan: "Kerah warna hitam",
      estimasi: "Rp 3.105.000 - Rp 3.795.000",
    });

    const expected = [
      "Halo Konveksi Jaya, saya ingin pesan.",
      "Produk: Kaos",
      "Bahan: Katun Combed",
      "Branding: Sablon",
      "Jumlah: 50 pcs",
      "Ukuran: S: 10, M: 20, L: 20",
      "Catatan: Kerah warna hitam",
      "Estimasi dari web: Rp 3.105.000 - Rp 3.795.000",
    ].join("\n");

    expect(message).toBe(expected);
  });

  it("falls back to '-' when catatan is empty or whitespace", () => {
    const msgEmpty = formatOrderMessage({
      namaBisnis: "Konveksi Jaya",
      produk: "Kaos",
      bahan: "Katun Combed",
      branding: "Sablon",
      jumlah: 24,
      ukuran: "L: 24",
      catatan: "",
      estimasi: "Rp 1.500.000 - Rp 1.800.000",
    });
    expect(msgEmpty).toContain("Catatan: -");

    const msgWhitespace = formatOrderMessage({
      namaBisnis: "Konveksi Jaya",
      produk: "Kaos",
      bahan: "Katun Combed",
      branding: "Sablon",
      jumlah: 24,
      ukuran: "L: 24",
      catatan: "   ",
      estimasi: "Rp 1.500.000 - Rp 1.800.000",
    });
    expect(msgWhitespace).toContain("Catatan: -");

    const msgUndefined = formatOrderMessage({
      namaBisnis: "Konveksi Jaya",
      produk: "Kaos",
      bahan: "Katun Combed",
      branding: "Sablon",
      jumlah: 24,
      ukuran: "L: 24",
      estimasi: "Rp 1.500.000 - Rp 1.800.000",
    });
    expect(msgUndefined).toContain("Catatan: -");
  });

  it("falls back to '-' when ukuran is empty or whitespace", () => {
    const msgEmptySize = formatOrderMessage({
      namaBisnis: "Konveksi Jaya",
      produk: "PDH",
      bahan: "Drill",
      branding: "Bordir",
      jumlah: 12,
      ukuran: "",
      estimasi: "Rp 1.500.000 - Rp 1.800.000",
    });
    expect(msgEmptySize).toContain("Ukuran: -");
  });

  it("falls back to '-' when estimasi is empty or whitespace", () => {
    const msgEmptyEst = formatOrderMessage({
      namaBisnis: "Konveksi Jaya",
      produk: "PDH",
      bahan: "Drill",
      branding: "Bordir",
      jumlah: 12,
      ukuran: "L: 12",
      estimasi: "",
    });
    expect(msgEmptyEst).toContain("Estimasi dari web: -");

    const msgWhitespaceEst = formatOrderMessage({
      namaBisnis: "Konveksi Jaya",
      produk: "PDH",
      bahan: "Drill",
      branding: "Bordir",
      jumlah: 12,
      ukuran: "L: 12",
      estimasi: "   ",
    });
    expect(msgWhitespaceEst).toContain("Estimasi dari web: -");
  });
});

describe("createOrderWhatsAppUrl", () => {
  it("generates valid wa.me URL with correctly encoded query parameters", () => {
    const url = createOrderWhatsAppUrl({
      phone: "08123456789",
      namaBisnis: "Konveksi & Tailor #1",
      produk: "Jaket Bomber",
      bahan: "Drill",
      branding: "Bordir",
      jumlah: 30,
      ukuran: "M: 15, L: 15",
      catatan: "Warna navy & abu-abu; resleting YKK",
      estimasi: "Rp 4.000.000 - Rp 4.500.000",
    });

    expect(url.startsWith("https://wa.me/628123456789?text=")).toBe(true);

    const queryText = url.replace("https://wa.me/628123456789?text=", "");
    const decoded = decodeURIComponent(queryText);

    expect(decoded).toContain("Halo Konveksi & Tailor #1, saya ingin pesan.");
    expect(decoded).toContain("Catatan: Warna navy & abu-abu; resleting YKK");
    expect(decoded).toContain("Produk: Jaket Bomber");
  });

  it("safely handles special characters and newlines without corrupting URL", () => {
    const url = createOrderWhatsAppUrl({
      phone: "+62800000000",
      namaBisnis: "Demo & Sample",
      produk: "Kaos #1",
      bahan: "Katun 100%",
      branding: "Sablon Rubber & Plastisol",
      jumlah: 100,
      ukuran: "All Size",
      catatan: "Desain file: link.com?a=1&b=2#ref",
      estimasi: "Rp 6.000.000",
    });

    const parsed = new URL(url);
    expect(parsed.hostname).toBe("wa.me");
    expect(parsed.pathname).toBe("/62800000000");

    const textParam = parsed.searchParams.get("text");
    expect(textParam).not.toBeNull();
    expect(textParam).toContain("Kaos #1");
    expect(textParam).toContain("link.com?a=1&b=2#ref");
  });
});

describe("createInquiryWhatsAppUrl", () => {
  it("creates general inquiry wa.me URL with greeting", () => {
    const url = createInquiryWhatsAppUrl("08571234567", "Konveksi Berkah");
    expect(url.startsWith("https://wa.me/628571234567?text=")).toBe(true);

    const parsed = new URL(url);
    expect(parsed.searchParams.get("text")).toBe(
      "Halo Konveksi Berkah, saya ingin tanya tentang pemesanan konveksi.",
    );
  });
});

