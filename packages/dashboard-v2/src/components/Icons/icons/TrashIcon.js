import { withIconProps } from "../withIconProps";

export const TrashIcon = withIconProps(({ size, ...props }) => (
  <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.01 15.33" {...props}>
    <path
      fill="currentColor"
      d="M8.33,0a2.33,2.33,0,0,1,2.33,2.17v.5H13a1,1,0,0,1,.12,2h-.46V13a2.32,2.32,0,0,1-2.17,2.33H3.67a2.33,2.33,0,0,1-2.33-2.17V4.67H1a1,1,0,0,1-.12-2H3.33V2.33A2.33,2.33,0,0,1,5.51,0H8.33Zm-5,4.67V13a.34.34,0,0,0,.27.33h6.73a.33.33,0,0,0,.33-.26V4.67ZM8.33,2H5.67a.33.33,0,0,0-.33.27v.4H8.66V2.33A.33.33,0,0,0,8.4,2Z"
    />
  </svg>
));
