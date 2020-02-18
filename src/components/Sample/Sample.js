import React from "react";
import classNames from "classnames";

import "./Sample.scss";
import { Download } from "../../svg";

export default function Sample({ type, url, className }) {
  return (
    <div className={classNames("sample", className)}>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <Download />
        <span className="sample-name">
          <strong>{type}</strong> Sample
        </span>
        <span className="sample-download">Download</span>
      </a>
    </div>
  );
}
