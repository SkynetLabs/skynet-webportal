import PropTypes from "prop-types";

/**
 * Primary UI component for user interaction
 */
export const IconButton = ({ primary, size, icon, ...props }) => {
  return (
    <button
      type="button"
      className={`${
        size === "small"
          ? "h-iconButtonSm w-buttonIconSm"
          : size === "large"
          ? "h-iconButtonLg w-iconButtonLg"
          : "w-iconButton h-iconButton"
      } rounded-full 
            inline-flex justify-center items-center
            ${primary ? "bg-primary" : null}`}
      {...props}
    >
      <div
        className={
          size === "small"
            ? "h-buttonIconSm w-buttonIconSm"
            : size === "large"
            ? "h-buttonIconLg w-buttonIconLg"
            : "h-buttonIcon w-buttonIcon"
        }
      >
        {icon}
      </div>
    </button>
  );
};

IconButton.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  primary: PropTypes.bool,
  /**
   * How large should the button be?
   */
  size: PropTypes.oneOf(["small", "medium", "large"]),
  /**
   * Icon component
   */
  icon: PropTypes.element.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};

IconButton.defaultProps = {
  backgroundColor: null,
  primary: false,
  size: "medium",
  onClick: undefined,
};
