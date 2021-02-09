const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.js"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Metropolis", "Helvetica", "Arial", "Sans-Serif"],
      },
      colors: {
        orange: colors.green,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
