const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./app/**/*.{ts,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        primary: colors.sky,
        profit: colors.teal,
        loss: colors.rose,
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/forms')],
};
