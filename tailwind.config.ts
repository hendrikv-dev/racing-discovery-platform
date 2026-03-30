import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        apex: {
          blue: "#1D4ED8",
          accent: "#2563EB",
          background: "#F8FAFC",
          slate: "#0F172A",
          muted: "#64748B",
          alert: "#DC2626"
        }
      },
      boxShadow: {
        panel: "0 18px 40px rgba(15, 23, 42, 0.08)"
      },
      backgroundImage: {
        "apex-grid":
          "linear-gradient(to right, rgba(148, 163, 184, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.12) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
