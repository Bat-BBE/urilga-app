import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        night: "#181321",
        dusk: "#2b1f2e",
        gold: "#c9a24b",
        goldBright: "#e8c877",
        felt: "#f2ead9",
        wood: "#5b3a24",
        ceremony: "#7d2e2e",
      },
      fontFamily: {
        display: ["Cormorant", "serif"],
        body: ["PT Serif", "serif"],
        utility: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
