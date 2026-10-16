"use client";

import React, { useState, useCallback } from "react";
import { Images } from "lucide-react";
import { usePemesanan } from "@/context/PemesananContext";
import { ImageGalleryModal } from "./ImageGalleryModal";

export interface GaleriProps {
  foto?: string[];
  namaBisnis: string;
  availableProducts?: Record<string, number>;
}

/**
 * Single-image preview gallery component showcasing workshop production output and craftsmanship.
 * Styled with Workwear Textile tokens: mist borders, off-white fallback surfaces, ink/slate typography.
 * The entire preview banner is interactive and opens the shared accessible ImageGalleryModal
 * containing the full collection of workshop documentary photographs.
 */
export function Galeri({ foto, namaBisnis, availableProducts }: GaleriProps) {
  const validFoto = (foto || [])
    .map((src) => (typeof src === "string" ? src.trim() : ""))
    .filter((src) => src.length > 0);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { selectProduk } = usePemesanan();

  const businessName =
    typeof namaBisnis === "string" && namaBisnis.trim().length > 0
      ? namaBisnis.trim()
      : "Workshop Konveksi";

  const handleOpenModal = useCallback((index = 0) => {
    setSelectedIndex(index);
    setModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleCtaClick = useCallback(
    (index: number) => {
      const currentSrc = validFoto[index] || "";
      const filename = currentSrc.split("/").pop()?.toLowerCase() || "";

      let matchedCategory: string | undefined;
      if (filename.includes("pdh")) matchedCategory = "PDH";
      else if (filename.includes("kaos")) matchedCategory = "Kaos";
      else if (filename.includes("jaket")) matchedCategory = "Jaket";
      else if (filename.includes("almamater")) matchedCategory = "Almamater";
      else if (filename.includes("wearpack")) matchedCategory = "Wearpack";
      else if (filename.includes("jersey")) matchedCategory = "Jersey";
      else if (filename.includes("seragam")) matchedCategory = "Seragam Sekolah";

      if (matchedCategory) {
        selectProduk(matchedCategory, availableProducts);
      } else {
        if (typeof window !== "undefined") {
          const el = document.getElementById("kalkulator");
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    },
    [validFoto, selectProduk, availableProducts]
  );

  if (validFoto.length === 0) {
    return null;
  }

  // Consistent primary preview image from available gallery data
  const previewImage = validFoto[0];

  return (
    <section
      id="galeri"
      aria-label="Galeri Hasil Produksi"
      className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Galeri Hasil Produksi
        </h2>
        <p className="mt-2 text-sm text-slate sm:text-base">
          Dokumentasi pengerjaan pesanan dan kualitas jahitan {businessName}.
        </p>
      </div>

      {/* Single-image preview banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-mist bg-page-bg shadow-sm transition-all hover:border-steel hover:shadow-md">
        <button
          type="button"
          onClick={() => handleOpenModal(0)}
          aria-label={`Buka galeri foto ${businessName}. Tersedia ${validFoto.length} foto dokumentasi.`}
          className="group relative flex aspect-[16/10] sm:aspect-[21/9] w-full items-center justify-center overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        >
          <img
            src={previewImage}
            alt={`Preview dokumentasi hasil produksi ${businessName}`}
            loading="lazy"
            decoding="async"
            width={1200}
            height={600}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Legibility scrim gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent transition-opacity group-hover:from-ink/90"
            aria-hidden="true"
          />

          {/* Floating CTA Badge */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
            <span className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-xs sm:text-sm font-bold text-ink shadow-lg backdrop-blur-sm transition-all group-hover:bg-white group-hover:scale-105 group-hover:shadow-xl">
              <Images className="h-4 w-4 sm:h-5 sm:w-5 text-brand-primary flex-shrink-0" aria-hidden="true" />
              <span>
                {validFoto.length > 1
                  ? `Lihat Semua Foto (${validFoto.length} Foto)`
                  : "Lihat Semua Foto"}
              </span>
            </span>
          </div>
        </button>
      </div>

      {/* Shared Image Gallery Modal displaying the full collection */}
      {modalOpen && (
        <ImageGalleryModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          images={validFoto.map((src, idx) => ({
            src,
            alt: `Dokumentasi hasil produksi ${businessName} ${idx + 1}`,
            title: `Galeri ${businessName}`,
          }))}
          initialIndex={selectedIndex}
          title={`Galeri ${businessName}`}
          ctaText="Hitung Estimasi"
          onCtaClick={handleCtaClick}
        />
      )}
    </section>
  );
}
