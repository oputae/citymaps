import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#070b12",
          raised: "#0c1220",
          border: "#1e2a3a",
        },
        ink: {
          muted: "#6b7280",
          soft: "#9ca3af",
        },
        accent: {
          DEFAULT: "#38bdf8",
          dim: "#0ea5e9",
          glow: "rgba(56, 189, 248, 0.14)",
        },
        poster: {
          deep: "#0c1220",
          line: "#7dd3fc",
          water: "#1e3a5f",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-syne)", "var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        panel:
          "0 0 0 1px rgba(255,255,255,0.06), 0 24px 48px -12px rgba(0,0,0,0.55), 0 0 50px -24px rgba(56,189,248,0.12)",
        poster: "0 32px 64px -16px rgba(0,0,0,0.65), 0 0 40px -16px rgba(14,165,233,0.12)",
        "glow-sm": "0 0 24px -4px rgba(56, 189, 248, 0.35)",
        "glow-cyan": "0 0 28px -6px rgba(34, 211, 238, 0.3)",
      },
      animation: {
        "float-slow": "float-slow 5.5s ease-in-out infinite",
        drift: "drift 18s ease-in-out infinite",
        shimmer: "shimmer 2.5s ease-in-out infinite",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(2%, -1%) scale(1.03)" },
          "66%": { transform: "translate(-1%, 2%) scale(0.98)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.85" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
