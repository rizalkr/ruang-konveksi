import type { ProduksiConfig } from "@/config/types";
import { Clock, Layers, Scissors } from "lucide-react";

interface ProsesMOQProps {
  produksi?: ProduksiConfig;
  moq?: number;
}

/**
 * Server Component presenting workshop production guidelines and order workflow.
 * Renders minimum order quantity, production turnaround, fabric options as inline pill chips,
 * and data-driven workflow steps directly from the business configuration.
 */
export function ProsesMOQ({ produksi, moq = 12 }: ProsesMOQProps) {
  const displayMoq = typeof moq === "number" && Number.isFinite(moq) && moq > 0 ? moq : 12;
  const turnaround = produksi?.lamaPengerjaan?.trim() || "10 sampai 14 hari kerja";
  const fabrics = Array.isArray(produksi?.bahan) ? produksi.bahan : [];
  const steps = Array.isArray(produksi?.alurPesan) ? produksi.alurPesan : [];

  return (
    <section
      id="spesifikasi-produksi"
      aria-label="Spesifikasi Produksi & Alur Pemesanan"
      className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          Spesifikasi Produksi & Alur Pemesanan
        </h2>
        <p className="mt-2 text-sm text-neutral-600 sm:text-base">
          Informasi kapasitas minimal, standar material, dan alur pengerjaan workshop kami.
        </p>
      </div>

      {/* 3 Parameter Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* MOQ Card */}
        <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
              <Layers className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Minimal Pemesanan
              </span>
              <h3 className="text-lg font-bold text-neutral-900 sm:text-xl">
                {`${displayMoq} pcs`}
              </h3>
            </div>
          </div>
          <p className="mt-auto border-t border-neutral-100 pt-3 text-sm text-neutral-600">
            Pesanan di bawah MOQ dapat dikonsultasikan langsung melalui WhatsApp.
          </p>
        </div>

        {/* Turnaround Time Card */}
        <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
              <Clock className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Lama Pengerjaan
              </span>
              <h3 className="text-lg font-bold text-neutral-900 sm:text-xl">
                {turnaround}
              </h3>
            </div>
          </div>
          <p className="mt-auto border-t border-neutral-100 pt-3 text-sm text-neutral-600">
            Dihitung setelah konfirmasi desain dan pembayaran uang muka (DP).
          </p>
        </div>

        {/* Material Options Card with Inline Pill Chips */}
        <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
              <Scissors className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                Pilihan Bahan
              </span>
              <h3 className="text-lg font-bold text-neutral-900 sm:text-xl">
                {fabrics.length > 0 ? `${fabrics.length} Pilihan Bahan` : "Material Pilihan"}
              </h3>
            </div>
          </div>
          <div className="mt-auto border-t border-neutral-100 pt-3">
            {fabrics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {fabrics.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500 italic">
                Bahan kain dapat disesuaikan dengan kebutuhan pesanan.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Data-Driven Order Workflow */}
      <div className="mt-10 sm:mt-12">
        <h3 className="mb-6 text-lg font-bold text-neutral-900 sm:text-xl">
          Tahapan Alur Pemesanan
        </h3>
        {steps.length > 0 ? (
          <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li
                key={`${step}-${index}`}
                className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-2.5 flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                    {`Langkah ${index + 1}`}
                  </span>
                </div>
                <p className="text-sm font-semibold leading-snug text-neutral-800">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-500 shadow-sm">
            Alur pemesanan akan dikonfirmasi langsung oleh tim kami melalui WhatsApp.
          </div>
        )}
      </div>
    </section>
  );
}
