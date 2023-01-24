/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '5h': '500px'
      },
      height: {
        '4h': '300px'
      }
    },
  },
  plugins: [],
}