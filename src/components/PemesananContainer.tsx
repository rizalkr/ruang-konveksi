"use client";

import React, { useState } from "react";
import type { BusinessConfig } from "@/config/types";
import { formatRentangEstimasi, hitungEstimasi } from "@/lib/estimasi";
import { Kalkulator } from "./Kalkulator";
import { FormOrder } from "./FormOrder";

interface PemesananContainerProps {
  config: BusinessConfig;
}

/**
 * Interactive Client Component synchronizing calculator state and WhatsApp order form.
 * Maintains id="kalkulator" for smooth anchor linking from Hero and Category cards.
 */
export function PemesananContainer({ config }: PemesananContainerProps) {
  const kalkulatorConfig = config?.kalkulator;
  const produkKeys = Object.keys(kalkulatorConfig?.produk ?? {});
  const bahanKeys = Object.keys(kalkulatorConfig?.bahan ?? {});
  const brandingKeys = Object.keys(kalkulatorConfig?.branding ?? {});
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
      className="scroll-mt-8 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          Kalkulator Estimasi & Pemesanan
        </h2>
        <p className="mt-2 text-sm text-neutral-600 sm:text-base">
          Sesuaikan spesifikasi produk untuk melihat simulasi kisaran harga langsung, lalu kirimkan rincian pesanan Anda ke WhatsApp.
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
    </section>
  );
}
