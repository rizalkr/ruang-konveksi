import type { BusinessConfig } from "./types";

export const demoGenerikConfig: BusinessConfig = {
  slug: "demo-generik",
  nama: "Rumah Konveksi",
  tagline: "Kami melayani pembuatan seragam kerja, kaos custom, jaket, dan berbagai pakaian lainnya dengan pilihan bahan dan desain sesuai kebutuhan.",
  logo: "/pp-nalar.jpeg",
  warnaUtama: "#153E46",
  warnaAksen: "#A94F24",
  wa: "6281529964902",
  alamat: "[Contoh] Alamat workshop konveksi di Solo Raya / Sukoharjo (diisi saat personalisasi prospek)",
  jamOperasional: "Senin - Sabtu: 08.00 - 17.00 WIB",
  kategori: [
    {
      nama: "PDH",
      deskripsi: "Kemeja dinas harian dan seragam kerja kantor berbahan drill berkualitas dan jahitan rapi.",
      foto: ["/images/products/pdh.webp", "/images/products/pdh.jpg"],
      hargaMulai: 120000,
    },
    {
      nama: "Kaos",
      deskripsi: "Kaos komunitas, event, atau promosi berbahan katun adem dengan sablon berkualitas presisi.",
      foto: [
        "/images/products/kaos.webp",
        "/images/products/kaos-crewneck.webp",
        "/images/products/kaos.jpg",
      ],
      hargaMulai: 55000,
    },
    {
      nama: "Jaket",
      deskripsi: "Jaket parka, bomber, varsity, dan hoodie seragam untuk instansi dan komunitas.",
      foto: [
        "/images/products/jaket.webp",
        "/images/products/jaket-bomber.webp",
        "/images/products/jaket.jpg",
      ],
      hargaMulai: 135000,
    },
    {
      nama: "Almamater",
      deskripsi: "Jas almamater kampus dan organisasi dengan lapisan furing penuh dan bordir emblem rapi.",
      foto: ["/images/products/almamater.webp", "/images/products/almamater.jpg"],
      hargaMulai: 150000,
    },
    {
      nama: "Wearpack",
      deskripsi: "Pakaian kerja lapangan dan safety wearpack standar bengkel atau industri.",
      foto: [
        "/images/products/wearpack.webp",
        "/images/products/wearpack-industrial.webp",
        "/images/products/wearpack.jpg",
      ],
      hargaMulai: 140000,
    },
    {
      nama: "Jersey",
      deskripsi: "Jersey olahraga sublimasi penuh untuk futsal, sepak bola, badminton, dan lari.",
      foto: ["/images/products/jersey.webp", "/images/products/jersey.jpg"],
      hargaMulai: 90000,
    },
    {
      nama: "Seragam Sekolah",
      deskripsi: "Seragam batik, pramuka, dan harian sekolah tingkat SD hingga SMA.",
      foto: ["/images/products/seragam-sekolah.webp", "/images/products/seragam-sekolah.jpg"],
      hargaMulai: 85000,
    },
  ],
  kalkulator: {
    produk: {
      PDH: 120000,
      Kaos: 55000,
      Jaket: 135000,
      Almamater: 150000,
      Wearpack: 140000,
      Jersey: 90000,
      "Seragam Sekolah": 85000,
    },
    bahan: {
      Katun: 0,
      "Katun Combed": 10000,
      Drill: 15000,
      "Dry-fit": 12000,
    },
    branding: {
      Tanpa: 0,
      Sablon: 10000,
      Bordir: 20000,
    },
    diskonVolume: [
      { minJumlah: 24, diskon: 0.05 },
      { minJumlah: 50, diskon: 0.08 },
      { minJumlah: 100, diskon: 0.12 },
    ],
    rentangPersen: 10,
    moq: 12,
  },
  produksi: {
    bahan: ["Katun", "Katun Combed", "Drill", "Dry-fit"],
    lamaPengerjaan: "10 sampai 14 hari kerja",
    alurPesan: [
      "Konsultasi desain",
      "Konfirmasi harga dan DP",
      "Produksi",
      "Pengambilan atau pengiriman",
    ],
  },
  galeri: [
    "/images/products/pdh.webp",
    "/images/products/kaos.webp",
    "/images/products/kaos-crewneck.webp",
    "/images/products/jaket.webp",
    "/images/products/jaket-bomber.webp",
    "/images/products/almamater.webp",
    "/images/products/wearpack.webp",
    "/images/products/wearpack-industrial.webp",
    "/images/products/jersey.webp",
    "/images/products/seragam-sekolah.webp",
  ],
  ulasan: [
    {
      nama: "Budi Santoso",
      teks: "Pesan 50 pcs kaos untuk acara komunitas, jahitan rapi dan selesai tepat waktu sebelum hari H.",
    },
    {
      nama: "Siti Rahmawati",
      teks: "Kemeja PDH kantor hasilnya sangat memuaskan, bordir logo rapi dan bahannya adem.",
    },
    {
      nama: "Agus Pratama",
      teks: "Pelayanan ramah dan responsif lewat WhatsApp. Estimasi harga di awal sangat membantu perencanaan anggaran.",
    },
  ],
};
