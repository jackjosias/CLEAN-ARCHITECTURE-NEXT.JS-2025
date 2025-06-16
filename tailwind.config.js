// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C3E50', // Bleu profond
        secondary: '#1ABC9C', // Turquoise clair
        tertiary: '#ECF0F1', // Gris clair
        neutral: '#FFFFFF', // Blanc
        placeholder: '#95A5A6', // Gris placeholder
        border: '#BDC3C7', // Gris bordure
        separator: '#E0E0E0', // Gris separation
      },
    },
  },
  plugins: [],
};