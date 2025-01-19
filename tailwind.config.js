/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#e6f7ff',
          DEFAULT: '#1890ff',
          dark: '#096dd9',
        },
        secondary: {
          light: '#f6ffed',
          DEFAULT: '#52c41a',
          dark: '#389e0d',
        },
      },
      scale: {
        '102': '1.02',
      }
    },
  },
  plugins: [],
}

