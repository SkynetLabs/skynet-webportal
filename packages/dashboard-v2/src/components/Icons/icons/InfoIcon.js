import { withIconProps } from "../withIconProps";

export const InfoIcon = withIconProps(({ size, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M16 5c6.075 0 11 4.925 11 11s-4.925 11-11 11S5 22.075 5 16 9.925 5 16 5zm0 2a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 6a1 1 0 0 1 .993.883L17 14v7a1 1 0 0 1-1.993.117L15 21v-7a1 1 0 0 1 1-1zm.01-3a1 1 0 0 1 .117 1.993L16 12a1 1 0 0 1-.117-1.993L16.01 10z"
      fill="currentColor"
      fillRule="nonzero"
    />
  </svg>
));
