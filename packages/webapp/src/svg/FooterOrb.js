import React from "react";

export default function FooterOrb(props) {
  return (
    <svg width={26} height={26} viewBox="0 0 26 26" {...props}>
      <g fill="none" fillRule="evenodd">
        <path
          d="M2.604 18.997c1.66 2.873 7.656 2.513 13.396-.8C21.74 14.881 25.05 9.87 23.392 7A11.919 11.919 0 0125 13c0 6.627-5.373 12-12 12a11.995 11.995 0 01-10.396-6.003z"
          fill="#343734"
        />
        <path
          d="M25 13c0-6.627-5.373-12-12-12S1 6.373 1 13s5.373 12 12 12 12-5.373 12-12zm-1.608-6C25.05 9.87 21.74 14.882 16 18.196S4.265 21.87 2.608 19"
          stroke="#343734"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
