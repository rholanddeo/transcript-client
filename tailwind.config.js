/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',  // Ensure Vite+TypeScript files are scanned for Tailwind classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
