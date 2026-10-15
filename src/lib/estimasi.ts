import type { KalkulatorConfig } from "@/config/types";
import { formatRupiah } from "./format";

export type EstimasiInput = {
  produk: string;
  bahan: string;
  branding: string;
  jumlah: number;
};

export type EstimasiResult = {
  hargaDasar: number;
  tambahanBahan: number;
  tambahanBranding: number;
  estimasiPerPcs: number;
  diskonPersen: number;
  total: number;
  rentangMin: number;
  rentangMax: number;
  isBelowMoq: boolean;
};

/**
 * Calculates price estimate, volume discount, price range, and MOQ status
 * according to PRD Section 7.
 *
 * Formulas:
 * estimasiPerPcs = hargaDasar + tambahanBahan + tambahanBranding
 * total = Math.round(estimasiPerPcs * jumlah * (1 - diskonVolume))
 * rentangMin = Math.round(total * (1 - rentangPersen / 100))
 * rentangMax = Math.round(total * (1 + rentangPersen / 100))
 * isBelowMoq = jumlah < moq
 */
export function hitungEstimasi(
  input: EstimasiInput,
  config: KalkulatorConfig
): EstimasiResult {
  // Validate and sanitize config
  const produkMap = config?.produk ?? {};
  const bahanMap = config?.bahan ?? {};
  const brandingMap = config?.branding ?? {};
  const moq =
    typeof config?.moq === "number" && Number.isFinite(config.moq) && config.moq >= 0
      ? config.moq
      : 12;
  const rentangPersen =
    typeof config?.rentangPersen === "number" && Number.isFinite(config.rentangPersen)
      ? Math.max(0, config.rentangPersen)
      : 10;

  // Resolve base prices and add-ons (default to 0 if not found)
  const hargaDasar = produkMap[input?.produk] ?? 0;
  const tambahanBahan = bahanMap[input?.bahan] ?? 0;
  const tambahanBranding = brandingMap[input?.branding] ?? 0;
  const estimasiPerPcs = hargaDasar + tambahanBahan + tambahanBranding;

  // Guard against non-numeric, negative, or zero quantity
  const rawJumlah =
    typeof input?.jumlah === "number" && Number.isFinite(input.jumlah)
      ? Math.floor(input.jumlah)
      : 0;
  const validJumlah = Math.max(0, rawJumlah);

  // Sub-MOQ detection: strictly jumlah < moq
  const isBelowMoq = validJumlah < moq;

  if (validJumlah <= 0) {
    return {
      hargaDasar,
      tambahanBahan,
      tambahanBranding,
      estimasiPerPcs,
      diskonPersen: 0,
      total: 0,
      rentangMin: 0,
      rentangMax: 0,
      isBelowMoq,
    };
  }

  // Safely filter and sort volume discounts descending by minJumlah before applying the highest applicable tier
  const diskonTiers = Array.isArray(config?.diskonVolume)
    ? config.diskonVolume.filter(
        (t) =>
          typeof t?.minJumlah === "number" &&
          Number.isFinite(t.minJumlah) &&
          t.minJumlah >= 0
      )
    : [];
  diskonTiers.sort((a, b) => b.minJumlah - a.minJumlah);

  let diskonPersen = 0;
  const applicableTier = diskonTiers.find((tier) => validJumlah >= tier.minJumlah);
  if (
    applicableTier &&
    typeof applicableTier.diskon === "number" &&
    Number.isFinite(applicableTier.diskon)
  ) {
    diskonPersen = Math.max(0, Math.min(1, applicableTier.diskon));
  }

  // Execute PRD formulas
  const total = Math.round(estimasiPerPcs * validJumlah * (1 - diskonPersen));
  const rentangMin = Math.round(total * (1 - rentangPersen / 100));
  const rentangMax = Math.round(total * (1 + rentangPersen / 100));

  return {
    hargaDasar,
    tambahanBahan,
    tambahanBranding,
    estimasiPerPcs,
    diskonPersen,
    total,
    rentangMin,
    rentangMax,
    isBelowMoq,
  };
}

/**
 * Formats estimated range string (e.g. "Rp 3.105.000 - Rp 3.795.000").
 */
export function formatRentangEstimasi(rentangMin: number, rentangMax: number): string {
  return `${formatRupiah(rentangMin)} - ${formatRupiah(rentangMax)}`;
}

