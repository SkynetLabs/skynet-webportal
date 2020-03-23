import React from "react";
import PropTypes from "prop-types";
import "./FAQ.scss";

export default function FAQ({ title, children }) {
  return (
    <div className="faq">
      <div className="faq-dash" />
      <div className="faq-text">
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

FAQ.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};
