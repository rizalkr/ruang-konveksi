import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBusinessSlugs, getBusinessConfig } from "@/config";
import { Hero } from "@/components/Hero";
import { KatalogKategori } from "@/components/KatalogKategori";
import { ProsesMOQ } from "@/components/ProsesMOQ";
import { PemesananContainer } from "@/components/PemesananContainer";
import { getAccessibleTextColor } from "@/lib/color";

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
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { slug } = await params;
  const config = getBusinessConfig(slug);

  if (!config) {
    notFound();
  }

  const brandTextColor = getAccessibleTextColor(config.warnaUtama);

  return (
    <div
      style={
        {
          "--brand-primary": config.warnaUtama,
          "--brand-text": brandTextColor,
        } as React.CSSProperties
      }
      className="min-h-screen bg-neutral-50 text-neutral-900"
    >
      <main className="space-y-16 pb-16">
        <Hero config={config} />
        <KatalogKategori kategori={config.kategori} />
        <ProsesMOQ produksi={config.produksi} moq={config.kalkulator.moq} />
        <PemesananContainer config={config} />
      </main>
    </div>
  );
}

