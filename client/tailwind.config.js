export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ IMPORTANT
  ],
  theme: {
    extend: {
    fontFamily: {
      game: ["Orbitron", "sans-serif"],
    },
  },
  },
  plugins: [],
};