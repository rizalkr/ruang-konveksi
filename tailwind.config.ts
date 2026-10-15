import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "sans-serif"],
      },
      colors: {
        brand: {
          primary: "var(--color-primary)",
          "primary-hover": "var(--color-primary-hover)",
          accent: "var(--color-accent)",
        },
        page: {
          bg: "var(--color-page-bg)",
          surface: "var(--color-surface)",
        },
        ink: "var(--color-ink)",
        slate: "var(--color-slate)",
        mist: "var(--color-mist)",
        steel: "var(--color-steel)",
        "accent-surface": "var(--color-accent-surface)",
        "accent-text": "var(--color-accent-text)",
      },
    },
  },
  plugins: [],
};

export default config;
