import React from "react";
import { Star } from "lucide-react";
import type { UlasanItem } from "@/config/types";

export type ReviewItem = UlasanItem;

export interface UlasanProps {
  ulasan?: UlasanItem[];
}

/**
 * Customer review cards presenting authentic social proof and client satisfaction.
 * Styled using Workwear Textile design tokens (white surface, mist borders, ink/slate typography).
 * Conditionally rendered only when the business configuration provides testimonials.
 */
export function Ulasan({ ulasan }: UlasanProps) {
  const validUlasan = (ulasan || []).filter(
    (item) =>
      item &&
      typeof item.nama === "string" &&
      typeof item.teks === "string" &&
      (item.nama.trim().length > 0 || item.teks.trim().length > 0)
  );

  if (validUlasan.length === 0) {
    return null;
  }

  return (
    <section
      id="ulasan"
      aria-label="Ulasan Pelanggan"
      className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Ulasan Pelanggan
        </h2>
        <p className="mt-2 text-sm text-slate sm:text-base">
          Pengalaman dan testimoni dari pelanggan yang telah memesan di workshop kami.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        {validUlasan.map((item, index) => (
          <article
            key={`${item.nama}-${index}`}
            className="flex flex-col justify-between rounded-2xl border border-mist bg-white p-5 sm:p-6 shadow-sm"
          >
            <div className="space-y-3">
              <div
                role="img"
                className="flex items-center gap-1 text-amber-500"
                aria-label="Rating 5 dari 5 bintang"
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="text-sm leading-relaxed text-ink sm:text-base">
                &ldquo;{item.teks}&rdquo;
              </blockquote>
            </div>

            <div className="mt-4 border-t border-mist pt-3">
              <p className="text-sm font-semibold text-ink sm:text-base">
                {item.nama}
              </p>
              <span className="text-xs text-slate">
                Pelanggan Terverifikasi
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
