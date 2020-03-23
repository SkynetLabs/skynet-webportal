import React from "react";
import PropTypes from "prop-types";
import "./CircleIcon.scss";

export default function CircleIcon({ children }) {
  return <div className="circle-icon">{children}</div>;
}

CircleIcon.propTypes = {
  children: PropTypes.node,
};
