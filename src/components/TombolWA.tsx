"use client";

import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { createInquiryWhatsAppUrl } from "@/lib/whatsapp";
import { getAccessibleTextColor } from "@/lib/color";

export interface TombolWAProps {
  wa: string;
  namaBisnis: string;
  warnaUtama: string;
}

/**
 * Persistent mobile floating WhatsApp CTA button.
 * Automatically conceals itself when the order form submit button is visible
 * in the viewport to prevent occlusion of critical form actions (FR-10).
 */
export function TombolWA({ wa, namaBisnis, warnaUtama }: TombolWAProps) {
  const [isOccluded, setIsOccluded] = useState(false);
  const textColor = getAccessibleTextColor(warnaUtama);
  const waUrl = createInquiryWhatsAppUrl(wa, namaBisnis);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    // Target action buttons whose presence in the mobile viewport must conceal the floating CTA:
    // the order form submit button and the external Google Maps navigation button (FR-10)
    const targets = Array.from(
      document.querySelectorAll("#kalkulator form a, #lokasi a")
    );

    if (targets.length === 0) {
      return;
    }

    const intersectingTargets = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersectingTargets.add(entry.target);
          } else {
            intersectingTargets.delete(entry.target);
          }
        }
        setIsOccluded(intersectingTargets.size > 0);
      },
      {
        // Positive bottom rootMargin ensures floating CTA transitions out before an action button touches it
        rootMargin: "0px 0px 40px 0px",
        threshold: 0,
      }
    );

    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      intersectingTargets.clear();
    };
  }, []);

  return (
    <aside
      id="tombol-wa-floating-container"
      aria-label="Kontak Cepat WhatsApp"
      aria-hidden={isOccluded ? "true" : undefined}
      className={`fixed bottom-4 right-4 z-40 sm:hidden transition-all duration-200 ${
        isOccluded
          ? "pointer-events-none opacity-0 translate-y-3 scale-90"
          : "opacity-100 translate-y-0 scale-100"
      }`}
    >
      <a
        id="tombol-wa-floating"
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={isOccluded ? -1 : undefined}
        style={{ backgroundColor: warnaUtama, color: textColor }}
        aria-label={`Hubungi WhatsApp ${namaBisnis}`}
        className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg ring-1 ring-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 active:scale-95 transition-transform"
      >
        <MessageCircle className="h-7 w-7" aria-hidden="true" />
      </a>
    </aside>
  );
}

