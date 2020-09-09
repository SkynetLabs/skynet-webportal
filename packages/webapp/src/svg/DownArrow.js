import React from "react";

export default function DownArrow(props) {
  return (
    <svg width={12} height={13} viewBox="0 0 12 13" {...props}>
      <path
        d="M6 1v11M1 7l5 5 5-5"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
