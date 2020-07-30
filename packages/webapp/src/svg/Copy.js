import React from "react";

export default function Copy(props) {
  return (
    <svg width={12} height={14} viewBox="0 0 12 14" {...props}>
      <path
        d="M8 1H4a3 3 0 00-3 3v6h0m4-6h5a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth={2}
        fill="none"
        fillRule="evenodd"
        strokeLinejoin="round"
      />
    </svg>
  );
}
