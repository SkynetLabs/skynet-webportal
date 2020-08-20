import React from "react";
import PropTypes from "prop-types";

export default function Cylinder({ className }) {
  return (
    <svg className={className} viewBox="0 0 34 34" width={34} height={34} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17 13c8.837 0 16-2.686 16-6s-7.163-6-16-6S1 3.686 1 7s7.163 6 16 6zm0 20c8.837 0 16-2.686 16-6s-7.163-6-16-6-16 2.686-16 6 7.163 6 16 6zM33 7v20M1 27V7m7 25V12"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        fillRule="evenodd"
        strokeLinejoin="round"
      />
    </svg>
  );
}

Cylinder.propTypes = {
  className: PropTypes.string,
};
