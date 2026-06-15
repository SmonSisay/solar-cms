import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F1F3D", // deep navy
          md: "#1A3260",
          lt: "#2563A8",
        },
        solar: {
          DEFAULT: "#F59E0B", // amber/gold — CTAs, accents
          lt: "#FCD34D",
          tint: "#FEF3C7",
        },
        eco: "#10B981", // green — savings, eco stats only
        surface: "#F8FAFC",
        "dark-bg": "#1E293B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        ethiopic: ["var(--font-noto-ethiop)", "sans-serif"],
      },
      borderRadius: {
        components: "8px",
        cards: "12px",
        sections: "20px",
      },
    },
  },
  plugins: [],
};
export default config;
