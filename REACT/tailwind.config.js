/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Karma Template Colors
        karma: {
          yellow: '#ffba00',
          orange: '#ff6c00',
        },
        // MaleFashion Template Colors
        male: {
          red: '#e53637',
          black: '#000000',
          dark: '#111111',
        },
        // Neutral Colors
        gray: {
          light: '#f5f5f5',
          medium: '#b7b7b7',
          text: '#777777',
          dark: '#3d3d3d',
        },
        offwhite: '#f9f9ff',
        blacksoft: '#222222',
      },
      fontFamily: {
        primary: ['Roboto', 'Nunito Sans', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-karma': 'linear-gradient(90deg, #ffba00 0%, #ff6c00 100%)',
      },
      spacing: {
        'section': '60px',
        'section-md': '80px',
        'section-lg': '100px',
      },
    },
  },
  plugins: [],
}
