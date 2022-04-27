import cn from "classnames";
import PropTypes from "prop-types";
import styled from "styled-components";

/**
 * Primary UI component for user interaction
 */
export const Button = styled.button.attrs(({ as: polymorphicAs, disabled, $primary, type }) => {
  // We want to default to type=button in most cases, but sometimes we use this component
  // as a polymorphic one (i.e. for links), and then we should avoid setting `type` property,
  // as it breaks styling in Safari.
  const typeAttr = polymorphicAs && polymorphicAs !== "button" ? undefined : type;

  return {
    type: typeAttr,
    className: cn(
      "px-6 py-2.5 inline-block rounded-full font-sans uppercase text-xs tracking-wide transition-[opacity_filter]",
      {
        "bg-primary text-palette-600": $primary,
        "bg-white border-2 border-black text-palette-600": !$primary,
        "cursor-not-allowed opacity-60": disabled,
        "hover:brightness-90": !disabled,
      }
    ),
  };
})``;

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
