import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBusinessSlugs, getBusinessConfig } from "@/config";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { KatalogKategori } from "@/components/KatalogKategori";
import { ProsesMOQ } from "@/components/ProsesMOQ";
import { PemesananContainer } from "@/components/PemesananContainer";
import { Galeri } from "@/components/Galeri";
import { Ulasan } from "@/components/Ulasan";
import { Lokasi } from "@/components/Lokasi";
import { Footer } from "@/components/Footer";
import { TombolWA } from "@/components/TombolWA";
import { isValidHexColor, deriveHoverColor } from "@/lib/color";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllBusinessSlugs().map((slug) => ({ slug }));
}

interface DemoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: DemoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = getBusinessConfig(slug);

  if (!config) {
    return {
      title: "Konveksi Tidak Ditemukan",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${config.nama} - Profil & Estimasi Konveksi`,
    description: config.tagline,
    icons: config.logo
      ? {
          icon: config.logo,
        }
      : undefined,
    robots: {
      index: false,
      follow: false,
    },
  };
}

/**
 * Default palette values used when config does not supply valid hex colors.
 */
const DEFAULT_PRIMARY = "#153E46";
const DEFAULT_ACCENT = "#A94F24";

/**
 * Resolves a config color value to a safe hex string, falling back to a default.
 */
function resolveColor(value: string | undefined, fallback: string): string {
  return isValidHexColor(value) ? value!.trim() : fallback;
}

/**
 * Determines which sections are available in the current config,
 * used by Navbar and Footer to only render links to existing sections.
 */
function getAvailableSections(config: ReturnType<typeof getBusinessConfig>) {
  if (!config) return [];

  const sections: { id: string; label: string }[] = [
    { id: "beranda", label: "Beranda" },
    { id: "katalog", label: "Katalog Produk" },
    { id: "spesifikasi-produksi", label: "Proses Produksi" },
    { id: "kalkulator", label: "Kalkulator" },
  ];

  if (config.galeri && config.galeri.length > 0) {
    sections.push({ id: "galeri", label: "Galeri" });
  }

  sections.push({ id: "lokasi", label: "Lokasi" });

  return sections;
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { slug } = await params;
  const config = getBusinessConfig(slug);

  if (!config) {
    notFound();
  }

  const primary = resolveColor(config.warnaUtama, DEFAULT_PRIMARY);
  const accent = resolveColor(config.warnaAksen, DEFAULT_ACCENT);
  const primaryHover = deriveHoverColor(primary);
  const sections = getAvailableSections(config);

  return (
    <div
      style={
        {
          "--color-primary": primary,
          "--color-primary-hover": primaryHover,
          "--color-accent": accent,
        } as React.CSSProperties
      }
      className="min-h-screen bg-page-bg text-ink"
    >
      <Navbar
        config={config}
        sections={sections}
      />
      <main className="space-y-16 pb-16">
        <Hero config={config} />
        <KatalogKategori kategori={config.kategori} />
        <ProsesMOQ produksi={config.produksi} moq={config.kalkulator.moq} />
        <PemesananContainer config={config} />
        {config.galeri && config.galeri.length > 0 && (
          <Galeri foto={config.galeri} namaBisnis={config.nama} />
        )}
        {config.ulasan && config.ulasan.length > 0 && (
          <Ulasan ulasan={config.ulasan} />
        )}
        <Lokasi
          alamat={config.alamat}
          jamOperasional={config.jamOperasional}
          petaUrl={config.petaUrl}
        />
        <TombolWA
          wa={config.wa}
          namaBisnis={config.nama}
          warnaUtama={config.warnaUtama}
        />
      </main>
      <Footer config={config} sections={sections} />
    </div>
  );
}

