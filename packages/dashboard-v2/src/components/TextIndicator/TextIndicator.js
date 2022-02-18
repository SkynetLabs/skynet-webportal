import PropTypes from "prop-types";

/**
 * Primary UI component for user interaction
 */
export const TextIndicator = ({ variant }) => {
  return (
    <div
      className={`flex justify-center items-center w-textIndicator h-textIndicator text-textIndicator font-sans uppercase tracking-wide text-button bg-opacity-10 ${
        variant === "success"
          ? "text-primary bg-primary"
          : variant === "next"
          ? "text-next bg-next"
          : "text-error bg-error"
      }`}
    >
      {variant === "success" ? "success" : variant === "next" ? "next" : "error"}
    </div>
  );
};

TextIndicator.propTypes = {
  /**
   * Variant of text indicator
   */
  variant: PropTypes.oneOf(["success", "next", "error"]),
};

TextIndicator.defaultProps = {
  variant: "success",
};
