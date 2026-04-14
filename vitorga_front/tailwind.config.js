/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#023226',
          light: '#034d3a',
          dark: '#01211a',
        },
        gold: {
          DEFAULT: '#dcab24',
          light: '#e9c45a',
          dark: '#b8901e',
        },
        cream: {
          DEFAULT: '#fdfbf7',
          dark: '#f5f0e6',
        },
        charcoal: {
          DEFAULT: '#1a1a1a',
          light: '#333333',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
