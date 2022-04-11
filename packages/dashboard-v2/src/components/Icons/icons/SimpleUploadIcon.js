import { withIconProps } from "../withIconProps";

export const SimpleUploadIcon = withIconProps(({ size, ...props }) => (
  <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" {...props}>
    <path
      fill="currentColor"
      d="M19,12a1,1,0,0,1,1,.88V17a3,3,0,0,1-2.82,3H3a3,3,0,0,1-3-2.82V13a1,1,0,0,1,2-.12V17a1,1,0,0,0,.88,1H17a1,1,0,0,0,1-.88V13A1,1,0,0,1,19,12ZM10,0h0a1,1,0,0,1,.62.22l.09.07,5,5a1,1,0,0,1-1.32,1.5l-.1-.08L11,3.41V13a1,1,0,0,1-2,.12V3.41L5.71,6.71a1,1,0,0,1-1.32.08l-.1-.08a1,1,0,0,1-.08-1.32l.08-.1,5-5L9.38.22h0L9.29.29A1.05,1.05,0,0,1,10,0Z"
    />
  </svg>
));
