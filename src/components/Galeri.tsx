"use client";

import React, { useState, useCallback } from "react";
import { ZoomIn } from "lucide-react";
import { usePemesanan } from "@/context/PemesananContext";
import { ImageGalleryModal } from "./ImageGalleryModal";

export interface GaleriProps {
  foto?: string[];
  namaBisnis: string;
  availableProducts?: Record<string, number>;
}

/**
 * Responsive photo gallery showcasing workshop production output and craftsmanship.
 * Styled with Workwear Textile tokens: mist borders, off-white fallback surfaces, ink/slate typography.
 * Utilizes native lazy-loaded standard img tags for optimal mobile performance and data conservation.
 * Tapping any thumbnail opens the shared accessible ImageGalleryModal starting at the clicked photo index.
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

  const handleOpenModal = useCallback((index: number) => {
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

  return (
    <section
      id="galeri"
      aria-label="Galeri Hasil Produksi"
      className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Galeri Hasil Produksi
        </h2>
        <p className="mt-2 text-sm text-slate sm:text-base">
          Dokumentasi pengerjaan pesanan dan kualitas jahitan {businessName}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {validFoto.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => handleOpenModal(index)}
            aria-label={`Buka foto dokumentasi hasil produksi ${businessName} ${index + 1}`}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-mist bg-page-bg text-left shadow-sm transition-all hover:border-steel hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            <img
              src={src}
              alt={`Dokumentasi hasil produksi ${businessName} ${index + 1}`}
              loading="lazy"
              decoding="async"
              width={400}
              height={400}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Subtle hover overlay affordance */}
            <div className="absolute inset-0 flex items-center justify-center bg-ink/20 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-ink/80 px-2.5 py-1 text-xs font-medium text-white shadow-sm backdrop-blur-sm">
                <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Perbesar</span>
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Shared Image Gallery Modal */}
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
