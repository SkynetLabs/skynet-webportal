import PropTypes from "prop-types";

const propTypes = {
  /**
   * Size of the icon's bounding box.
   */
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

const defaultProps = {
  size: 32,
};

export const withIconProps = (IconComponent) => {
  IconComponent.propTypes = propTypes;
  IconComponent.defaultProps = defaultProps;

  return IconComponent;
};
