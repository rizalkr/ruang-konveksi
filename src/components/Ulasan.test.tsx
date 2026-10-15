import { describe, expect, it } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { ReviewItem, Ulasan } from "./Ulasan";

// Dedicated test fixtures
const fixtureEmptyReviews: ReviewItem[] = [];
const fixtureSampleReviews: ReviewItem[] = [
  {
    nama: "Budi Santoso",
    teks: "Pesan 50 pcs kaos untuk acara komunitas, jahitan rapi dan selesai tepat waktu sebelum hari H.",
  },
  {
    nama: "Siti Rahmawati",
    teks: "Kemeja PDH kantor hasilnya sangat memuaskan, bordir logo rapi dan bahannya adem.",
  },
  {
    nama: "Agus Pratama",
    teks: "Pelayanan ramah dan responsif lewat WhatsApp. Estimasi harga di awal sangat membantu perencanaan anggaran.",
  },
];

describe("Ulasan Component", () => {
  it("renders null when review array is empty", () => {
    const html = renderToString(<Ulasan ulasan={fixtureEmptyReviews} />);
    expect(html).toBe("");
  });

  it("renders null when review array is undefined", () => {
    const html = renderToString(<Ulasan ulasan={undefined} />);
    expect(html).toBe("");
  });

  it("renders review section and title when reviews are present", () => {
    const html = renderToString(<Ulasan ulasan={fixtureSampleReviews} />);
    expect(html).toContain('id="ulasan"');
    expect(html).toContain("Ulasan Pelanggan");
    expect(html).toContain("Pengalaman dan testimoni");
  });

  it("renders all customer names and review quotes accurately", () => {
    const html = renderToString(<Ulasan ulasan={fixtureSampleReviews} />);

    for (const review of fixtureSampleReviews) {
      expect(html).toContain(review.nama);
      expect(html).toContain(review.teks);
    }
  });

  it("renders star rating indicators with accessible role and label for each review card", () => {
    const html = renderToString(<Ulasan ulasan={fixtureSampleReviews} />);
    const starMatches = html.match(/aria-label="Rating 5 dari 5 bintang"/g);
    expect(starMatches).toHaveLength(fixtureSampleReviews.length);
    expect(html).toContain('role="img"');
  });

  it("renders null when reviews array contains only empty or whitespace items", () => {
    const html = renderToString(
      <Ulasan ulasan={[{ nama: "", teks: "   " }, { nama: "   ", teks: "" }]} />
    );
    expect(html).toBe("");
  });

  it("contains no emoticons or emojis in the rendered output", () => {
    const html = renderToString(<Ulasan ulasan={fixtureSampleReviews} />);
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    expect(emojiRegex.test(html)).toBe(false);
  });
});

