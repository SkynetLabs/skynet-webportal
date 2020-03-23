import React from "react";
import PropTypes from "prop-types";

export default function Pyramid({ className }) {
  return (
    <svg className={className} viewBox="0 0 38 38" width={38} height={38} xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd">
        <path fill="currentColor" d="M19 25L1 31l18 6 18-6z" />
        <path
          d="M19 1L1 31l18 6 18-6L19 1zm0 0v36m18-6l-18-6-18 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

Pyramid.propTypes = {
  className: PropTypes.string,
};
