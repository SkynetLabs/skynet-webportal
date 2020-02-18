import React from "react";

export default function Loading(props) {
  return (
    <svg width={26} height={26} viewBox="0 0 26 26" {...props}>
      <path
        d="M13 25c6.627 0 12-5.373 12-12S19.627 1 13 1 1 6.373 1 13"
        stroke="#171917"
        strokeWidth={2}
        fill="none"
        fillRule="evenodd"
        strokeLinejoin="round"
      />
    </svg>
  );
}
