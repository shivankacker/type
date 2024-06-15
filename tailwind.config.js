/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--type-primary)",
        secondary: "var(--type-secondary)",
        secondaryActive: "var(--type-secondaryActive)",
        primaryText: "var(--type-primaryText)",
      }
    },
  },
  plugins: [],
}

