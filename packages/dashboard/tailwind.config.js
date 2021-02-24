module.exports = {
  purge: ["./src/**/*.js"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Metropolis", "Helvetica", "Arial", "Sans-Serif"],
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["disabled"],
      textColor: ["disabled"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
