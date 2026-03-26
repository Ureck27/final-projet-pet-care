import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          50: "#F5F6FA",
          100: "#E8E9F0",
          200: "#D1D3E1",
          300: "#B9BCCF",
          400: "#8686AC",
          500: "#505081",
          600: "#272757",
          700: "#0F0E47",
          800: "#0A0A35",
          900: "#050520",
          950: "#020210",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
          50: "#F5F6FA",
          100: "#E8E9F0",
          200: "#D1D3E1",
          300: "#B9BCCF",
          400: "#8686AC",
          500: "#505081",
          600: "#272757",
          700: "#0F0E47",
          800: "#0A0A35",
          900: "#050520",
          950: "#020210",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          soft: "var(--accent-soft)",
          "soft-foreground": "var(--accent-soft-foreground)",
        },
        dark: "#0F0E47",
        lightAccent: "#8686AC",
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-poppins)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "xs": ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.025em" }],
        "sm": ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.025em" }],
        "base": ["1rem", { lineHeight: "1.5rem", letterSpacing: "0.025em" }],
        "lg": ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "0.025em" }],
        "xl": ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "0.025em" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "0.025em" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "0.025em" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "0.025em" }],
        "5xl": ["3rem", { lineHeight: "1", letterSpacing: "0.025em" }],
        "6xl": ["3.75rem", { lineHeight: "1", letterSpacing: "0.025em" }],
        "7xl": ["4.5rem", { lineHeight: "1", letterSpacing: "0.025em" }],
        "8xl": ["6rem", { lineHeight: "1", letterSpacing: "0.025em" }],
        "9xl": ["8rem", { lineHeight: "1", letterSpacing: "0.025em" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "soft": "0 2px 15px -3px rgba(148, 0, 211, 0.07), 0 10px 20px -2px rgba(237, 128, 233, 0.04)",
        "medium": "0 4px 25px -5px rgba(148, 0, 211, 0.1), 0 10px 10px -5px rgba(237, 128, 233, 0.04)",
        "large": "0 10px 40px -10px rgba(148, 0, 211, 0.15), 0 4px 25px -5px rgba(237, 128, 233, 0.1)",
        "glow": "0 0 20px rgba(148, 0, 211, 0.3)",
        "glow-purple": "0 0 30px rgba(237, 128, 233, 0.4)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "fade-in": "fadeIn 0.6s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "bounce-gentle": "bounceGentle 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      gradientColorStops: {
        "primary-gradient": ["#9400D3", "#ED80E9"],
        "secondary-gradient": ["#ED80E9", "#9400D3"],
        "warm-gradient": ["#272757", "#0F0E47"],
        "cool-gradient": ["#D3D3FF", "#8686AC"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "primary-gradient": "linear-gradient(135deg, #9400D3 0%, #ED80E9 100%)",
        "secondary-gradient": "linear-gradient(135deg, #ED80E9 0%, #9400D3 100%)",
        "soft-gradient": "linear-gradient(135deg, #F8F9FF 0%, #FFFFFF 100%)",
        "dark-gradient": "linear-gradient(135deg, #0F0E47 0%, #272757 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
