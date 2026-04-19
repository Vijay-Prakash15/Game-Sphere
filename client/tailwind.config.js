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
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        float: "float 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
