import { withIconProps } from "../withIconProps";

export const CircledArrowUpIcon = withIconProps(({ size, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="geometricPrecision"
    {...props}
  >
    <circle cx="16" cy="16" r="15" fill="transparent" stroke="currentColor" strokeWidth="2" />
    <path
      fill="currentColor"
      d="M16.21,10.51a1,1,0,0,1,1.32.09l4.95,5L21.06,17l-3.29-3.32V23h-2V13.75L12.48,17,11.07,15.6l5-5Z"
    />
  </svg>
));
