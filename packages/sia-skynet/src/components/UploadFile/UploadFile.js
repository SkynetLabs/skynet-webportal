import React, { Component } from "react";

import "./UploadFile.scss";
import { LoadingSpinner } from "../";
import { File, FileCheck, FileError, Copy } from "../../svg";

export default class UploadFile extends Component {
  state = {
    copied: false
  };

  getIcon = () => {
    const { status } = this.props;

    if (status === "uploading" || status === "processing") {
      return <File />;
    } else if (status === "error") {
      return <FileError />;
    } else {
      return <FileCheck />;
    }
  };

  copyToClipboard = e => {
    this.urlRef.current.select();
    document.execCommand("copy");
    e.target.focus();

    this.setState({ copied: true }, () => {
      setTimeout(() => {
        this.setState({ copied: false });
      }, 1500);
    });
  };

  urlRef = React.createRef();

  render() {
    const { file, url, status } = this.props;
    const copyText = this.state.copied ? "Copied!" : "Copy to clipboard";
    return (
      <div className="upload-file">
        <div className="upload-file-icon">{this.getIcon()}</div>
        <div className="upload-file-text">
          <h3>{file.name}</h3>
          <p>
            {status === "uploading" && "Uploading..."}
            {status === "processing" && "Processing..."}
            {status === "error" && (
              <span className="red-text">Error processing file.</span>
            )}
            {status === "complete" && (
              <a href={url} className="url green-text">
                {url}
              </a>
            )}
          </p>
        </div>
        {(status === "uploading" || status === "processing") && (
          <div className="upload-file-loading">
            <LoadingSpinner />
          </div>
        )}

        {status === "complete" && (
          <button onClick={this.copyToClipboard} className="upload-file-copy">
            <p className="upload-file-copy-tooltip">{copyText}</p>
            <div className="upload-file-copy-button">
              Copy Link
              <Copy />
            </div>
            <textarea value={url} ref={this.urlRef} />
          </button>
        )}
      </div>
    );
  }
}
