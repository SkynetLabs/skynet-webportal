import React from "react";

export default function FileError(props) {
  return (
    <svg width={38} height={42} viewBox="0 0 38 42" {...props}>
      <g fill="none" fillRule="evenodd">
        <path
          d="M3 1h18l16 16v22a2 2 0 01-2 2H3a2 2 0 01-2-2V3a2 2 0 012-2zm15 21v7m0 2v2"
          stroke="#E65C5C"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <path d="M21 2l15 15H23a2 2 0 01-2-2V2z" fill="#E65C5C" />
      </g>
    </svg>
  );
}
