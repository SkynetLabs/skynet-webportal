import React from "react";
import PropTypes from "prop-types";

export default function DoubleRight({ className }) {
  return (
    <svg className={className} viewBox="0 0 12 12" width={12} height={12} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 1l5 5-5 5M6 1l5 5-5 5"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        fillRule="evenodd"
        strokeLinejoin="round"
      />
    </svg>
  );
}

DoubleRight.propTypes = {
  className: PropTypes.string,
};
