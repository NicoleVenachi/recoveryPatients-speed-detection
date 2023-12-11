/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      'main': '#0f172a',
      'secondary': '#1e90ff',
      'light': '#e2e8f0'
    }
  },
  plugins: [],
}
