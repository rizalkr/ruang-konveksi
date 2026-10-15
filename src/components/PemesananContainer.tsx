import type { BusinessConfig } from "@/config/types";

interface PemesananContainerProps {
  config: BusinessConfig;
}

/**
 * Container component for Kalkulator and FormOrder.
 * Contains id="kalkulator" for anchor linking from Hero and Category cards.
 */
export function PemesananContainer({ config }: PemesananContainerProps) {
  return (
    <section
      id="kalkulator"
      data-moq={config.kalkulator.moq}
      className="scroll-mt-8"
      aria-label="Kalkulator Estimasi"
    >
      {/* Interactive calculator and WhatsApp order form will be mounted in Phase 3 */}
    </section>
  );
}

