"use client";

import React from "react";
import type { KalkulatorConfig } from "@/config/types";
import type { EstimasiResult } from "@/lib/estimasi";
import { formatRentangEstimasi } from "@/lib/estimasi";
import { formatRupiah } from "@/lib/format";
import { AlertCircle, Calculator, Info } from "lucide-react";

export interface KalkulatorProps {
  kalkulatorConfig: KalkulatorConfig;
  produk: string;
  bahan: string;
  branding: string;
  jumlah: number;
  onProdukChange: (produk: string) => void;
  onBahanChange: (bahan: string) => void;
  onBrandingChange: (branding: string) => void;
  onJumlahChange: (jumlah: number) => void;
  estimasiResult: EstimasiResult;
}

export function Kalkulator({
  kalkulatorConfig,
  produk,
  bahan,
  branding,
  jumlah,
  onProdukChange,
  onBahanChange,
  onBrandingChange,
  onJumlahChange,
  estimasiResult,
}: KalkulatorProps) {
  const produkEntries = Object.entries(kalkulatorConfig?.produk ?? {});
  const bahanEntries = Object.entries(kalkulatorConfig?.bahan ?? {});
  const brandingEntries = Object.entries(kalkulatorConfig?.branding ?? {});
  const moq =
    typeof kalkulatorConfig?.moq === "number" && Number.isFinite(kalkulatorConfig.moq)
      ? kalkulatorConfig.moq
      : 12;

  // Extract quick selection quantity options from MOQ and volume discount tiers
  const tierSet = new Set<number>();
  if (moq > 0) {
    tierSet.add(moq);
  }
  if (Array.isArray(kalkulatorConfig?.diskonVolume)) {
    for (const item of kalkulatorConfig.diskonVolume) {
      if (typeof item.minJumlah === "number" && item.minJumlah > 0) {
        tierSet.add(item.minJumlah);
      }
    }
  }
  const quickQuantityTiers = Array.from(tierSet).sort((a, b) => a - b);

  return (
    <div className="flex flex-col space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800">
          <Calculator className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-neutral-900 sm:text-xl">
            Simulasi Biaya Produksi
          </h3>
          <p className="text-xs text-neutral-500 sm:text-sm">
            Kalkulator interaktif harga dasar, bahan, dan diskon kuantitas.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Product Selector */}
        <div>
          <label
            htmlFor="kalkulator-produk"
            className="block text-sm font-semibold text-neutral-800"
          >
            Jenis Produk
          </label>
          <select
            id="kalkulator-produk"
            value={produk}
            onChange={(e) => onProdukChange(e.target.value)}
            className="mt-1.5 block w-full min-h-[48px] rounded-xl border border-neutral-300 bg-white px-3.5 py-3 text-base text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-colors"
          >
            {produkEntries.map(([name, price]) => (
              <option key={name} value={name}>
                {name} (Mulai {formatRupiah(price)})
              </option>
            ))}
          </select>
        </div>

        {/* Fabric Selector */}
        <div>
          <label
            htmlFor="kalkulator-bahan"
            className="block text-sm font-semibold text-neutral-800"
          >
            Pilihan Bahan
          </label>
          <select
            id="kalkulator-bahan"
            value={bahan}
            onChange={(e) => onBahanChange(e.target.value)}
            className="mt-1.5 block w-full min-h-[48px] rounded-xl border border-neutral-300 bg-white px-3.5 py-3 text-base text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-colors"
          >
            {bahanEntries.map(([name, price]) => (
              <option key={name} value={name}>
                {price > 0 ? `${name} (+${formatRupiah(price)})` : `${name} (Standar)`}
              </option>
            ))}
          </select>
        </div>

        {/* Branding Selector */}
        <div>
          <label
            htmlFor="kalkulator-branding"
            className="block text-sm font-semibold text-neutral-800"
          >
            Jenis Branding
          </label>
          <select
            id="kalkulator-branding"
            value={branding}
            onChange={(e) => onBrandingChange(e.target.value)}
            className="mt-1.5 block w-full min-h-[48px] rounded-xl border border-neutral-300 bg-white px-3.5 py-3 text-base text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-colors"
          >
            {brandingEntries.map(([name, price]) => (
              <option key={name} value={name}>
                {price > 0 ? `${name} (+${formatRupiah(price)})` : `${name} (Tanpa Branding)`}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity Input */}
        <div>
          <label
            htmlFor="kalkulator-jumlah"
            className="block text-sm font-semibold text-neutral-800"
          >
            Jumlah Pesanan (pcs)
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <input
              id="kalkulator-jumlah"
              type="number"
              min="1"
              step="1"
              value={jumlah <= 0 ? "" : jumlah}
              onChange={(e) => {
                const val = e.target.value.trim();
                if (val === "") {
                  onJumlahChange(0);
                  return;
                }
                const parsed = parseInt(val, 10);
                onJumlahChange(Number.isNaN(parsed) ? 0 : Math.max(0, parsed));
              }}
              placeholder="Masukkan jumlah pcs"
              className="block w-full min-h-[48px] rounded-xl border border-neutral-300 bg-white px-3.5 py-3 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-colors"
            />
          </div>

          {/* Quick selection chips for mobile convenience */}
          {quickQuantityTiers.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-neutral-500">Pilihan cepat:</span>
              {quickQuantityTiers.map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => onJumlahChange(tier)}
                  className={`inline-flex min-h-[44px] min-w-[56px] items-center justify-center rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${
                    jumlah === tier
                      ? "border border-neutral-900 bg-neutral-900 text-white shadow-sm"
                      : "border border-neutral-200 bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
                  }`}
                >
                  {`${tier} pcs`}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Live Estimated Price Display */}
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Kisaran Estimasi Total
        </div>
        <div className="mt-1 text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
          {formatRentangEstimasi(estimasiResult.rentangMin, estimasiResult.rentangMax)}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600 sm:text-sm">
          <span>
            Estimasi per pcs:{" "}
            <strong className="font-semibold text-neutral-900">
              {formatRupiah(estimasiResult.estimasiPerPcs)}
            </strong>
          </span>
          {estimasiResult.diskonPersen > 0 && (
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              {`Diskon volume ${Math.round(estimasiResult.diskonPersen * 100)}%`}
            </span>
          )}
        </div>
      </div>

      {/* Sub-MOQ neutral notice when jumlah < moq (does NOT block user) */}
      {estimasiResult.isBelowMoq && (
        <div
          role="status"
          className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 sm:text-sm"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
          <p>
            {`Ketentuan untuk pesanan di bawah batas minimum pemesanan (${moq} pcs) dikonfirmasi via WhatsApp.`}
          </p>
        </div>
      )}

      {/* Mandatory visible disclaimer */}
      <div className="flex items-start gap-2.5 rounded-xl border border-neutral-200 bg-white p-3.5 text-xs text-neutral-600 sm:text-sm shadow-sm">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
        <p>Estimasi, harga final dikonfirmasi via WhatsApp.</p>
      </div>
    </div>
  );
}
