/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './*.html',
    './js/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f766e',
        accent: '#0284c7'
      }
    }
  },
  plugins: []
};
