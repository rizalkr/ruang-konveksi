import React from "react";

export interface GaleriProps {
  foto?: string[];
  namaBisnis: string;
}

/**
 * Responsive photo gallery showcasing workshop production output and craftsmanship.
 * Styled with Workwear Textile tokens: mist borders, off-white fallback surfaces, ink/slate typography.
 * Utilizes native lazy-loaded standard img tags for optimal mobile performance and data conservation.
 */
export function Galeri({ foto, namaBisnis }: GaleriProps) {
  const validFoto = (foto || [])
    .map((src) => (typeof src === "string" ? src.trim() : ""))
    .filter((src) => src.length > 0);

  if (validFoto.length === 0) {
    return null;
  }

  const businessName =
    typeof namaBisnis === "string" && namaBisnis.trim().length > 0
      ? namaBisnis.trim()
      : "Workshop Konveksi";

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
          <div
            key={`${src}-${index}`}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-mist bg-page-bg shadow-sm"
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
          </div>
        ))}
      </div>
    </section>
  );
}
