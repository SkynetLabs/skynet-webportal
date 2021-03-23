const defaultTheme = require("tailwindcss/defaultTheme");

const palette = {
  100: "#f5f7f7",
  200: "#d4dddb",
  300: "#9e9e9e",
  400: "#555555",
  500: "#242424",
  600: "#0d0d0d",
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
      desktop: "1088px",
      xl: "1280px",
      hires: "1408px",
      "2xl": "1536px",
    },
    backgroundColor: (theme) => ({ ...theme("colors"), palette }),
    borderColor: (theme) => ({ ...theme("colors"), palette }),
    textColor: (theme) => ({ ...theme("colors"), palette }),
    placeholderColor: (theme) => ({ ...theme("colors"), palette }),
    extend: {
      fontFamily: {
        sans: ["Sora", ...defaultTheme.fontFamily.sans],
        content: ["Source\\ Sans\\ Pro", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: "#00c65e",
        },
      },
      maxWidth: {
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
      backgroundColor: ["disabled"],
      textColor: ["disabled"],
    },
  },
  plugins: [],
};
