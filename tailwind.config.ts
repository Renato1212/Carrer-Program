import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0a0c10",
          elevated: "#10131a",
          surface: "#161a23",
          hover: "#1c2230",
        },
        line: {
          DEFAULT: "#1f2532",
          strong: "#2a3142",
        },
        ink: {
          DEFAULT: "#e6e9ef",
          muted: "#9aa3b2",
          subtle: "#6b7383",
          faint: "#4a5160",
        },
        accent: {
          DEFAULT: "#7aa2ff",
          dim: "#3a4d80",
        },
        long: {
          DEFAULT: "#3fb6a8",
          dim: "#1f5953",
        },
        short: {
          DEFAULT: "#e0a458",
          dim: "#6a4d29",
        },
        signal: {
          warn: "#d97757",
          info: "#6aa3d9",
        },
        source: {
          career: "#a78bfa",
          dalton: "#7aa2ff",
          axia: "#e0a458",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: {
        tightish: "-0.011em",
        widish: "0.03em",
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.02) inset, 0 0 0 1px rgba(255,255,255,0.04)",
        glow: "0 0 0 1px rgba(122,162,255,0.35), 0 8px 30px -10px rgba(122,162,255,0.25)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
      },
      animation: {
        "fade-in": "fade-in 280ms ease-out",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
