import type { BusinessConfig } from "@/config/types";
import { getAccessibleTextColor } from "@/lib/color";
import { createInquiryWhatsAppUrl } from "@/lib/whatsapp";
import { Calculator, MessageCircle } from "lucide-react";

interface HeroProps {
  config: BusinessConfig;
}

export function Hero({ config }: HeroProps) {
  const waUrl = createInquiryWhatsAppUrl(config.wa, config.nama);
  const textColor = getAccessibleTextColor(config.warnaUtama);

  return (
    <section className="relative overflow-hidden bg-white border-b border-neutral-200">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 text-center">
        {config.logo && (
          <div className="mb-6 flex justify-center">
            <img
              src={config.logo}
              alt={`Logo ${config.nama}`}
              className="h-16 w-auto object-contain sm:h-20 rounded-2xl shadow-sm border border-neutral-100"
            />
          </div>
        )}

        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
          {config.nama}
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-600 sm:text-lg sm:mt-6 leading-relaxed">
          {config.tagline}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: config.warnaUtama, color: textColor }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-primary text-brand-text px-6 py-3.5 text-[19px] font-bold sm:text-xl shadow-md hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 transition-all"
          >
            <MessageCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            <span>Hubungi WhatsApp</span>
          </a>

          <a
            href="#kalkulator"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3.5 text-[19px] font-bold sm:text-xl text-neutral-800 shadow-sm hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 transition-colors"
          >
            <Calculator className="w-5 h-5 flex-shrink-0 text-neutral-600" aria-hidden="true" />
            <span>Hitung Estimasi</span>
          </a>
        </div>
      </div>
    </section>
  );
}

