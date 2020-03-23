import React from "react";
import PropTypes from "prop-types";
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

Sample.propTypes = {
  type: PropTypes.string,
  url: PropTypes.string,
  className: PropTypes.string,
};
