import { describe, expect, it, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { ImageGalleryModal } from "./ImageGalleryModal";

describe("ImageGalleryModal Component", () => {
  const sampleImages = [
    "/images/products/kaos.webp",
    "/images/products/kaos-crewneck.webp",
    "/images/products/kaos.jpg",
  ];

  it("renders null when isOpen is false", () => {
    const html = renderToString(
      <ImageGalleryModal
        isOpen={false}
        onClose={vi.fn()}
        images={sampleImages}
        title="Kaos"
      />
    );
    expect(html).toBe("");
  });

  it("renders null when images array is empty or undefined", () => {
    const htmlEmpty = renderToString(
      <ImageGalleryModal
        isOpen={true}
        onClose={vi.fn()}
        images={[]}
        title="Kaos"
      />
    );
    expect(htmlEmpty).toBe("");

    const htmlUndefined = renderToString(
      <ImageGalleryModal
        isOpen={true}
        onClose={vi.fn()}
        images={undefined as unknown as string[]}
        title="Kaos"
      />
    );
    expect(htmlUndefined).toBe("");
  });

  it("renders accessible dialog attributes and image counter when open", () => {
    const html = renderToString(
      <ImageGalleryModal
        isOpen={true}
        onClose={vi.fn()}
        images={sampleImages}
        initialIndex={0}
        title="Kaos Custom"
      />
    );

    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('aria-label="Galeri foto Kaos Custom"');
    expect(html).toContain("Kaos Custom");
    expect(html).toContain("1 / 3");
  });

  it("renders previous and next navigation controls when multiple images exist", () => {
    const html = renderToString(
      <ImageGalleryModal
        isOpen={true}
        onClose={vi.fn()}
        images={sampleImages}
        title="Kaos"
      />
    );

    expect(html).toContain('aria-label="Gambar sebelumnya"');
    expect(html).toContain('aria-label="Gambar berikutnya"');
  });

  it("omits previous and next buttons when only a single image is provided", () => {
    const html = renderToString(
      <ImageGalleryModal
        isOpen={true}
        onClose={vi.fn()}
        images={["/images/products/pdh.webp"]}
        title="PDH"
      />
    );

    expect(html).not.toContain('aria-label="Gambar sebelumnya"');
    expect(html).not.toContain('aria-label="Gambar berikutnya"');
    expect(html).not.toContain("Gambar 1 dari 1");
  });

  it("renders close button with accessible aria-label", () => {
    const html = renderToString(
      <ImageGalleryModal
        isOpen={true}
        onClose={vi.fn()}
        images={sampleImages}
        title="Kaos"
      />
    );

    expect(html).toContain('aria-label="Tutup modal galeri"');
    expect(html).toContain("data-modal-close");
    expect(html).toContain("Tutup");
  });

  it("renders CTA action button when onCtaClick is provided", () => {
    const html = renderToString(
      <ImageGalleryModal
        isOpen={true}
        onClose={vi.fn()}
        images={sampleImages}
        title="Kaos"
        ctaText="Hitung Estimasi"
        onCtaClick={vi.fn()}
      />
    );

    expect(html).toContain("Hitung Estimasi");
    expect(html).toContain("min-h-[48px]");
  });

  it("does not render CTA action button when onCtaClick is omitted (e.g. in gallery modal)", () => {
    const html = renderToString(
      <ImageGalleryModal
        isOpen={true}
        onClose={vi.fn()}
        images={sampleImages}
        title="Galeri Workshop"
      />
    );

    expect(html).not.toContain("Hitung Estimasi");
    expect(html).not.toContain("bg-brand-primary");
    expect(html).toContain("sm:justify-end");
  });

  it("renders image with accessible alt text and preserved aspect ratio classes", () => {
    const html = renderToString(
      <ImageGalleryModal
        isOpen={true}
        onClose={vi.fn()}
        images={sampleImages}
        title="Kaos"
      />
    );

    expect(html).toContain('src="/images/products/kaos.webp"');
    expect(html).toContain('alt="Detail contoh produk Kaos 1"');
    expect(html).toContain("object-contain");
  });

  it("contains no emoticons or emojis in rendered modal output", () => {
    const html = renderToString(
      <ImageGalleryModal
        isOpen={true}
        onClose={vi.fn()}
        images={sampleImages}
        title="Kaos"
        onCtaClick={vi.fn()}
      />
    );
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(emojiRegex.test(html)).toBe(false);
  });
});
