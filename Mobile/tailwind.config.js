/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DDE6ED', 
          dark: '#111c28',    
        },
        "font-color": {
          DEFAULT: '#111c28', 
          dark: '#DDE6ED',
        }
      },
      fontSize: {
        sm: 18,
        md: 24,
        lg: 28,
      }
    },
  },
  plugins: [],
};
