import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        fundo: "#09030E",
        painel: "#12071F",
        linha: "#2A1545",
        magenta: "#D934F7",
        violeta: "#8B2BE2",
        fucsia: "#D946EF",
        creme: "#F6F1EA",
        mudo: "#A79DB5",
      },
      fontFamily: { sora: ["var(--font-sora)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
