import PropTypes from "prop-types";

/**
 * Primary UI component for user interaction
 */
export const TextInputIcon = ({ icon, position, placeholder }) => {
  return (
    <div className={"flex flex-row items-center px-textInputIcon h-textInput rounded-full bg-palette-100"}>
      {position === "left" ? <div className={"w-buttonIconLg h-buttonIconLg"}>{icon}</div> : null}
      <input
        placeholder={placeholder}
        className={
          "w-full focus:outline-none mx-textInputHorizontal rounded-full bg-transparent " +
          "placeholder-palette-400 text-content tracking-inputPlaceholder text-textInput"
        }
      />
      {position === "right" ? <div className={"w-buttonIconLg h-buttonIconLg"}>{icon}</div> : null}
    </div>
  );
};

TextInputIcon.propTypes = {
  /**
   * Icon to place in text input
   */
  icon: PropTypes.element,
  /**
   * Side to place icon
   */
  position: PropTypes.oneOf(["left", "right"]),
  /**
   * Input placeholder
   */
  placeholder: PropTypes.string,
};
