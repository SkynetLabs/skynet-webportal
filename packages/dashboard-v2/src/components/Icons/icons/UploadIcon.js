import { withIconProps } from "../withIconProps";

export const UploadIcon = withIconProps((props) => (
  <svg
    width="64"
    height="55"
    viewBox="0 0 64 55"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    shapeRendering="geometricPrecision"
    {...props}
  >
    <g>
      <path
        fillRule="evenodd"
        clipRule="evenOdd"
        fill="#00C65E"
        d="M26.1,47.3V33h-5.7L31,22l10.3,11H36v18L26.1,47.3z"
      />
      <g>
        <path
          fill="none"
          stroke="#0D0D0D"
          strokeWidth="2"
          d="M42,41h9c6.6,0,12-5.4,12-12c0-5.9-4-11-10-11c0-5-3-9-9-9h-1c-2.7-4.9-8-8-14-8c-8.8,0-16,7.2-16,16
            C6.4,17,1,22.4,1,29c0,6.6,5.4,12,12,12h9"
        />
        <path fill="none" stroke="#0D0D0D" strokeWidth="2" d="M19,18c0-6.1,5-11,10-11" />
        <path
          fill="none"
          stroke="#0D0D0D"
          strokeWidth="2"
          strokeLinejoin="round"
          d="M26,55V33h-6l11-11l11,11h-6v22 M31,32v2 M31,36v2 M31,40v2 M31,44v2 M31,48v2 M31,52v2"
        />
      </g>
    </g>
  </svg>
));
