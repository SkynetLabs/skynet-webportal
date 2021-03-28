const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

const colors = {
  primary: "#00c65e",
  error: "#ED5454",
  palette: {
    100: "#f5f7f7",
    200: "#d4dddb",
    300: "#9e9e9e",
    400: "#555555",
    500: "#242424",
    600: "#0d0d0d",
  },
};

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      sm: "640px",
      tablet: "640px",
      md: "768px",
      lg: "1024px",
      desktop: "1024px",
      xl: "1280px",
      hires: "1408px",
      "2xl": "1536px",
    },
    backgroundColor: (theme) => ({ ...theme("colors"), ...colors }),
    borderColor: (theme) => ({ ...theme("colors"), ...colors }),
    textColor: (theme) => ({ ...theme("colors"), ...colors }),
    placeholderColor: (theme) => ({ ...theme("colors"), ...colors }),
    extend: {
      fontFamily: {
        sans: ["Sora", ...defaultTheme.fontFamily.sans],
        content: ["Source\\ Sans\\ Pro", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        xxs: ["0.625rem", "0.75rem"],
      },
      maxWidth: {
        column: "320px",
        tablet: "640px",
        desktop: "1024px",
        content: "992px",
        layout: "1408px",
      },
      lineHeight: {
        16: "4rem",
      },
    },
  },
  variants: {
    extend: {
      animation: ["hover"],
      backgroundColor: ["disabled"],
      textColor: ["disabled"],
      margin: ["first"],
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        body: { color: theme("textColor.palette.600") },
      });
    }),
  ],
};
