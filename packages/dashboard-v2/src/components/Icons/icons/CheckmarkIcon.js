import PropTypes from "prop-types";

import { withIconProps } from "../withIconProps";

export const CheckmarkIcon = withIconProps(({ size, circled, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="geometricPrecision"
    {...props}
  >
    {circled && <circle cx="16" cy="16" r="15" fill="transparent" stroke="currentColor" strokeWidth="2" />}
    <polygon
      fill="currentColor"
      points="22.45 11.19 23.86 12.61 14.44 22.03 9.69 17.28 11.1 15.86 14.44 19.2 22.45 11.19"
    />
  </svg>
));

CheckmarkIcon.propTypes = {
  ...CheckmarkIcon.propTypes,
  circled: PropTypes.bool,
};
