import * as React from "react";
import classnames from "classnames";
import { Add, Cloud, ArrowUpCircle, CheckCircle } from "../Icons";
import bytes from "bytes";
import classNames from "classnames";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import path from "path-browserify";
import { useDropzone } from "react-dropzone";
import { SkynetClient } from "skynet-js";

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

const client = new SkynetClient("https://siasky.net");

const UploadElement = ({ file, progress, status, url }) => {
  const handleCopy = (url) => {
    console.log(url);
  };

  return (
    <div>
      <div className="flex items-center">
        {status === "uploading" && <ArrowUpCircle />}
        {status === "processing" && <ArrowUpCircle />}
        {status === "complete" && <CheckCircle />}
        <div className="flex flex-col flex-grow ml-3">
          <div className="text-palette-600 text-sm font-light">{file.name}</div>
          <div className="flex justify-between text-palette-400 text-xs">
            <div className="font-content">
              {status === "uploading" && (
                <span>
                  Uploading {bytes(file.size * progress)} of {bytes(file.size)}
                </span>
              )}

              {status === "processing" && <span>Processing...</span>}

              {status === "complete" && (
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              )}
            </div>
            <div>
              {status === "uploading" && <span className="uppercase">{Math.floor(progress * 100)}% completed</span>}
              {status === "complete" && (
                <button className="uppercase" onClick={() => handleCopy(url)}>
                  Copy link
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-palette-200 mt-1" style={{ height: "5px" }}>
        <div style={{ width: `${Math.floor(progress * 100)}%` }} className="bg-primary" />
      </div>
    </div>
  );
};

const Uploader = () => {
  const [mode, setMode] = React.useState("file");
  const [files, setFiles] = React.useState([]);

  const handleDrop = async (acceptedFiles) => {
    if (mode === "directory" && acceptedFiles.length) {
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
            response = await client.uploadFile(file, { onUploadProgress });
          }

          onFileStateChange(file, { status: "complete", url: client.getSkylinkUrl(response.skylink) });
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
  const inputElement = inputRef.current;

  React.useEffect(() => {
    if (mode === "directory") {
      inputElement.setAttribute("webkitdirectory", "true");
    } else {
      inputElement.removeAttribute("webkitdirectory");
    }
  }, [mode, inputElement]);

  return (
    <div className="px-8 py-12">
      <div className="max-w-content mx-auto rounded-lg shadow bg-white z-0 relative">
        <div className="flex">
          <button
            className={classnames("uppercase text-xxs desktop:text-xs w-1/2 p-3 rounded-tl-lg leading-8", {
              "bg-primary": mode === "file",
              "bg-palette-200": mode === "directory",
            })}
            onClick={() => setMode("file")}
          >
            <span className="hidden desktop:inline">Try it now and upload your files</span>
            <span className="inline desktop:hidden">Upload files</span>
          </button>
          <button
            className={classnames("uppercase text-xxs desktop:text-xs w-1/2 p-3 rounded-tr-lg leading-8", {
              "bg-primary": mode === "directory",
              "bg-palette-200": mode === "file",
            })}
            onClick={() => setMode("directory")}
          >
            <span className="hidden desktop:inline">Do you want to upload an entire directory?</span>
            <span className="inline desktop:hidden">Upload directory</span>
          </button>
        </div>
        <div
          className={classNames("p-4 relative home-upload-dropzone", {
            "drop-active": isDragActive,
          })}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <div
            className={classnames(
              "p-8 border-2 border-dashed border-palette-200 rounded-lg flex flex-col items-center",
              {
                "bg-palette-100": isDragActive,
              }
            )}
          >
            <Cloud />
            <h4 className="font-light text-palette-600 text-lg mt-2 text-center">
              Add or drop your files here to pin to Skynet
            </h4>
          </div>
          <div className="absolute left-1/2 -bottom-4 desktop:-bottom-8">
            <div className="relative -left-1/2" role="button">
              <Add />
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="flex flex-col space-y-5 p-14">
            {files.map((file, index) => (
              <UploadElement key={index} {...file} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

Uploader.propTypes = {};

Uploader.defaultProps = {};

export default Uploader;
