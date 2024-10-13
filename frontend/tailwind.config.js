/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container:{
      center: true,
      padding: "15px",
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "960px",
      xl: "1430px",
    },
    fontFamily:{
      primary:"var(--font-cormorant_upright)",
      secondary: "var(--font-open_sans)",
    },
    extend: {
      colors: {
        primary:{
          DEFAULT: "#100e0e",
        },
        secondary:{
          DEFAULT: "#787f8a",
        },
        accent:{
          DEFAULT: "#c7a17a",
          hover: "#a08161",
        },
      },
    },
  },
  plugins: [],
}

