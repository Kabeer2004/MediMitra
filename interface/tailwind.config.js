const { lightFormat } = require("date-fns");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        ipad: "1024px", // Custom breakpoint for iPad
        xs: "320px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      fontFamily: {
        inter: ["Inter"],
        mid: ["Inter"],
        dm: ["DM Sans"],
      },
      colors: {
        "custom-purple": "#8E5ACC",
        "custom-purple2": "#AC7CE5",
        "custom-purple3": "#CDA3FF",
        darkPurple: "#3F1E69",
        veryDarkPurple: "#0F081A",
        buttonPurple: "#2B1549",
        melrose: "#B3ACFC",
        lilac: "#D6A7D4",
        sinbad: "#A7D6D6",
        akaroa: "#D5D6A7",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
