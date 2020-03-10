import React, { useState, useContext, useEffect } from "react";
import classNames from "classnames";
import path from "path-browserify";
import { useDropzone } from "react-dropzone";
import Reveal from "react-reveal/Reveal";
import { Button, UploadFile } from "../";
import { Deco3, Deco4, Deco5, Folder, DownArrow } from "../../svg";
import "./HomeUpload.scss";
import AppContext from "../../AppContext";
import axios from "axios";

export default function HomeUpload() {
  const [files, setFiles] = useState([]);
  const { apiUrl } = useContext(AppContext);
  const [directoryMode, setDirectoryMode] = useState(false);

  useEffect(() => {
    if (directoryMode) {
      inputRef.current.setAttribute("webkitdirectory", "true");
    } else {
      inputRef.current.removeAttribute("webkitdirectory");
    }
  }, [directoryMode]);

  const getFilePath = (file) => file.webkitRelativePath || file.path || file.name;

  const getRelativeFilePath = (file) => {
    const filePath = getFilePath(file);
    const { root, dir, base } = path.parse(filePath);
    const relative = path
      .normalize(dir)
      .slice(root.length)
      .split(path.sep)
      .slice(1);

    return path.join(...relative, base);
  };

  const getRootDirectory = (file) => {
    const filePath = getFilePath(file);
    const { root, dir } = path.parse(filePath);

    return path
      .normalize(dir)
      .slice(root.length)
      .split(path.sep)[0];
  };

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
            ...state
          },
          ...previousFiles.slice(index + 1)
        ];
      });
    };

    const upload = async (formData, directory, file) => {
      const uploadUrl = `${apiUrl}/skynet/skyfile/${directory ? `?filename=${encodeURIComponent(directory)}` : ""}`;
      const { data } = await axios.post(uploadUrl, formData, {
        onUploadProgress: ({ loaded, total }) => {
          const progress = loaded / total;
          const status = progress === 1 ? "processing" : "uploading";

          onFileStateChange(file, { status, progress });
        }
      });

      return data;
    };

    acceptedFiles.forEach(async (file) => {
      try {
        const formData = new FormData();

        if (file.directory) {
          file.files.forEach((directoryFile) => {
            const relativeFilePath = getRelativeFilePath(directoryFile);

            formData.append("files[]", directoryFile, relativeFilePath);
          });
        } else {
          formData.append("file", file);
        }

        const { skylink } = await upload(formData, directoryMode && file.name, file);

        onFileStateChange(file, { status: "complete", url: `${apiUrl}/${skylink}` });
      } catch (error) {
        onFileStateChange(file, { status: "error" });
      }
    });
  };

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({ onDrop: handleDrop });

  const handleSkylink = (event) => {
    event.preventDefault();

    const skylink = event.target.skylink.value.replace("sia://", "");

    if (skylink.match(/^[a-zA-Z0-9_-]{46}$/)) {
      window.open(skylink, "_blank");
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
                  "drop-active": isDragActive
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

                <form className="home-upload-retrieve-form" onSubmit={handleSkylink}>
                  <input name="skylink" type="text" placeholder="sia://" aria-labelledby="skylink-retrieve-title" />
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
