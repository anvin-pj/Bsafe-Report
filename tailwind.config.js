/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#E4F9F5',
          DEFAULT: '#30E3CA',
          dark: '#11999E',
        },
        secondary: '#40514E',
      },
    },
  },
  plugins: [],
}

