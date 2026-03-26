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
          50: "#f0f1ff",
          100: "#e5e6ff",
          200: "#c9beff",
          300: "#a999ff",
          400: "#8494ff",
          500: "#6367ff",
          600: "#4f4ee5",
          700: "#3e3eb2",
          800: "#2d2d81",
          900: "#1d1d4d",
          950: "#0b0c1a",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
          50: "#f5f6ff",
          100: "#ebedff",
          200: "#d9dbff",
          300: "#b8bcff",
          400: "#8494ff",
          500: "#6367ff",
          600: "#4f4ee5",
          700: "#3e3eb2",
          800: "#2d2d81",
          900: "#1d1d4d",
          950: "#0b0c1a",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          soft: "var(--accent-soft)",
          "soft-foreground": "var(--accent-soft-foreground)",
        },
        dark: "#022859",
        lightAccent: "#4BB2F2",
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
        "soft": "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        "medium": "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "large": "0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 25px -5px rgba(0, 0, 0, 0.1)",
        "glow": "0 0 20px rgba(99, 102, 241, 0.3)",
        "glow-purple": "0 0 30px rgba(139, 92, 246, 0.4)",
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
        "primary-gradient": ["#0554F2", "#0460D9"],
        "secondary-gradient": ["#03318C", "#4BB2F2"],
        "warm-gradient": ["#0554F2", "#022859"],
        "cool-gradient": ["#4BB2F2", "#0460D9"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "primary-gradient": "linear-gradient(135deg, #0554F2 0%, #0460D9 100%)",
        "secondary-gradient": "linear-gradient(135deg, #03318C 0%, #4BB2F2 100%)",
        "soft-gradient": "linear-gradient(135deg, #ffffff 0%, #E5E7EB 100%)",
        "dark-gradient": "linear-gradient(135deg, #022859 0%, #03318C 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
