import PropTypes from "prop-types";
import styled from "styled-components";

/**
 * Primary UI component for user interaction
 */
export const Button = styled.button.attrs(({ $primary }) => ({
  type: "button",
  className: `px-6 py-3 rounded-full font-sans uppercase text-xs tracking-wide text-palette-600
            ${$primary ? "bg-primary" : "bg-white border-2 border-black"}`,
}))``;
Button.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  $primary: PropTypes.bool,
};

Button.defaultProps = {
  $primary: false,
};
