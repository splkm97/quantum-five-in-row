/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '20': 'repeat(20, minmax(0, 1fr))',
      }
    },
  },
  safelist: [ // Add safelist for grid classes
    'grid-cols-20',
    'w-[600px]',
    'h-[600px]',
    'w-[30px]',
    'h-[30px]',
  ],
  plugins: [],
}
