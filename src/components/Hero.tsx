import type { BusinessConfig } from "@/config/types";
import { getAccessibleTextColor } from "@/lib/color";
import { createInquiryWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowRight, Calculator, MessageCircle } from "lucide-react";

interface HeroProps {
  config: BusinessConfig;
}

/**
 * Split Hero Section with Product Editorial layout.
 * Left Column: Business Eyebrow, Headline, Value Proposition Description, and Primary/Secondary CTAs.
 * Right Column: Studio Apparel Composition showcasing workwear, polo, hoodie, and safety garments.
 */
export function Hero({ config }: HeroProps) {
  const waUrl = createInquiryWhatsAppUrl(config.wa, config.nama);
  const textColor = getAccessibleTextColor(config.warnaUtama);

  return (
    <section
      aria-label={`Profil ${config.nama}`}
      className="relative overflow-hidden bg-white border-b border-mist"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:py-20 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-12 lg:items-center">
          {/* Left Column: Business info & CTAs */}
          <div className="lg:col-span-7 flex flex-col text-left">
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5">
              <span className="h-0.5 w-6 sm:w-8 bg-brand-accent rounded-full" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-accent">
                KONVEKSI CUSTOM · SOLO RAYA
              </span>
            </div>

            {/* Headline */}
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl leading-[1.15]">
              Seragam &amp; Apparel untuk Kebutuhan Bisnis
            </h1>

            {/* Description */}
            <p className="mt-4 text-base text-slate sm:text-lg leading-relaxed max-w-2xl">
              {config.tagline ||
                "Kami melayani pembuatan seragam kerja, kaos custom, jaket, dan berbagai pakaian lainnya dengan pilihan bahan dan desain sesuai kebutuhan."}
            </p>

            {/* CTA Group */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: config.warnaUtama, color: textColor }}
                aria-label={`Konsultasi via WhatsApp dengan ${config.nama}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary text-brand-text px-6 py-3.5 text-[19px] font-bold sm:text-xl shadow-md hover:bg-brand-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                <span>Konsultasi via WhatsApp</span>
                <ArrowRight className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              </a>

              <a
                href="#kalkulator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-steel bg-white px-6 py-3.5 text-[19px] font-bold sm:text-xl text-neutral-800 shadow-sm hover:bg-page-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 transition-colors cursor-pointer"
              >
                <Calculator className="w-5 h-5 flex-shrink-0 text-slate" aria-hidden="true" />
                <span>Hitung Estimasi</span>
                <ArrowRight className="w-4 h-4 flex-shrink-0 text-slate" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right Column: Apparel Visual Editorial Composition */}
          <div className="lg:col-span-5 mt-8 lg:mt-0 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg lg:max-w-none overflow-hidden rounded-2xl sm:rounded-3xl border border-mist bg-white shadow-sm">
              <picture>
                <source srcSet="/images/hero-apparel.webp" type="image/webp" />
                <img
                  src="/images/hero-apparel.jpg"
                  alt={`Contoh produk apparel dan seragam kerja ${config.nama}`}
                  width={516}
                  height={370}
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-auto object-cover"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
