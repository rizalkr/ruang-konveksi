# PRD — Demo Web Konveksi : Ruang Konveksi

*Nalar Solusi Digital · Draf v0.1 · 15 Oktober 2026*

## 1. Ringkasan

Demo web konveksi adalah satu situs contoh yang dipakai sebagai alat pitch ke pemilik konveksi di Solo Raya (terutama Sukoharjo). Demo ini menunjukkan bahwa web bisa menyelesaikan masalah harian konveksi: pertanyaan WhatsApp yang berulang, kesulitan menghitung estimasi harga, dan kurangnya bukti kredibilitas. Satu demo generik dipersonalisasi per prospek lewat satu file konfigurasi, lalu dikirim sebagai link lewat WhatsApp.

## 2. Latar belakang dan masalah

Dari data leads, konveksi adalah sektor dengan prospek terbanyak di Tier 1 (18 dari 26 bisnis). Sebagian besar punya ulasan Google yang banyak tetapi tidak punya website atau hanya mengandalkan Instagram/Linktree. Masalah yang ingin diselesaikan:

- Pelanggan bertanya hal yang sama berulang di WhatsApp: model apa saja, harga, minimal order (MOQ), bahan, lama produksi.
- Pelanggan sulit membayangkan kisaran biaya sebelum bertanya.
- Pesanan masuk dalam format yang tidak teratur (jumlah, ukuran, desain tercecer di chat).
- Tanpa website, kredibilitas hanya bertumpu pada ulasan Google dan media sosial.

## 3. Tujuan dan metrik keberhasilan

**Tujuan produk:** demo yang meyakinkan, cepat dipersonalisasi, dan gratis biaya server.

**Tujuan bisnis:** mendapat balasan dan minat dari pemilik konveksi pada batch uji pertama.

| Metrik | Target (usulan, tinjau ulang setelah batch 1) |
|---|---|
| Waktu personalisasi satu prospek | di bawah 30 menit |
| Skor performa mobile (Lighthouse) | 90 ke atas |
| Demo terbuka normal di HP Android kelas menengah | ya |
| Balasan dari prospek pada batch 1 | dicatat dan dibandingkan antar sektor, tanpa target angka dulu |

## 4. Pengguna

1. **Pemilik konveksi (pembeli jasa kita).** Melihat demo lewat link WhatsApp, biasanya dari HP. Perlu langsung paham manfaatnya dalam beberapa detik.
2. **Calon pelanggan konveksi (pengguna akhir situs).** Mencari seragam, kaos, jaket, atau jersey. Ingin tahu model, kisaran harga, dan cara memesan.
3. **Kamu sebagai pembuat.** Perlu membuat dan mengirim demo baru dengan cepat.

## 5. Ruang lingkup

**Termasuk (MVP):**

- Halaman demo per prospek di rute `/demo/[slug]`, statis.
- Hero, katalog per kategori, info MOQ/bahan/lama produksi, kalkulator estimasi, form order yang membuka WhatsApp, galeri, kutipan ulasan, lokasi, tombol WhatsApp melayang.
- Konfigurasi data bisnis dalam satu file per prospek.

**Tidak termasuk (untuk sekarang):**

- CMS, login, database, keranjang, pembayaran online, pelacakan pesanan.
- Bahasa selain Indonesia.
- Nama dan palet brand Nalar Solusi Digital di demo, agar fokus ke bisnis prospek.
- Paket harga jasa; harga disampaikan lewat chat.
- Domain dan email kantor (add-on bila diperlukan, bukan bagian penawaran awal).

## 6. Kebutuhan fungsional

| ID | Kebutuhan | Kriteria selesai |
|---|---|---|
| FR-1 | Halaman demo dibangun dari file konfigurasi berdasarkan slug | Slug tidak dikenal menampilkan halaman 404 |
| FR-2 | Hero berisi nama bisnis, tagline, dan tombol WA | Tombol membuka chat WA ke nomor di konfigurasi |
| FR-3 | Katalog per kategori (PDH, kaos, jaket, almamater, wearpack, jersey, seragam sekolah; bisa dikurangi atau ditambah per bisnis) | Tiap kategori menampilkan foto, deskripsi, harga mulai |
| FR-4 | Bagian info produksi: MOQ, bahan, lama pengerjaan, alur pesan | Isi berasal dari konfigurasi |
| FR-5 | Kalkulator estimasi | Lihat bagian 7 |
| FR-6 | Form order: nama, jenis produk, jumlah, ukuran, catatan desain | Tombol kirim membuka WA dengan pesan terisi (bagian 8) |
| FR-7 | Galeri hasil produksi | Responsif, memuat lazy |
| FR-8 | Kutipan ulasan pelanggan | Tampil hanya jika ada di konfigurasi |
| FR-9 | Lokasi dan jam operasional | Tautan peta dari konfigurasi |
| FR-10 | Tombol WA melayang di HP | Tidak menutupi konten penting |

## 7. Spesifikasi kalkulator estimasi

**Input:** jenis produk, bahan, jenis branding (sablon, bordir, atau tanpa), jumlah.

**Rumus (parameter semuanya dari konfigurasi):**

`estimasi per pcs = harga dasar produk + tambahan bahan + tambahan branding`

`total = estimasi per pcs x jumlah x (1 - diskon volume)`

**Aturan:**

- Hasil ditampilkan sebagai kisaran (misalnya total dikurangi dan ditambah selisih persen yang diatur di konfigurasi), bukan angka pasti.
- Wajib ada label "Estimasi, harga final dikonfirmasi via WhatsApp".
- Jumlah di bawah MOQ menampilkan peringatan, bukan error.
- Angka pada demo generik adalah contoh; jangan tampil seolah-olah harga resmi bisnis tertentu.

## 8. Format pesan WhatsApp

Tombol kirim form menyusun pesan seperti berikut (di-encode untuk `wa.me`):

```
Halo [Nama Bisnis], saya ingin pesan.
Produk: [jenis]
Bahan: [bahan]
Branding: [sablon/bordir]
Jumlah: [n] pcs
Ukuran: [rincian]
Catatan: [catatan]
Estimasi dari web: [kisaran]
```

## 9. Skema konfigurasi

```ts
type BusinessConfig = {
  slug: string;
  nama: string;
  tagline: string;
  logo?: string;
  warnaUtama: string;
  wa: string;               // format internasional tanpa +
  alamat: string;
  petaUrl?: string;
  jamOperasional?: string;
  kategori: { nama: string; deskripsi: string; foto: string[]; hargaMulai: number }[];
  kalkulator: {
    produk: Record<string, number>;
    bahan: Record<string, number>;
    branding: Record<string, number>;
    diskonVolume: { minJumlah: number; diskon: number }[];
    rentangPersen: number;
    moq: number;
  };
  produksi: { bahan: string[]; lamaPengerjaan: string; alurPesan: string[] };
  galeri: string[];
  ulasan?: { nama: string; teks: string }[];
};
```

## 10. Kebutuhan non-fungsional

- **Mobile-first**, diuji di layar sekitar 360 px.
- **Cepat:** halaman statis (SSG), gambar dioptimasi dan lazy.
- **Tanpa backend:** semua logika di sisi klien.
- **Demo tidak untuk diindeks mesin pencari:** `noindex` dan slug sulit ditebak, supaya demo satu prospek tidak mudah dilihat prospek lain.
- **Aksesibilitas dasar:** kontras warna cukup, label form jelas, bisa dioperasikan dengan keyboard.
- **Tema:** warna utama dan aksen dari konfigurasi.

## 11. Arsitektur dan stack

Next.js (App Router), TypeScript, Tailwind CSS, Lucide React. Deploy ke Vercel; pengembangan lokal cukup lewat npm run dev, tanpa Docker. Project baru dan terpisah dari Rental Profile Lite.

| Item | Keputusan |
|---|---|
| Package manager | npm |
| Runtime | Node.js 22 |
| Framework | Next.js 15 atau lebih baru (App Router), halaman statis, deploy ke Vercel |
| Styling | Tailwind CSS 3.4, tanpa plugin tambahan |
| Ikon | Lucide React |
| Font | Plus Jakarta Sans lewat next/font/google |
| Pengujian | Vitest (devDependency), hanya untuk estimasi.ts dan whatsapp.ts |
| Pengembangan lokal | npm run dev, tanpa Docker |

```
src/
  app/demo/[slug]/page.tsx
  config/        (types, _template, demo-generik, index)
  components/    (Hero, KatalogKategori, Kalkulator, FormOrder,
                  ProsesMOQ, Galeri, Ulasan, Lokasi, TombolWA)
  lib/           (whatsapp.ts, estimasi.ts)
```

## 12. Aset dan konten

- Demo generik memakai data dan foto contoh yang berlisensi atau dibuat sendiri.
- Foto, logo, dan kutipan ulasan bisnis asli hanya dipakai setelah ada izin dari pemiliknya.
- Jangan mengambil foto dari situs lain tanpa izin.

## 13. Tahapan pengerjaan

Setiap tahap selesai lalu menunggu konfirmasi sebelum lanjut.

| Tahap | Isi | Selesai jika |
|---|---|---|
| 1 | Scaffold, tipe konfigurasi, data demo generik, rute `/demo/[slug]`, hero dan layout dasar | Halaman terbuka dari konfigurasi |
| 2 | Katalog per kategori dan info produksi | Semua kategori tampil rapi di HP |
| 3 | Kalkulator dan form order ke WA | Pesan WA terisi benar untuk semua kombinasi input |
| 4 | Galeri, ulasan, lokasi, penyempurnaan mobile, deploy Vercel | Link demo bisa dibuka di HP dan lolos target performa |

## 14. Rencana uji ke prospek (batch 1)

- Sasaran: sekitar 10 bisnis konveksi dari Tier 1A, 1B, dan Tier 2 pada file leads.
- Cara: kirim link demo yang sudah dipersonalisasi lewat WhatsApp, satu pesan awal dan satu follow-up.
- Pencatatan: tanggal kirim, balasan, minat, keberatan yang muncul.
- Hasil dipakai untuk memutuskan apakah demo konveksi diperluas atau pitch diubah.

## 15. Risiko dan mitigasi

| Risiko | Mitigasi |
|---|---|
| Pemilik merasa demo bukan untuk bisnisnya | Personalisasi nama, logo, WA, dan produk lewat konfigurasi sebelum dikirim |
| Estimasi dianggap harga resmi | Label "estimasi" dan angka contoh yang jelas |
| Foto bisnis kurang atau tidak ada | Minta foto dulu atau pakai tata letak yang tidak bergantung pada foto |
| Pesan WA dianggap spam | Pesan singkat, personal, maksimal satu follow-up |
| Demo satu prospek terlihat oleh prospek lain | Slug sulit ditebak dan `noindex` |

## 16. Keputusan

1. Brand Nalar Solusi Digital tidak dipakai di footer demo; demo fokus ke bisnis prospek.
2. Cukup bahasa Indonesia.
3. Harga paket jasa disampaikan lewat chat, tidak dicantumkan di demo.
4. Domain dan email kantor menjadi add-on bila diperlukan, tidak masuk penawaran awal.

## 17. Instruksi untuk agen pelaksana

Tugas pertama agen adalah menulis rencana implementasi, bukan kode. Kode baru ditulis setelah rencana disetujui pemilik produk.

**Alur kerja**

1. Baca seluruh PRD ini, lalu inspeksi isi repo (jika kosong, nyatakan kosong).
2. Tulis rencana implementasi, lalu berhenti dan tunggu persetujuan.
3. Setelah disetujui, kerjakan satu tahap (bagian 13), lalu berhenti dan tunggu konfirmasi sebelum tahap berikutnya.
4. Setelah tiap tahap, laporkan: file yang dibuat atau diubah, ringkasan perubahan, pengujian yang dijalankan beserta hasilnya, masalah yang ditemui, dan usulan tahap berikutnya.

**Isi rencana implementasi**

- Struktur folder dan daftar file per tahap beserta tujuannya.
- Keputusan teknis dan asumsi: versi Next.js, cara membuat halaman statis untuk rute `/demo/[slug]`, cara memuat konfigurasi.
- Cara kerja kalkulator (rumus, penanganan jumlah di bawah MOQ) dan cara menyusun pesan WA.
- Dependensi yang akan ditambahkan beserta alasannya.
- Cara menguji tiap tahap.
- Risiko, hal yang belum jelas, dan pertanyaan untuk pemilik produk.

**Batasan**

- Project baru yang terpisah; jangan menyentuh Rental Profile Lite.
- Hanya Next.js (App Router), TypeScript, Tailwind CSS, dan Lucide React. Dependensi tambahan harus disebut di rencana dan disetujui.
- Tanpa backend, database, CMS, login, atau pembayaran.
- Jangan mengambil foto atau teks dari situs lain. Pakai placeholder yang jelas atau SVG sederhana sampai ada aset berlisensi.
- Jangan mengarang harga; pakai data contoh di bagian 18 dan tandai sebagai contoh.
- Semua teks tampilan berbahasa Indonesia dan tanpa branding Nalar Solusi Digital.
- Jangan membangun fitur di luar ruang lingkup (bagian 5).

**Verifikasi per tahap**

- `lint` dan `build` lolos tanpa error.
- Halaman diuji di lebar 360 px tanpa scroll horizontal.
- Slug yang tidak dikenal menampilkan halaman 404.
- Tahap 3: pesan WA terisi benar untuk semua kombinasi input, dan peringatan muncul saat jumlah di bawah MOQ.

## 18. Data demo generik (contoh)

Semua angka di bawah adalah contoh untuk demo, bukan harga pasar atau harga bisnis tertentu. Nama bisnis dan nomor WA adalah placeholder.

| Item | Nilai contoh |
|---|---|
| Nama bisnis | Nama Konveksi Contoh |
| Nomor WA | 62800000000 |
| Kategori dan harga mulai per pcs (Rp) | PDH 120.000; Kaos 55.000; Jaket 135.000; Almamater 150.000; Wearpack 140.000; Jersey 90.000; Seragam sekolah 85.000 |
| Tambahan bahan per pcs (Rp) | Katun 0; Katun combed 10.000; Drill 15.000; Dry-fit 12.000 |
| Tambahan branding per pcs (Rp) | Tanpa 0; Sablon 10.000; Bordir 20.000 |
| Diskon volume | 24 pcs ke atas 5%; 50 pcs ke atas 8%; 100 pcs ke atas 12% |
| Rentang estimasi | 10% di atas dan di bawah hasil hitung |
| MOQ | 12 pcs |
| Lama pengerjaan | 10 sampai 14 hari kerja |
| Alur pesan | Konsultasi desain; konfirmasi harga dan DP; produksi; pengambilan atau pengiriman |