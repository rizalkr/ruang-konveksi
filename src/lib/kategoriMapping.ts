/**
 * Explicit canonical mapping between product catalog categories and calculator product keys.
 * Ensures consistent, deterministic synchronization between catalog exploration and the price calculator.
 */

const CANONICAL_ALIASES: Record<string, string> = {
  // PDH / Workwear
  pdh: "PDH",
  pdl: "PDH",
  "pdh / pdl": "PDH",
  "pdh/pdl": "PDH",
  "kemeja pdh": "PDH",
  "kemeja dinas": "PDH",
  "kemeja kerja": "PDH",
  "seragam kerja": "PDH",

  // Kaos / T-Shirt
  kaos: "Kaos",
  "kaos polo": "Kaos",
  "t-shirt": "Kaos",
  tshirt: "Kaos",
  polo: "Kaos",
  "kaos custom": "Kaos",

  // Jaket / Outerwear
  jaket: "Jaket",
  hoodie: "Jaket",
  bomber: "Jaket",
  varsity: "Jaket",
  parka: "Jaket",
  "jaket bomber": "Jaket",

  // Almamater
  almamater: "Almamater",
  "jas almamater": "Almamater",
  blazer: "Almamater",
  "jas kampus": "Almamater",

  // Wearpack / Safety
  wearpack: "Wearpack",
  "wearpack safety": "Wearpack",
  coverall: "Wearpack",
  "baju bengkel": "Wearpack",
  katelpak: "Wearpack",

  // Jersey
  jersey: "Jersey",
  "jersey sublim": "Jersey",
  "jersey printing": "Jersey",
  "kaos olahraga": "Jersey",

  // Seragam Sekolah
  "seragam sekolah": "Seragam Sekolah",
  seragam: "Seragam Sekolah",
  "seragam siswa": "Seragam Sekolah",
  "seragam batik": "Seragam Sekolah",
  "seragam pramuka": "Seragam Sekolah",
};

/**
 * Maps a catalog category name to an existing calculator product key.
 *
 * @param categoryName - The category label from the catalog or modal
 * @param availableProductKeys - Optional list of valid product keys configured in kalkulator.produk
 * @returns Matched calculator product key or undefined if no safe mapping exists.
 */
export function mapKategoriToProduk(
  categoryName: unknown,
  availableProductKeys?: string[]
): string | undefined {
  if (typeof categoryName !== "string") {
    return undefined;
  }

  const trimmed = categoryName.trim();
  if (!trimmed) {
    return undefined;
  }

  const normalizedInput = trimmed.toLowerCase();

  // If available keys are provided, search case-insensitively for an exact match first
  if (Array.isArray(availableProductKeys) && availableProductKeys.length > 0) {
    const directMatch = availableProductKeys.find(
      (key) => key.trim().toLowerCase() === normalizedInput
    );
    if (directMatch) {
      return directMatch;
    }

    // Try canonical alias mapping
    const aliasTarget = CANONICAL_ALIASES[normalizedInput];
    if (aliasTarget) {
      const aliasMatch = availableProductKeys.find(
        (key) => key.trim().toLowerCase() === aliasTarget.toLowerCase()
      );
      if (aliasMatch) {
        return aliasMatch;
      }
    }

    // No valid match in configured product keys - return undefined without guessing
    return undefined;
  }

  // Fallback when available keys are not provided: check known aliases
  const canonical = CANONICAL_ALIASES[normalizedInput];
  if (canonical) {
    return canonical;
  }

  return undefined;
}

