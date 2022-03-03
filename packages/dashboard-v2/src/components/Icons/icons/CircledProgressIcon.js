import { withIconProps } from "../withIconProps";

export const CircledProgressIcon = withIconProps(({ size, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="geometricPrecision"
    {...props}
  >
    <circle cx="16" cy="16" r="15" fill="transparent" stroke="currentColor" strokeWidth="2" />
    <rect fill="currentColor" x="15" y="22" width="2" height="4" />
    <rect fill="currentColor" x="8.34" y="20.66" width="4" height="2" transform="translate(-12.28 13.66) rotate(-45)" />
    <rect fill="currentColor" x="20.66" y="19.66" width="2" height="4" transform="translate(-8.97 21.66) rotate(-45)" />
    <rect fill="currentColor" x="6" y="15" width="4" height="2" />
    <rect fill="currentColor" x="22" y="15" width="4" height="2" />
    <rect fill="currentColor" x="9.34" y="8.34" width="2" height="4" transform="translate(-4.28 10.34) rotate(-45)" />
    <rect fill="currentColor" x="19.66" y="9.34" width="4" height="2" transform="translate(-0.97 18.34) rotate(-45)" />
    <rect fill="currentColor" x="15" y="6" width="2" height="4" />
  </svg>
));
