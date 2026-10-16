"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { mapKategoriToProduk } from "@/lib/kategoriMapping";

export interface TargetProductSelection {
  produk: string;
  timestamp: number;
}

export interface PemesananContextValue {
  selectedProduk: string | null;
  targetSelection: TargetProductSelection | null;
  selectProduk: (
    kategoriOrProdukName: string,
    availableProducts?: Record<string, number> | string[]
  ) => void;
}

const defaultContextValue: PemesananContextValue = {
  selectedProduk: null,
  targetSelection: null,
  selectProduk: () => {},
};

const PemesananContext = createContext<PemesananContextValue>(defaultContextValue);

export function usePemesanan(): PemesananContextValue {
  const context = useContext(PemesananContext);
  return context || defaultContextValue;
}

interface PemesananProviderProps {
  children: React.ReactNode;
}

/**
 * Client Provider synchronizing product selections from Catalog cards and Gallery modal
 * directly into the Calculator state and WhatsApp ordering form.
 */
export function PemesananProvider({ children }: PemesananProviderProps) {
  const [selectedProduk, setSelectedProduk] = useState<string | null>(null);
  const [targetSelection, setTargetSelection] = useState<TargetProductSelection | null>(null);

  const selectProduk = useCallback(
    (
      kategoriOrProdukName: string,
      availableProducts?: Record<string, number> | string[]
    ) => {
      const keys = Array.isArray(availableProducts)
        ? availableProducts
        : availableProducts && typeof availableProducts === "object"
        ? Object.keys(availableProducts)
        : undefined;

      const mapped = mapKategoriToProduk(kategoriOrProdukName, keys);

      if (mapped) {
        setSelectedProduk(mapped);
        setTargetSelection({ produk: mapped, timestamp: Date.now() });
      }

      // Smooth scroll to kalkulator section
      if (typeof window !== "undefined") {
        const targetElement = document.getElementById("kalkulator");
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    },
    []
  );

  const value = useMemo(
    () => ({
      selectedProduk,
      targetSelection,
      selectProduk,
    }),
    [selectedProduk, targetSelection, selectProduk]
  );

  return (
    <PemesananContext.Provider value={value}>
      {children}
    </PemesananContext.Provider>
  );
}

