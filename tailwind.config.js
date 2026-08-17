/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F758B",
        tertiary: "#6A93A8",
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


