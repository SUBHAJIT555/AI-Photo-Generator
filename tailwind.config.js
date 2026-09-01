/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C21820",
        tertiary: "#ee3139",
      },
      fontFamily: {
        display: ["Orbitron", "cornea", "sans-serif"],
        cornea: ["Orbitron", "cornea", "sans-serif"],
        golonto: ["Orbitron", "golonto", "sans-serif"],
      },
      scale: {
        98: "0.98",
      },
    },
  },
  
  plugins: [],
}


