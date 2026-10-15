import React from "react";
import type { BusinessConfig } from "@/config/types";
import { createInquiryWhatsAppUrl } from "@/lib/whatsapp";
import { MapPin, Clock, MessageCircle } from "lucide-react";

interface FooterProps {
  config: BusinessConfig;
  sections: { id: string; label: string }[];
}

/**
 * Page footer with Deep Petrol background and white/off-white text.
 * Displays business identity, navigation links, contact info, and
 * Nalar Solusi Digital demo attribution (footer-only, per spec).
 */
export function Footer({ config, sections }: FooterProps) {
  const waUrl = createInquiryWhatsAppUrl(config.wa, config.nama);

  const hasAddress =
    typeof config.alamat === "string" && config.alamat.trim().length > 0;
  const hasHours =
    typeof config.jamOperasional === "string" &&
    config.jamOperasional.trim().length > 0;
  const hasMapUrl =
    typeof config.petaUrl === "string" &&
    /^https?:\/\//i.test(config.petaUrl.trim());

  const currentYear = new Date().getFullYear();

  // Filter navigation links (exclude beranda since footer is at the bottom)
  const navLinks = sections.filter((s) => s.id !== "beranda");

  return (
    <footer
      className="bg-brand-primary text-white"
      aria-label="Footer"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Business Identity */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              {config.logo && (
                <img
                  src={config.logo}
                  alt={`Logo ${config.nama}`}
                  className="h-10 w-10 rounded-lg object-cover"
                  width={40}
                  height={40}
                />
              )}
              <span className="text-lg font-bold">{config.nama}</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              {config.tagline}
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
              Navigasi
            </h3>
            <ul className="mt-3 space-y-2">
              {navLinks.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-sm text-white/80 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Location */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">
              Kontak
            </h3>
            <div className="mt-3 space-y-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
              >
                <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Hubungi WhatsApp</span>
              </a>

              {hasAddress && (
                <div className="flex items-start gap-2 text-sm text-white/80">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{config.alamat}</span>
                </div>
              )}

              {hasHours && (
                <div className="flex items-start gap-2 text-sm text-white/80">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{config.jamOperasional}</span>
                </div>
              )}

              {hasMapUrl && (
                <a
                  href={config.petaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-white/80 underline underline-offset-2 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
                >
                  Buka di Google Maps
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar: copyright + demo attribution */}
        <div className="mt-10 border-t border-white/20 pt-6">
          <p className="text-xs text-white/60">
            {`\u00A9 ${currentYear} ${config.nama}. Semua hak dilindungi.`}
          </p>
          <p className="mt-2 text-xs text-white/50 leading-relaxed max-w-2xl">
            Website demo ini merupakan properti Nalar Solusi Digital dan dibuat
            untuk keperluan demonstrasi. Informasi bisnis yang ditampilkan dapat
            berupa data contoh.
          </p>
        </div>
      </div>
    </footer>
  );
}

