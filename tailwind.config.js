/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#09122C',
          DEFAULT: '#872341',
          light: '#BE3144',
        },
        secondary: {
          dark: '#BE3144',
          DEFAULT: '#E17564',
          light: '#fde8e8',
        },
      },
      scale: {
        '102': '1.02',
      }
    },
  },
  plugins: [],
}

