import { withIconProps } from "../withIconProps";

export const LockClosedIcon = withIconProps(({ size, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M14.083 6.383A5 5 0 0 1 19.53 7.46a5.09 5.09 0 0 1 1.31 2.29 1.002 1.002 0 0 1-1.94.5 3.08 3.08 0 0 0-.78-1.38A3 3 0 0 0 13 11v2h8a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3v-2a5 5 0 0 1 3.083-4.617zM21 15H11a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1zm-4 2v5h-2v-5h2z"
      fill="currentColor"
      fillRule="nonzero"
    />
  </svg>
));
