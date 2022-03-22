import { withIconProps } from "../withIconProps";

export const ArrowRightIcon = withIconProps(({ size, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M10 15h9.616L16.3 11.71l1.409-1.42 4.995 4.954a1 1 0 0 1 .09 1.32l-.084.094-5 5.046-1.42-1.408 3.265-3.295L10 17v-2z"
      fill="currentColor"
      fillRule="nonzero"
    />
  </svg>
));
