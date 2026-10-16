"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import type { BusinessConfig } from "@/config/types";
import { formatRentangEstimasi, hitungEstimasi } from "@/lib/estimasi";
import { usePemesanan } from "@/context/PemesananContext";
import { Kalkulator } from "./Kalkulator";
import { FormOrder } from "./FormOrder";

interface PemesananContainerProps {
  config: BusinessConfig;
}

/**
 * Interactive Client Component synchronizing calculator state and WhatsApp order form.
 * Anchored visually with a Deep Petrol (brand-primary) section background as specified in the Workwear Textile design system.
 * Contains two white cards (Kalkulator & FormOrder) for maximum readability and crisp visual rhythm.
 * Listens to catalog selection events from PemesananContext to dynamically select products and update live estimates.
 * Maintains id="kalkulator" for smooth anchor linking from Navbar, Hero, and Category cards.
 */
export function PemesananContainer({ config }: PemesananContainerProps) {
  const kalkulatorConfig = config?.kalkulator;
  const produkKeys = useMemo(
    () => Object.keys(kalkulatorConfig?.produk ?? {}),
    [kalkulatorConfig?.produk]
  );
  const bahanKeys = useMemo(
    () => Object.keys(kalkulatorConfig?.bahan ?? {}),
    [kalkulatorConfig?.bahan]
  );
  const brandingKeys = useMemo(
    () => Object.keys(kalkulatorConfig?.branding ?? {}),
    [kalkulatorConfig?.branding]
  );
  const initialMoq =
    typeof kalkulatorConfig?.moq === "number" && kalkulatorConfig.moq > 0
      ? kalkulatorConfig.moq
      : 12;

  // Initial selection defaults
  const [produk, setProduk] = useState<string>(
    produkKeys.includes("Kaos") ? "Kaos" : (produkKeys[0] ?? "")
  );
  const [bahan, setBahan] = useState<string>(
    bahanKeys.includes("Katun Combed") ? "Katun Combed" : (bahanKeys[0] ?? "")
  );
  const [branding, setBranding] = useState<string>(
    brandingKeys.includes("Sablon") ? "Sablon" : (brandingKeys[0] ?? "")
  );
  const [jumlah, setJumlah] = useState<number>(initialMoq);

  // Sync state when a product is selected from Katalog or Modal
  const { targetSelection } = usePemesanan();
  const lastProcessedTimestamp = useRef<number>(0);

  useEffect(() => {
    if (
      targetSelection?.produk &&
      targetSelection.timestamp > lastProcessedTimestamp.current
    ) {
      lastProcessedTimestamp.current = targetSelection.timestamp;

      if (kalkulatorConfig?.produk && targetSelection.produk in kalkulatorConfig.produk) {
        setProduk(targetSelection.produk);

        // Retain existing bahan, branding, and jumlah if valid; otherwise fallback gracefully
        setBahan((prevBahan) =>
          bahanKeys.length > 0 && !bahanKeys.includes(prevBahan) ? bahanKeys[0] : prevBahan
        );
        setBranding((prevBranding) =>
          brandingKeys.length > 0 && !brandingKeys.includes(prevBranding) ? brandingKeys[0] : prevBranding
        );
        setJumlah((prevJumlah) => (prevJumlah < initialMoq ? initialMoq : prevJumlah));
      }
    }
  }, [targetSelection, kalkulatorConfig, bahanKeys, brandingKeys, initialMoq]);

  // Live price estimation calculation
  const estimasiResult = hitungEstimasi(
    {
      produk,
      bahan,
      branding,
      jumlah,
    },
    kalkulatorConfig
  );

  const estimasiString = formatRentangEstimasi(
    estimasiResult.rentangMin,
    estimasiResult.rentangMax
  );

  return (
    <section
      id="kalkulator"
      aria-label="Kalkulator Estimasi & Formulir Pemesanan"
      className="scroll-mt-8 bg-brand-primary text-white py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
            Kalkulator Estimasi
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Hitung Estimasi Harga Sesuai Kebutuhan Anda
          </h2>
          <p className="mt-2 text-sm text-white/80 sm:text-base">
            Pilih spesifikasi produk, bahan, dan jumlah pesanan untuk melihat estimasi harga. Harga final akan dikonfirmasi via WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Kalkulator
              kalkulatorConfig={kalkulatorConfig}
              produk={produk}
              bahan={bahan}
              branding={branding}
              jumlah={jumlah}
              onProdukChange={setProduk}
              onBahanChange={setBahan}
              onBrandingChange={setBranding}
              onJumlahChange={setJumlah}
              estimasiResult={estimasiResult}
            />
          </div>
          <div className="lg:col-span-5">
            <FormOrder
              phone={config.wa}
              namaBisnis={config.nama}
              warnaUtama={config.warnaUtama}
              produk={produk}
              bahan={bahan}
              branding={branding}
              jumlah={jumlah}
              estimasiString={estimasiString}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
