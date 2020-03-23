import React from "react";
import PropTypes from "prop-types";

export default function Logo({ className }) {
  return (
    <svg viewBox="0 0 66 66" width={66} height={66} className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M52 52V33.287C52 22.784 43.599 14.052 33.096 14 22.544 13.948 13.948 22.543 14 33.096 14.052 43.599 22.784 52 33.287 52H52zM33 1c17.673 0 32 14.326 32 32v32H33C15.326 65 1 50.673 1 33 1 15.326 15.326 1 33 1z"
        fillRule="nonzero"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

Logo.propTypes = {
  className: PropTypes.string,
};
