import React from "react";

export default function Deco8(props) {
  return (
    <svg width={146} height={146} viewBox="0 0 146 146" {...props}>
      <g transform="translate(1 1)" fill="none" fillRule="evenodd">
        <circle fillOpacity={0.8} fill="#FFF" cx={72} cy={72} r={72} />
        <path
          d="M72 144c39.765 0 72-32.235 72-72S111.765 0 72 0 0 32.235 0 72s32.235 72 72 72zm36-9.646C90.781 144.295 60.705 124.437 40.823 90 20.941 55.563 18.781 19.587 36 9.646"
          stroke="#171917"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <path
          d="M36.094 9.578L36 9.646C18.781 19.587 20.94 55.563 40.823 90c19.882 34.437 49.958 54.295 67.177 44.354l.045-.013C97.445 140.484 85.133 144 72 144c-39.765 0-72-32.235-72-72C0 45.311 14.521 22.014 36.094 9.578z"
          fill="#171917"
        />
      </g>
    </svg>
  );
}
