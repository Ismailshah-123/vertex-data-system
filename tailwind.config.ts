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
        teal: {
          primary:   "#00e5b4",
          secondary: "#00c99a",
          muted:     "#00a07a",
          deep:      "#004d3a",
          darker:    "#001f17",
        },
        charcoal: {
          DEFAULT:   "#0a0c0b",
          50:        "#0d0f0e",
          100:       "#111413",
          200:       "#161918",
          300:       "#1a1f1d",
          400:       "#222927",
          500:       "#2a3d38",
        },
        border: {
          DEFAULT:   "#1e2b28",
          strong:    "#2a3d38",
        },
        text: {
          primary:   "#f0f5f3",
          secondary: "#a8bdb8",
          muted:     "#5a7570",
          ghost:     "#3a5550",
          dim:       "#2a3d38",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        ticker:      "ticker 30s linear infinite",
        "fade-slide": "fadeSlide 0.35s ease forwards",
        float:       "float 6s ease-in-out infinite",
        "logo-pulse": "logoPulse 3s ease-in-out infinite",
        glitch:      "glitch 0.2s steps(1) forwards",
        scanline:    "scanline 8s linear infinite",
      },
      keyframes: {
        ticker: {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
        fadeSlide: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        logoPulse: {
          "0%, 100%": { filter: "drop-shadow(0 0 6px #00e5b4)" },
          "50%":      { filter: "drop-shadow(0 0 20px #00e5b4)" },
        },
        glitch: {
          "0%":   { clipPath: "polygon(0 5%, 100% 5%, 100% 10%, 0 10%)",  transform: "translate(-4px, 0)" },
          "25%":  { clipPath: "polygon(0 50%, 100% 50%, 100% 55%, 0 55%)", transform: "translate(4px, 0)"  },
          "50%":  { clipPath: "polygon(0 80%, 100% 80%, 100% 90%, 0 90%)", transform: "translate(-2px, 0)" },
          "75%":  { clipPath: "polygon(0 25%, 100% 25%, 100% 30%, 0 30%)", transform: "translate(2px, 0)"  },
          "100%": { clipPath: "none",                                        transform: "translate(0, 0)"   },
        },
        scanline: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)"  },
        },
      },
      backgroundImage: {
        "grid-teal":
          "linear-gradient(rgba(0,229,180,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,180,0.025) 1px, transparent 1px)",
        "grid-teal-sm":
          "linear-gradient(rgba(0,229,180,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,180,0.015) 1px, transparent 1px)",
        "radial-teal":
          "radial-gradient(circle, rgba(0,229,180,0.07) 0%, transparent 70%)",
        "hero-radial":
          "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,229,180,0.06), transparent)",
      },
      backgroundSize: {
        grid:    "64px 64px",
        "grid-sm": "40px 40px",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "700": "700ms",
        "800": "800ms",
        "900": "900ms",
      },
      boxShadow: {
        "teal-sm": "0 0 20px rgba(0,229,180,0.2)",
        "teal-md": "0 0 40px rgba(0,229,180,0.3)",
        "teal-lg": "0 0 80px rgba(0,229,180,0.5)",
        "teal-btn": "0 8px 40px rgba(0,229,180,0.4)",
        "card":     "0 20px 60px rgba(0,229,180,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
