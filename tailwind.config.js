/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
    },
    extend: {
      colors: {
        washi: "#E9E0CD",        // page — aged paper
        "washi-deep": "#E0D6BF",
        paper: "#F7F2E6",        // cards — fresh washi
        "paper-soft": "#F1EAD9",
        sumi: "#211C16",         // ink
        "sumi-soft": "#6E655A",
        "sumi-faint": "#A79C8B",
        line: "#D8CDB6",
        "line-soft": "#E6DDC9",
        shu: "#C0392B",          // vermilion seal
        "shu-deep": "#9A271C",
        "shu-soft": "#E7C7BE",
        kon: "#2C3A52",          // indigo — secondary
        "kon-soft": "#C9D1DC",
        matcha: "#6B7A4F",
      },
      fontFamily: {
        display: ['"Shippori Mincho"', "ui-serif", "Georgia", "serif"],
        sans: ['"Zen Kaku Gothic New"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        paper: "0 1px 0 0 #FFFDF7 inset, 0 18px 40px -24px rgba(33,28,22,0.45)",
        "paper-sm": "0 1px 0 0 #FFFDF7 inset, 0 8px 20px -16px rgba(33,28,22,0.4)",
        seal: "0 2px 0 0 rgba(154,39,28,0.35), 0 10px 24px -10px rgba(192,57,43,0.5)",
      },
      keyframes: {
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "seal-in": {
          "0%": { opacity: "0", transform: "scale(0.8) rotate(-6deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0)" },
        },
        "dash-flow": {
          to: { "stroke-dashoffset": "-12" },
        },
      },
      animation: {
        "rise-in": "rise-in 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "seal-in": "seal-in 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        "dash-flow": "dash-flow 1s linear infinite",
      },
    },
  },
  plugins: [],
};
