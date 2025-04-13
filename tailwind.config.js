/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta escura e atmosférica para fantasia sombria
        primary: {
          DEFAULT: '#5D3FD3', // Roxo profundo
          dark: '#3A1E78',
          light: '#7B68EE',
        },
        secondary: {
          DEFAULT: '#121212', // Preto carvão
          dark: '#0A0A0A',
          light: '#1E1E1E',
        },
        accent: {
          DEFAULT: '#D4AF37', // Dourado
          dark: '#AA8C2C',
          light: '#F1C40F',
        },
        emerald: {
          DEFAULT: '#2ECC71', // Verde-esmeralda
          dark: '#27AE60',
          light: '#58D68D',
        },
        sepia: {
          DEFAULT: '#704214', // Tom sépia
          dark: '#5E370F',
          light: '#8B572A',
        },
        surface: {
          DEFAULT: '#1A1A1A', // Superfície escura
          dark: '#141414',
          light: '#2C2C2C',
        },
      },
      fontFamily: {
        // Tipografia serifada para títulos
        title: ['Playfair Display', 'Garamond', 'serif'],
        // Sans-serif para corpo de texto
        body: ['Inter', 'Open Sans', 'sans-serif'],
        // Manter fontes anteriores para compatibilidade
        medieval: ['MedievalSharp', 'cursive'],
        fantasy: ['Fondamento', 'cursive'],
      },
      boxShadow: {
        'inner-glow': 'inset 0 0 8px rgba(212, 175, 55, 0.3)',
        'outer-glow': '0 0 15px rgba(212, 175, 55, 0.2)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
