import { withIconProps } from "../withIconProps";

export const CircledErrorIcon = withIconProps(({ size, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="geometricPrecision"
    {...props}
  >
    <circle cx="16" cy="16" r="15" fill="transparent" stroke="currentColor" strokeWidth="2" />
    <polygon
      fill="currentColor"
      fillRule="evenodd"
      points="21.72 10.25 23.14 11.66 18.19 16.61 23.14 21.56 21.72 22.98 16.77 18.02 11.82 22.98 10.41 21.56 15.36 16.61 10.41 11.66 11.82 10.25 16.77 15.2 21.72 10.25"
    />
  </svg>
));
