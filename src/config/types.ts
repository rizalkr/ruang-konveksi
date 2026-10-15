export type KategoriItem = {
  nama: string;
  deskripsi: string;
  foto: string[];
  hargaMulai: number;
};

export type DiskonVolume = {
  minJumlah: number;
  diskon: number;
};

export type KalkulatorConfig = {
  produk: Record<string, number>;
  bahan: Record<string, number>;
  branding: Record<string, number>;
  diskonVolume: DiskonVolume[];
  rentangPersen: number;
  moq: number;
};

export type ProduksiConfig = {
  bahan: string[];
  lamaPengerjaan: string;
  alurPesan: string[];
};

export type UlasanItem = {
  nama: string;
  teks: string;
};

export type BusinessConfig = {
  slug: string;
  nama: string;
  tagline: string;
  logo?: string;
  warnaUtama: string;
  warnaAksen?: string;
  wa: string; // International format without +
  alamat: string;
  petaUrl?: string;
  jamOperasional?: string;
  kategori: KategoriItem[];
  kalkulator: KalkulatorConfig;
  produksi: ProduksiConfig;
  galeri: string[];
  ulasan?: UlasanItem[];
};

