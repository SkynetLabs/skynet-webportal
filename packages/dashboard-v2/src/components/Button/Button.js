import cn from "classnames";
import PropTypes from "prop-types";
import styled from "styled-components";

/**
 * Primary UI component for user interaction
 */
export const Button = styled.button.attrs(({ disabled, $primary, type }) => ({
  type,
  className: cn("px-6 py-2.5 rounded-full font-sans uppercase text-xs tracking-wide transition-[opacity_filter]", {
    "bg-primary text-palette-600": $primary,
    "bg-white border-2 border-black text-palette-600": !$primary,
    "cursor-not-allowed opacity-60": disabled,
    "hover:brightness-90": !disabled,
  }),
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
  /**
   * Type of button (button / submit)
   */
  type: PropTypes.oneOf(["button", "submit"]),
};

Button.defaultProps = {
  $primary: false,
  disabled: false,
  type: "button",
};
