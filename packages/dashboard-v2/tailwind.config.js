const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

const colors = {
  primary: { light: "#33D17E", DEFAULT: "#00c65e" },
  warning: "#ffd567",
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
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1440px",
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
        body: ["21px", { lineHeight: "1.58" }],
        tab: ["18px", "28px"],
      },
      backgroundColor: ["disabled"],
      textColor: ["disabled"],
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 3s ease-in-out infinite",
      },
      width: {
        page: "100%",
        "page-md": "640px",
        "page-lg": "896px",
        "page-xl": "1312px",
      },
      minWidth: {
        button: "112px",
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        body: {
          color: theme("textColor.palette.600"),
        },
      });
    }),
  ],
};
