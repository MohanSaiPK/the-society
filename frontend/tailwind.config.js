/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        landing: "url('/bg.jpg')",
      },
      fontFamily: {
        greatVibes: ["Great Vibes", "cursive"],
        ptSerif: ["PT Serif", "serif"],
      },
    },
  },
  plugins: [],
};
