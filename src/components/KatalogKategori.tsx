import type { KategoriItem } from "@/config/types";
import { formatRupiah } from "@/lib/format";
import { Info } from "lucide-react";

interface KatalogKategoriProps {
  kategori?: KategoriItem[];
}

const FALLBACK_IMAGE = "/images/placeholders/fallback.svg";

/**
 * Checks whether a candidate path or URL is a syntactically valid image reference.
 * Accepts:
 * - Root-relative web paths starting with '/' that have a recognizable image extension
 * - Absolute HTTP / HTTPS URLs (e.g. from cloud storage / CDN)
 */
export function isValidImagePath(path: unknown): boolean {
  if (typeof path !== "string") {
    return false;
  }
  const trimmed = path.trim();
  if (!trimmed) {
    return false;
  }

  // Reject javascript:, data:, file:, etc.
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      new URL(trimmed);
      return true;
    } catch {
      return false;
    }
  }

  // Root-relative path
  if (trimmed.startsWith("/")) {
    return /\.(svg|png|jpe?g|webp|avif|gif)(\?.*)?$/i.test(trimmed);
  }

  return false;
}

/**
 * Returns the first valid photo URL or the local fallback SVG.
 * Ensures cards never render broken images if photo array is empty, contains invalid paths,
 * or is non-array/malformed.
 */
export function resolveImageSrc(foto?: unknown): string {
  if (typeof foto === "string") {
    return isValidImagePath(foto) ? foto.trim() : FALLBACK_IMAGE;
  }

  if (!Array.isArray(foto) || foto.length === 0) {
    return FALLBACK_IMAGE;
  }

  const first = foto[0];
  if (isValidImagePath(first)) {
    return (first as string).trim();
  }

  return FALLBACK_IMAGE;
}

/**
 * Server Component displaying the product category showcase.
 * Styled using Workwear Textile design tokens (off-white page background, white cards, mist borders, brand primary CTA).
 * Each card features a lazy-loaded vector illustration, pricing, and a >=48px CTA touch target.
 */
export function KatalogKategori({ kategori }: KatalogKategoriProps) {
  const items = Array.isArray(kategori) ? kategori : [];

  if (items.length === 0) {
    return (
      <section
        id="katalog"
        aria-label="Katalog Produk"
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Katalog Produk
          </h2>
        </div>
        <div className="rounded-2xl border border-mist bg-white p-8 text-center text-sm text-slate shadow-sm">
          Belum ada kategori produk yang ditampilkan.
        </div>
      </section>
    );
  }

  return (
    <section
      id="katalog"
      aria-label="Katalog Produk"
      className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Katalog Produk
        </h2>
        <p className="mt-2 text-sm text-slate sm:text-base">
          Pilihan kategori konveksi dengan standar kualitas bahan dan jahitan prima.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const itemTitle = item.nama?.trim() || `Kategori ${index + 1}`;
          const imageSrc = resolveImageSrc(item.foto);
          return (
            <article
              key={`${itemTitle}-${index}`}
              className="flex flex-col overflow-hidden rounded-2xl border border-mist bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-mist bg-page-bg p-6">
                <img
                  src={imageSrc}
                  alt={`Contoh produk ${itemTitle}`}
                  loading="lazy"
                  width={240}
                  height={180}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-bold text-ink">
                  {itemTitle}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate line-clamp-3">
                  {item.deskripsi}
                </p>

                <div className="mt-4 flex items-baseline justify-between border-t border-mist pt-3">
                  <span className="text-xs font-medium text-slate">Mulai</span>
                  <span className="text-base font-bold text-ink">
                    {formatRupiah(item.hargaMulai)}{" "}
                    <span className="text-xs font-normal text-slate">/ pcs</span>
                  </span>
                </div>

                <a
                  href="#kalkulator"
                  className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-brand-primary text-white px-4 py-3 text-sm font-semibold shadow-sm transition-colors hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                >
                  Hitung Estimasi
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

