/**
 * Formats a numeric value into standard Indonesian Rupiah currency string.
 * Normalizes non-breaking spaces and ensures consistent "Rp [angka]" representation.
 * Safely handles non-finite numbers (NaN, Infinity, null, undefined) and negative zero by defaulting to "Rp 0".
 */
export function formatRupiah(amount: number): string {
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return "Rp 0";
  }

  // Normalize negative zero to positive zero to avoid "-Rp 0"
  const cleanAmount = amount === 0 ? 0 : amount;

  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(cleanAmount);

  // Normalize all non-breaking spaces (U+00A0 and U+202F) and multiple spaces to a single space
  let normalized = formatted.replace(/[\u00a0\u202f\s]+/g, " ").trim();

  // Ensure consistent "Rp " prefix across all ICU and runtime variations
  if (normalized.startsWith("Rp") && !normalized.startsWith("Rp ")) {
    normalized = normalized.replace(/^Rp/, "Rp ");
  } else if (normalized.startsWith("-Rp") && !normalized.startsWith("-Rp ")) {
    normalized = normalized.replace(/^-Rp/, "-Rp ");
  }

  return normalized;
}
