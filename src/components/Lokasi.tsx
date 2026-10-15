import React from "react";
import { Clock, MapPin, Navigation } from "lucide-react";

export interface LokasiProps {
  alamat: string;
  jamOperasional?: string;
  petaUrl?: string;
}

/**
 * Workshop physical address and operating schedule section.
 * Conditionally renders external navigation link to Google Maps if petaUrl is configured.
 */
export function Lokasi({ alamat, jamOperasional, petaUrl }: LokasiProps) {
  const hasMapUrl =
    typeof petaUrl === "string" && /^(https?:\/\/)/i.test(petaUrl.trim());
  const addressText =
    typeof alamat === "string" && alamat.trim().length > 0
      ? alamat.trim()
      : "Konfirmasi alamat workshop melalui WhatsApp";
  const hoursText =
    jamOperasional && jamOperasional.trim().length > 0
      ? jamOperasional.trim()
      : "Konfirmasi jam buka melalui WhatsApp";

  return (
    <section
      id="lokasi"
      aria-label="Lokasi & Jam Operasional"
      className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          Lokasi Workshop & Jam Operasional
        </h2>
        <p className="mt-2 text-sm text-neutral-600 sm:text-base">
          Kunjungi workshop kami untuk konsultasi bahan atau pengambilan pesanan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Workshop Address Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
                Alamat Workshop
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 sm:text-base">
                {addressText}
              </p>
            </div>
          </div>

          {/* Conditional Google Maps button */}
          {hasMapUrl && (
            <div className="mt-6 border-t border-neutral-100 pt-4">
              <a
                href={petaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 transition-colors sm:w-auto"
              >
                <Navigation className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Buka di Google Maps</span>
              </a>
            </div>
          )}
        </div>

        {/* Operating Hours Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
              <Clock className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 sm:text-lg">
                Jam Operasional
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600 sm:text-base">
                {hoursText}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-neutral-100 pt-4">
            <p className="text-xs text-neutral-500">
              Konsultasi via WhatsApp tetap dilayani di luar jam operasional workshop.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

