import PropTypes from "prop-types";
import styled from "styled-components";

/**
 * Primary UI component for user interaction
 */
export const Button = styled.button.attrs(({ disabled, $primary }) => ({
  type: "button",
  className: `px-6 py-2.5 rounded-full font-sans uppercase text-xs tracking-wide text-palette-600 transition-[filter]
            ${$primary ? "bg-primary" : "bg-white border-2 border-black"}
            ${disabled ? "saturate-50 brightness-125 cursor-default text-palette-400" : "hover:brightness-90"}`,
}))``;
Button.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  $primary: PropTypes.bool,
  /**
   * Prevent interaction on the button
   */
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  $primary: false,
  disabled: false,
};
