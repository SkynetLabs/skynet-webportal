import PropTypes from "prop-types";

/**
 * Primary UI component for user interaction
 */
export const IconButtonText = ({ primary, label, icon, ...props }) => {
  return (
    <button
      type="button"
      className={`flex justify-center items-center w-iconButtonTextWidth py-iconButtonTextY`}
      {...props}
    >
      <div className={`h-buttonTextIcon w-buttonTextIcon ${primary ? "text-primary" : "text-palette-600"}`}>{icon}</div>
      <p
        className={"ml-iconButtonTextTextLeft tracking-wide text-iconButtonText font-sans font-light text-palette-600"}
      >
        {label}
      </p>
    </button>
  );
};

IconButtonText.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  primary: PropTypes.bool,
  /**
   * Button Label
   */
  label: PropTypes.string.isRequired,
  /**
   * Icon component
   */
  icon: PropTypes.element.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};

IconButtonText.defaultProps = {
  primary: false,
  label: "",
  onClick: undefined,
};
