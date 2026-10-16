"use client";

import React, { useState, useCallback } from "react";
import type { KategoriItem } from "@/config/types";
import { formatRupiah } from "@/lib/format";
import { Info, Eye } from "lucide-react";
import { usePemesanan } from "@/context/PemesananContext";
import { ImageGalleryModal } from "./ImageGalleryModal";

interface KatalogKategoriProps {
  kategori?: KategoriItem[];
  availableProducts?: Record<string, number>;
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
 * Product category showcase component.
 * Styled using Workwear Textile design tokens (off-white page background, white cards, mist borders, brand primary CTA).
 * Each card features a high-definition image, pricing, a "Lihat Contoh Produk" detail modal trigger,
 * and a >=48px "Hitung Estimasi" CTA that automatically selects the product in the calculator.
 */
export function KatalogKategori({ kategori, availableProducts }: KatalogKategoriProps) {
  const items = Array.isArray(kategori) ? kategori : [];
  const { selectProduk } = usePemesanan();

  // Controlled modal state
  const [activeCategory, setActiveCategory] = useState<KategoriItem | null>(null);

  const handleOpenDetail = useCallback((item: KategoriItem) => {
    setActiveCategory(item);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveCategory(null);
  }, []);

  const handleHitungEstimasi = useCallback(
    (categoryName: string) => {
      selectProduk(categoryName, availableProducts);
    },
    [selectProduk, availableProducts]
  );

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

        {/* Visible disclaimer on Thread Cream surface (accent-surface) */}
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200/80 bg-accent-surface p-3.5 text-xs text-accent-text sm:text-sm">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" aria-hidden="true" />
          <p>
            Harga pada demo ini hanya contoh. Harga final dikonfirmasi melalui WhatsApp.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const itemTitle = item.nama?.trim() || `Kategori ${index + 1}`;
          const imageSrc = resolveImageSrc(item.foto);
          const hasMultiplePhotos = Array.isArray(item.foto) && item.foto.length > 1;

          return (
            <article
              key={`${itemTitle}-${index}`}
              className="flex flex-col overflow-hidden rounded-2xl border border-mist bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Clickable Image Container */}
              <button
                type="button"
                onClick={() => handleOpenDetail(item)}
                aria-label={`Buka detail contoh produk ${itemTitle}`}
                className="group relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden border-b border-mist bg-page-bg text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                <img
                  src={imageSrc}
                  alt={`Contoh produk ${itemTitle}`}
                  loading="lazy"
                  width={400}
                  height={300}
                  className={`h-full w-full ${
                    imageSrc.endsWith(".svg") ? "object-contain p-6" : "object-cover"
                  } transition-transform duration-300 group-hover:scale-105`}
                />
                <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-lg bg-ink/75 px-2.5 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-sm transition-opacity group-hover:bg-ink">
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Lihat Detail{hasMultiplePhotos ? ` (${item.foto.length})` : ""}</span>
                </span>
              </button>

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

                {/* Actions: View Detail button and Calculator CTA */}
                <div className="mt-4 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleOpenDetail(item)}
                    aria-label={`Lihat contoh produk ${itemTitle}`}
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-mist bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-page-bg hover:border-steel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                  >
                    <Eye className="h-4 w-4 text-slate" aria-hidden="true" />
                    <span>Lihat Contoh Produk</span>
                  </button>

                  <a
                    href="#kalkulator"
                    onClick={() => {
                      handleHitungEstimasi(item.nama);
                    }}
                    className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-brand-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                  >
                    Hitung Estimasi
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Shared Image Gallery Modal for Catalog Item Details */}
      {activeCategory && (
        <ImageGalleryModal
          isOpen={Boolean(activeCategory)}
          onClose={handleCloseModal}
          images={activeCategory.foto || []}
          title={activeCategory.nama}
          ctaText="Hitung Estimasi"
          onCtaClick={() => {
            handleHitungEstimasi(activeCategory.nama);
          }}
        />
      )}
    </section>
  );
}
