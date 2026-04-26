/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        surface: {
          light: "#ffffff",
          dark: "#111827",
        },
        background: {
          light: "#f9fafb",
          dark: "#0f172a",
        },
      },
    },
  },
  plugins: [],
};