import { action } from "@storybook/addon-actions";
import "normalize.css";
import "@fontsource/sora";
import "@fontsource/source-sans-pro";
import "./tailwind.css";

// Gatsby's Link overrides:
// Gatsby Link calls the `enqueue` & `hovering` methods on the global variable ___loader.
// This global object isn't set in storybook context, requiring you to override it to empty functions (no-op),
// so Gatsby Link doesn't throw any errors.
global.___loader = {
  enqueue: () => {},
  hovering: () => {},
};
// This global variable is prevents the "__BASE_PATH__ is not defined" error inside Storybook.
global.__BASE_PATH__ = "/";

// Navigating through a gatsby app using gatsby-link or any other gatsby component will use the `___navigate` method.
// In Storybook it makes more sense to log an action than doing an actual navigate. Checkout the actions addon docs for more info: https://github.com/storybookjs/storybook/tree/master/addons/actions.

window.___navigate = (pathname) => {
  action("NavigateTo:")(pathname);
};

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: "fullscreen",
  viewport: {
    viewports: {
      mobile: {
        name: "Mobile",
        styles: {
          height: "667px",
          width: "375px",
        },
        type: "mobile",
      },
      tablet: {
        name: "Tablet",
        styles: {
          height: "1366px",
          width: "1024px",
        },
        type: "tablet",
      },
    },
  },
  backgrounds: {
    default: "light",
    values: [
      { name: "dark", value: "#0d0d0d" },
      { name: "light", value: "#ffffff" },
    ],
  },
};
