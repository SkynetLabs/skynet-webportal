import { withIconProps } from "../withIconProps";

export const SearchIcon = withIconProps(({ size, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      fill="currentColor"
      d="M9,0a9,9,0,0,1,7,14.62l3.68,3.67a1,1,0,0,1-1.32,1.5l-.1-.08L14.62,16A9,9,0,1,1,9,0ZM9,2a7,7,0,1,0,4.87,12l.07-.09.09-.07A7,7,0,0,0,9,2Z"
    />
  </svg>
));
