"use client";

import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import { createOrderWhatsAppUrl } from "@/lib/whatsapp";
import { getAccessibleTextColor } from "@/lib/color";

export interface FormOrderProps {
  phone: string;
  namaBisnis: string;
  warnaUtama: string;
  produk: string;
  bahan: string;
  branding: string;
  jumlah: number;
  estimasiString: string;
}

export function FormOrder({
  phone,
  namaBisnis,
  warnaUtama,
  produk,
  bahan,
  branding,
  jumlah,
  estimasiString,
}: FormOrderProps) {
  const [nama, setNama] = useState("");
  const [ukuran, setUkuran] = useState("");
  const [catatan, setCatatan] = useState("");

  const textColor = getAccessibleTextColor(warnaUtama);

  // Combine customer name and notes cleanly
  const combinedNotes = [
    nama.trim() ? `Nama: ${nama.trim()}` : "",
    catatan.trim(),
  ]
    .filter(Boolean)
    .join(". ");

  const waUrl = createOrderWhatsAppUrl({
    phone,
    namaBisnis,
    produk,
    bahan,
    branding,
    jumlah,
    ukuran: ukuran.trim(),
    catatan: combinedNotes,
    estimasi: estimasiString,
  });

  return (
    <div className="flex flex-col space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="border-b border-neutral-100 pb-4">
        <h3 className="text-lg font-bold text-neutral-900 sm:text-xl">
          Formulir Pemesanan
        </h3>
        <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
          Detail pesanan Anda akan otomatis diformat dan dikirimkan ke WhatsApp resmi kami.
        </p>
      </div>

      {/* Synchronized Live Order Summary */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 text-xs text-neutral-700 sm:text-sm">
        <div className="font-semibold text-neutral-900">Ringkasan Spesifikasi:</div>
        <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1.5">
          <div>
            <span className="text-neutral-500">Produk:</span>{" "}
            <span className="font-semibold text-neutral-900">{produk}</span>
          </div>
          <div>
            <span className="text-neutral-500">Bahan:</span>{" "}
            <span className="font-semibold text-neutral-900">{bahan}</span>
          </div>
          <div>
            <span className="text-neutral-500">Branding:</span>{" "}
            <span className="font-semibold text-neutral-900">{branding}</span>
          </div>
          <div>
            <span className="text-neutral-500">Jumlah:</span>{" "}
            <span className="font-semibold text-neutral-900">{`${jumlah} pcs`}</span>
          </div>
        </div>
        <div className="mt-2.5 border-t border-neutral-200 pt-2 text-xs sm:text-sm">
          <span className="text-neutral-500">Estimasi Total:</span>{" "}
          <strong className="font-bold text-neutral-900">{estimasiString}</strong>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (typeof window !== "undefined") {
            window.location.href = waUrl;
          }
        }}
        className="space-y-4"
      >
        {/* Customer Name */}
        <div>
          <label
            htmlFor="order-nama"
            className="block text-sm font-semibold text-neutral-800"
          >
            Nama Pemesan / Kontak
          </label>
          <input
            id="order-nama"
            name="nama"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: Budi Santoso"
            className="mt-1.5 block w-full min-h-[48px] rounded-xl border border-neutral-300 bg-white px-3.5 py-3 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-colors"
          />
        </div>

        {/* Size Distribution */}
        <div>
          <label
            htmlFor="order-ukuran"
            className="block text-sm font-semibold text-neutral-800"
          >
            Rincian Ukuran
          </label>
          <input
            id="order-ukuran"
            name="ukuran"
            type="text"
            value={ukuran}
            onChange={(e) => setUkuran(e.target.value)}
            placeholder="Contoh: S: 10, M: 20, L: 20"
            className="mt-1.5 block w-full min-h-[48px] rounded-xl border border-neutral-300 bg-white px-3.5 py-3 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-colors"
          />
          <p className="mt-1 text-xs text-neutral-500">
            Tuliskan distribusi ukuran sesuai kebutuhan pesanan.
          </p>
        </div>

        {/* Notes / Design */}
        <div>
          <label
            htmlFor="order-catatan"
            className="block text-sm font-semibold text-neutral-800"
          >
            Catatan Desain & Pesanan
          </label>
          <textarea
            id="order-catatan"
            name="catatan"
            rows={3}
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: Kerah kombinasi warna, sablon di dada kiri dan punggung"
            className="mt-1.5 block w-full rounded-xl border border-neutral-300 bg-white p-3.5 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-colors"
          />
        </div>

        {/* WhatsApp Submit Link/Button */}
        <div className="pt-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: warnaUtama, color: textColor }}
            className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold shadow-md hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 focus-visible:ring-2 focus-visible:ring-neutral-900 transition-all cursor-pointer"
          >
            <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>Kirim Pesanan via WhatsApp</span>
          </a>
          <p className="mt-2 text-center text-xs text-neutral-500">
            Pesan otomatis tersusun rapi untuk dikirimkan ke WhatsApp resmi {namaBisnis}.
          </p>
        </div>
      </form>
    </div>
  );
}
