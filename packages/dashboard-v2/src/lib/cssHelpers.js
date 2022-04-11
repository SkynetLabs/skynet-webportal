import { css } from "styled-components";
import theme from "./theme";

export const screen = (breakpoint, style) => {
  const { screens } = theme;
  const minWidth = screens[breakpoint];

  if (typeof minWidth === "undefined") {
    throw ReferenceError(
      `Screen "${breakpoint}" is not defined in Tailwind config. Available values are: ${Object.keys(screens).join(
        ", "
      )}.`
    );
  }

  return css`
    @media (min-width: ${minWidth}) {
      ${style}
    }
  `;
};
