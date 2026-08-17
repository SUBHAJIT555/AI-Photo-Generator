/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#003087",
        tertiary: "#1A4FA3",
      },
      fontFamily: {
        display: ["cornea", "sans-serif"],
      },
      scale: {
        98: "0.98",
      },
    },
  },
  
  plugins: [],
}


