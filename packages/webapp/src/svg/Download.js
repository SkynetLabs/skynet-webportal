import React from "react";
import PropTypes from "prop-types";

export default function Download({ className }) {
  return (
    <svg className={className} viewBox="0 0 34 46" width={34} height={46} xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd">
        <path
          d="M5 33H3a2 2 0 01-2-2V3a2 2 0 012-2h16l14 14v16a2 2 0 01-2 2h-2 0"
          stroke="#171917"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M17 45c6.627 0 12-5.373 12-12s-5.373-12-12-12S5 26.373 5 33s5.373 12 12 12zm-5-12l5 5 5-5m-5 5V27"
          stroke="#57B560"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M19 1l14 14H21a2 2 0 01-2-2V1z" fill="#171917" />
      </g>
    </svg>
  );
}

Download.propTypes = {
  className: PropTypes.string,
};
