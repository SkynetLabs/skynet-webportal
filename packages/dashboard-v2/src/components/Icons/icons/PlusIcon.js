import { withIconProps } from "../withIconProps";

export const PlusIcon = withIconProps(({ size, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="geometricPrecision"
    {...props}
  >
    <path d="M18.67,0V13.33H32v5.34H18.67V32H13.33V18.67H0V13.33H13.33V0Z" fill="currentColor" />
  </svg>
));
