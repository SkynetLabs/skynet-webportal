import React from "react";
import PropTypes from "prop-types";

export default function SmallOrb({ className }) {
  return (
    <svg className={className} viewBox="0 0 18 18" width={18} height={18} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 17A8 8 0 109 1a8 8 0 000 16zm4-1.072C11.087 17.033 7.745 14.826 5.536 11 3.326 7.174 3.086 3.176 5 2.072"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        fillRule="evenodd"
        strokeLinejoin="round"
      />
    </svg>
  );
}

SmallOrb.propTypes = {
  className: PropTypes.string,
};
