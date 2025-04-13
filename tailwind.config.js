/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6D28D9', // Roxo para tema de RPG
          dark: '#4C1D95',
          light: '#8B5CF6',
        },
        secondary: {
          DEFAULT: '#1F2937', // Cinza escuro
          dark: '#111827',
          light: '#374151',
        },
        accent: {
          DEFAULT: '#F59E0B', // Laranja para destaque
          dark: '#D97706',
          light: '#FBBF24',
        },
      },
      fontFamily: {
        medieval: ['MedievalSharp', 'cursive'],
        fantasy: ['Fondamento', 'cursive'],
      },
    },
  },
  plugins: [],
}
