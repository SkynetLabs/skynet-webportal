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
        terminal: "640px",
        tablet: "640px",
        desktop: "1024px",
        content: "992px",
        layout: "1408px",
      },
      lineHeight: {
        16: "4rem",
      },
      backgroundImage: {
        mobile: "url('/bg-mobile.svg')",
        desktop: "url('/bg.svg')",
        column: `linear-gradient(to right, ${colors.palette[100]}, ${colors.palette[100]} calc(50% - 288px), transparent calc(50% - 288px))`,
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    plugin(function ({ addBase, theme }) {
      addBase({
        body: {
          color: theme("textColor.palette.600"),
          backgroundColor: theme("backgroundColor.palette.500"),
        },
      });
    }),
  ],
};
