import React, { useState, useContext, useEffect } from "react";
import bytes from "bytes";
import classNames from "classnames";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import path from "path-browserify";
import { useDropzone } from "react-dropzone";
import Reveal from "react-reveal/Reveal";
import { Button, UploadFile } from "../";
import { Deco3, Deco4, Deco5, Folder, DownArrow } from "../../svg";
import "./HomeUpload.scss";
import AppContext from "../../AppContext";
import SkynetClient, { parseSkylink } from "skynet-js";

const isValidSkylink = (skylink) => {
  try {
    parseSkylink(skylink); // try to parse the skylink, it will throw on error
  } catch (error) {
    return false;
  }

  return true;
};

const getFilePath = (file) => file.webkitRelativePath || file.path || file.name;

const getRelativeFilePath = (file) => {
  const filePath = getFilePath(file);
  const { root, dir, base } = path.parse(filePath);
  const relative = path.normalize(dir).slice(root.length).split(path.sep).slice(1);

  return path.join(...relative, base);
};

const getRootDirectory = (file) => {
  const filePath = getFilePath(file);
  const { root, dir } = path.parse(filePath);

  return path.normalize(dir).slice(root.length).split(path.sep)[0];
};

const createUploadErrorMessage = (error) => {
  // The request was made and the server responded with a status code that falls out of the range of 2xx
  if (error.response) {
    if (error.response.data.message) {
      return `Upload failed with error: ${error.response.data.message}`;
    }

    const statusCode = error.response.status;
    const statusText = getReasonPhrase(error.response.status);

    return `Upload failed, our server received your request but failed with status code: ${statusCode} ${statusText}`;
  }

  // The request was made but no response was received. The best we can do is detect whether browser is online.
  // This will be triggered mostly if the server is offline or misconfigured and doesn't respond to valid request.
  if (error.request) {
    if (!navigator.onLine) {
      return "You are offline, please connect to the internet and try again";
    }

    // TODO: We should add a note "our team has been notified" and have some kind of notification with this error.
    return "Server failed to respond to your request, please try again later.";
  }

  // TODO: We should add a note "our team has been notified" and have some kind of notification with this error.
  return `Critical error, please refresh the application and try again. ${error.message}`;
};

export default function HomeUpload() {
  const [files, setFiles] = useState([]);
  const [skylink, setSkylink] = useState("");
  const { apiUrl } = useContext(AppContext);
  const [directoryMode, setDirectoryMode] = useState(false);
  const client = new SkynetClient(apiUrl);

  useEffect(() => {
    if (directoryMode) {
      inputRef.current.setAttribute("webkitdirectory", "true");
    } else {
      inputRef.current.removeAttribute("webkitdirectory");
    }
  }, [directoryMode]);

  const handleDrop = async (acceptedFiles) => {
    if (directoryMode && acceptedFiles.length) {
      const rootDir = getRootDirectory(acceptedFiles[0]); // get the file path from the first file

      acceptedFiles = [{ name: rootDir, directory: true, files: acceptedFiles }];
    }

    setFiles((previousFiles) => [...acceptedFiles.map((file) => ({ file, status: "uploading" })), ...previousFiles]);

    const onFileStateChange = (file, state) => {
      setFiles((previousFiles) => {
        const index = previousFiles.findIndex((f) => f.file === file);

        return [
          ...previousFiles.slice(0, index),
          {
            ...previousFiles[index],
            ...state,
          },
          ...previousFiles.slice(index + 1),
        ];
      });
    };

    acceptedFiles.forEach((file) => {
      const onUploadProgress = (progress) => {
        const status = progress === 1 ? "processing" : "uploading";

        onFileStateChange(file, { status, progress });
      };

      // Reject files larger than our hard limit of 1 GB with proper message
      if (file.size > bytes("1 GB")) {
        onFileStateChange(file, { status: "error", error: "This file size exceeds the maximum allowed size of 1 GB." });

        return;
      }

      const upload = async () => {
        try {
          let response;

          if (file.directory) {
            const directory = file.files.reduce((acc, file) => ({ ...acc, [getRelativeFilePath(file)]: file }), {});

            response = await client.uploadDirectory(directory, encodeURIComponent(file.name), { onUploadProgress });
          } else {
            response = await client.upload(file, { onUploadProgress });
          }

          onFileStateChange(file, { status: "complete", url: client.getUrl(response.skylink) });
        } catch (error) {
          if (error.response && error.response.status === StatusCodes.TOO_MANY_REQUESTS) {
            onFileStateChange(file, { progress: -1 });

            return new Promise((resolve) => setTimeout(() => resolve(upload()), 3000));
          }

          onFileStateChange(file, { status: "error", error: createUploadErrorMessage(error) });
        }
      };

      upload();
    });
  };

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({ onDrop: handleDrop });

  const handleSkylink = (event) => {
    event.preventDefault();

    // only try to open a valid skylink
    if (isValidSkylink(skylink)) {
      client.open(skylink);
    }
  };

  return (
    <Reveal effect="active">
      <div className="home-upload">
        <div className="home-upload-white fadeInUp delay4">
          <div className="home-upload-split">
            <div className="home-upload-box ">
              <div
                className={classNames("home-upload-dropzone", {
                  "drop-active": isDragActive,
                })}
                {...getRootProps()}
              >
                <span className="home-upload-text">
                  <h3>Upload your {directoryMode ? "Directory" : "Files"}</h3>
                  Drop your {directoryMode ? "directory" : "files"} here to pin to Skynet
                </span>
                <Button iconLeft>
                  <Folder />
                  Browse
                </Button>
              </div>
              <input {...getInputProps()} className="offscreen" />
              <button
                type="button"
                className="home-upload-mode-switch link"
                onClick={() => setDirectoryMode(!directoryMode)}
              >
                {directoryMode ? "⇐ Switch back to uploading files" : "Do you want to upload entire directory?"}
              </button>
              {directoryMode && (
                <p className="home-upload-directory-mode-notice">
                  Please note that directory upload is not a standard browser feature and the browser support is
                  limited. To check whether your browser is compatible, visit{" "}
                  <a
                    href="https://caniuse.com/#feat=mdn-api_htmlinputelement_webkitdirectory"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                  >
                    caniuse.com
                  </a>
                  .
                </p>
              )}
            </div>

            <div className="home-upload-retrieve">
              <div className="home-upload-text">
                <h3 id="skylink-retrieve-title">Have a Skylink?</h3>
                <p>Paste the link to retrieve your file</p>

                <form
                  className={classNames("home-upload-retrieve-form", { invalid: skylink && !isValidSkylink(skylink) })}
                  onSubmit={handleSkylink}
                >
                  <input
                    name="skylink"
                    type="text"
                    placeholder="sia://"
                    aria-labelledby="skylink-retrieve-title"
                    onChange={(event) => setSkylink(event.target.value)}
                  />
                  <button type="submit" aria-label="Retrieve file">
                    <DownArrow />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div className="home-uploaded-files">
              {files.map((file, i) => {
                return <UploadFile key={i} {...file} />;
              })}
            </div>
          )}
        </div>

        <p className="bottom-text fadeInUp delay5">
          Upon uploading a file, Skynet generates a 46 byte link called a <strong>Skylink</strong>. This link can then
          be shared with anyone to retrieve the file on any Skynet Webportal.
        </p>

        <Deco3 className="deco-3 fadeInUp delay6" />
        <Deco4 className="deco-4 fadeInUp delay6" />
        <Deco5 className="deco-5 fadeInUp delay6" />
      </div>
    </Reveal>
  );
}
