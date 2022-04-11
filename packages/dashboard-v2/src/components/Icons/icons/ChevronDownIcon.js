import { withIconProps } from "../withIconProps";

export const ChevronDownIcon = withIconProps(({ size, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M21.5 14.005 16.546 19 11.5 14"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      fillRule="evenodd"
      strokeLinejoin="round"
    />
  </svg>
));
