import React from "react";

export default function TopSwoosh({ ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="622"
      viewBox="0 0 622 151"
      {...props}
    >
      <defs>
        <filter id="a" width="103.4%" height="103.4%" x="-1.7%" y="-1.7%" filterUnits="objectBoundingBox">
          <feMorphology in="SourceAlpha" operator="dilate" radius="1" result="shadowSpreadOuter1"></feMorphology>
          <feOffset in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
          <feMorphology in="SourceAlpha" radius="1" result="shadowInner"></feMorphology>
          <feOffset in="shadowInner" result="shadowInner"></feOffset>
          <feComposite
            in="shadowOffsetOuter1"
            in2="shadowInner"
            operator="out"
            result="shadowOffsetOuter1"
          ></feComposite>
          <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="4"></feGaussianBlur>
          <feColorMatrix
            in="shadowBlurOuter1"
            values="0 0 0 0 0.341176471 0 0 0 0 0.709803922 0 0 0 0 0.376470588 0 0 0 0.3 0"
          ></feColorMatrix>
        </filter>
        <path
          id="b"
          d="M384 768c212.077 0 384-171.923 384-384S596.077 0 384 0 0 171.923 0 384s171.923 384 384 384zm192-51.446c-91.832 53.02-252.238-52.89-358.277-236.554C111.684 296.336 100.168 104.466 192 51.446"
        ></path>
      </defs>
      <g fill="none" fillRule="evenodd">
        <g strokeLinejoin="round" transform="translate(-73 -626)">
          <use fill="#000" filter="url(#a)" xlinkHref="#b"></use>
          <use stroke="#57B560" strokeWidth="2" xlinkHref="#b"></use>
        </g>
        <path
          fill="#57B560"
          d="M119.706-574.998l-.78.524C27.13-521.461 38.642-329.612 144.64-145.968 250.637 37.676 410.982 143.572 502.779 90.559l.218-.052C446.488 123.254 380.859 142 310.853 142 98.857 142-73-29.904-73-241.957c0-142.44 77.542-266.765 192.706-333.04z"
        ></path>
      </g>
    </svg>
  );
}
