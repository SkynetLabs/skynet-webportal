import React from "react";

import "./SocialLink.scss";
import { Github, Discord, Twitter } from "../../svg";

export default function SocialLink({ icon, title, greenText, url }) {
  const getIcon = () => {
    if (icon === "github") {
      return <Github />;
    } else if (icon === "discord") {
      return <Discord />;
    } else if (icon === "twitter") {
      return <Twitter />;
    }
  };

  return (
    <a href={url} className="social-link">
      <span className="social-link-icon">{getIcon(icon)}</span>
      <span className="social-link-text">
        <span className="social-link-title">{title}</span>
        <span className="social-link-green">{greenText}</span>
      </span>
    </a>
  );
}
