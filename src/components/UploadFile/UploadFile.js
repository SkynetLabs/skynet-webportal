import React, { useState, useRef, useEffect } from "react";
import "./UploadFile.scss";
import { LoadingSpinner } from "../";
import { File, FileCheck, FileError, Copy } from "../../svg";

export default function UploadFile({ file, url, status }) {
  const [copied, setCopied] = useState(false);
  const urlRef = useRef(null);

  useEffect(() => {
    if (copied) {
      const timeoutId = setTimeout(() => {
        setCopied(false);
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [copied, setCopied]);

  const getIcon = () => {
    if (status === "uploading" || status === "processing") {
      return <File />;
    } else if (status === "error") {
      return <FileError />;
    } else {
      return <FileCheck />;
    }
  };

  const copyToClipboard = e => {
    urlRef.current.select();
    document.execCommand("copy");
    e.target.focus();
    setCopied(true);
  };

  const copyText = copied ? "Copied!" : "Copy to clipboard";

  return (
    <div className="upload-file">
      <div className="upload-file-icon">{getIcon()}</div>
      <div className="upload-file-text">
        <h3>{file.name}</h3>
        <p>
          {status === "uploading" && "Uploading..."}
          {status === "processing" && "Processing..."}
          {status === "error" && <span className="red-text">Error processing file.</span>}
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
        <button onClick={copyToClipboard} className="upload-file-copy">
          <p className="upload-file-copy-tooltip">{copyText}</p>
          <div className="upload-file-copy-button">
            Copy Link
            <Copy />
          </div>
          <textarea value={url} ref={urlRef} readOnly={true} />
        </button>
      )}
    </div>
  );
}
