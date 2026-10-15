import type { BusinessConfig } from "./types";

// IMPORTANT: Prospect slug must be randomized and hard to guess (e.g. 'konveksi-jaya-x7k9') to prevent unauthorized discovery between prospects.
export const prospectTemplateConfig: BusinessConfig = {
  slug: "konveksi-contoh-x7k9",
  nama: "Konveksi Contoh",
  tagline: "Spesialis Seragam dan Busana Berkualitas di Solo Raya",
  logo: undefined,
  warnaUtama: "#0f766e",
  wa: "6281234567890",
  alamat: "Jl. Alamat Usaha No. 12, Solo Raya",
  petaUrl: "https://maps.google.com/?q=Sukoharjo",
  jamOperasional: "Senin - Sabtu: 08.00 - 17.00 WIB",
  kategori: [
    {
      nama: "PDH",
      deskripsi: "Kemeja dinas harian dan seragam kerja kantor berbahan drill berkualitas.",
      foto: ["/images/placeholders/pdh.svg"],
      hargaMulai: 120000,
    },
  ],
  kalkulator: {
    produk: {
      PDH: 120000,
    },
    bahan: {
      Katun: 0,
      Drill: 15000,
    },
    branding: {
      Tanpa: 0,
      Sablon: 10000,
      Bordir: 20000,
    },
    diskonVolume: [
      { minJumlah: 24, diskon: 0.05 },
      { minJumlah: 50, diskon: 0.08 },
    ],
    rentangPersen: 10,
    moq: 12,
  },
  produksi: {
    bahan: ["Katun", "Drill"],
    lamaPengerjaan: "10 sampai 14 hari kerja",
    alurPesan: [
      "Konsultasi desain",
      "Konfirmasi harga dan DP",
      "Produksi",
      "Pengambilan atau pengiriman",
    ],
  },
  galeri: [],
  ulasan: [],
};

