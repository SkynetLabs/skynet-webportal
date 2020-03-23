import React from "react";
import PropTypes from "prop-types";

export default function LogoSolid({ className }) {
  return (
    <svg className={className} width={32} height={32} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M26 26v-9.849C26 10.623 21.578 6.027 16.05 6 10.497 5.973 5.973 10.496 6 16.05 6.028 21.578 10.623 26 16.151 26H26zM16 0c8.837 0 16 7.163 16 16v16H16C7.163 32 0 24.837 0 16S7.163 0 16 0z"
        fill="currentColor"
        fillRule="nonzero"
      />
    </svg>
  );
}

LogoSolid.propTypes = {
  className: PropTypes.string,
};
