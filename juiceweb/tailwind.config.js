/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "juicy-orange": "#FF6B00",
        "juicy-lime": "#39FF14",
        "juicy-purple": "#2D0A4E",
        "juicy-gold": "#FFD700",
        "juicy-dark": "#0A0A0A",
        "juicy-card": "#111111",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        heading: ["Orbitron", "sans-serif"],
      },
    },
  },
  plugins: [],
}
