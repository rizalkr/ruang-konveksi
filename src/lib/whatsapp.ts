/**
 * Helper utilities for generating WhatsApp URLs and structured inquiry/order messages.
 */

export type OrderMessageParams = {
  phone: string;
  namaBisnis: string;
  nama?: string;
  produk: string;
  bahan: string;
  branding: string;
  jumlah: number | string;
  ukuran: string;
  catatan?: string;
  estimasi: string;
};

/**
 * Normalizes phone numbers to international format without the leading '+' or '0'.
 * Indonesian numbers starting with '0' are converted to '62'.
 * Leading '+' is stripped.
 * Non-digit characters (spaces, dashes, parens) are stripped.
 */
export function normalizePhoneNumber(phone: string): string {
  let cleaned = phone.trim().replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+")) {
    cleaned = cleaned.slice(1);
  }

  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  } else if (cleaned.startsWith("8")) {
    cleaned = "62" + cleaned;
  }

  return cleaned;
}

/**
 * Builds the plain formatted order text per PRD Section 8.
 */
export function formatOrderMessage(params: Omit<OrderMessageParams, "phone">): string {
  const note = params.catatan && params.catatan.trim() ? params.catatan.trim() : "-";
  const size = params.ukuran && params.ukuran.trim() ? params.ukuran.trim() : "-";
  const estimasi = params.estimasi && params.estimasi.trim() ? params.estimasi.trim() : "-";

  const lines = [
    `Halo ${params.namaBisnis}, saya ingin pesan.`,
  ];

  if (params.nama !== undefined) {
    const name = params.nama.trim() ? params.nama.trim() : "-";
    lines.push(`Nama: ${name}`);
  }

  lines.push(
    `Produk: ${params.produk}`,
    `Bahan: ${params.bahan}`,
    `Branding: ${params.branding}`,
    `Jumlah: ${params.jumlah} pcs`,
    `Ukuran: ${size}`,
    `Catatan: ${note}`,
    `Estimasi dari web: ${estimasi}`,
  );

  return lines.join("\n");
}

/**
 * Generates a full wa.me link with the structured order message.
 */
export function createOrderWhatsAppUrl(params: OrderMessageParams): string {
  const phone = normalizePhoneNumber(params.phone);
  const message = formatOrderMessage(params);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a wa.me link for direct inquiry (e.g. Hero CTA button).
 */
export function createInquiryWhatsAppUrl(phone: string, namaBisnis: string): string {
  const cleanPhone = normalizePhoneNumber(phone);
  const message = `Halo ${namaBisnis}, saya ingin tanya tentang pemesanan konveksi.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

