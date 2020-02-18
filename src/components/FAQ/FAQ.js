import React from "react";

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
