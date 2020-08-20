import React from "react";

export default function Deco5(props) {
  return (
    <svg width={97} height={95} viewBox="0 0 97 95" {...props}>
      <defs>
        <filter id="prefix__a" width="133.3%" height="136.1%" x="-16.7%" y="-18.1%" filterUnits="objectBoundingBox">
          <feMorphology in="SourceAlpha" operator="dilate" radius={1} result="shadowSpreadOuter1" />
          <feOffset in="shadowSpreadOuter1" result="shadowOffsetOuter1" />
          <feMorphology in="SourceAlpha" radius={1} result="shadowInner" />
          <feOffset in="shadowInner" result="shadowInner" />
          <feComposite in="shadowOffsetOuter1" in2="shadowInner" operator="out" result="shadowOffsetOuter1" />
          <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation={4} />
          <feColorMatrix
            in="shadowBlurOuter1"
            values="0 0 0 0 0.341176471 0 0 0 0 0.709803922 0 0 0 0 0.376470588 0 0 0 0.3 0"
          />
        </filter>
        <path
          id="prefix__b"
          d="M34.5 24c18.225 0 33-5.373 33-12S52.725 0 34.5 0s-33 5.373-33 12 14.775 12 33 12zm0 48c18.225 0 33-5.373 33-12s-14.775-12-33-12-33 5.373-33 12 14.775 12 33 12zm33-60v48m-66 0V12m12 9v48"
        />
      </defs>
      <g fill="none" fillRule="evenodd">
        <path
          fill="#FFF"
          fillOpacity={0.8}
          d="M9.782 36.669l-.064-.188c-1.961-6.242 10.014-16.204 26.97-22.375 17.126-6.234 32.847-6.238 35.114-.01L88.219 59.2c2.266 6.228-9.78 16.33-26.906 22.563-17.126 6.233-32.847 6.238-35.114.01L9.782 36.67z"
        />
        <path
          fill="#57B560"
          d="M9.782 36.669c1.287 3.536 6.911 5.063 14.667 4.581l16.417 45.105c-7.756.482-13.38-1.045-14.667-4.58L9.782 36.668z"
        />
        <g strokeLinejoin="round" transform="rotate(-20 75.593 .85)">
          <use fill="#000" filter="url(#prefix__a)" xlinkHref="#prefix__b" />
          <use stroke="#57B560" strokeWidth={2} xlinkHref="#prefix__b" />
        </g>
      </g>
    </svg>
  );
}
