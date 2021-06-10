import * as React from "react";
import classnames from "classnames";
import { Add, Cloud, ArrowUpCircle, Error, CheckCircle, Unlock, Info, ProgressRound } from "../Icons";
import bytes from "bytes";
import classNames from "classnames";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import copy from "copy-text-to-clipboard";
import path from "path-browserify";
import { useDropzone } from "react-dropzone";
import { SkynetClient } from "skynet-js";
import { useTimeoutFn } from "react-use";
import ms from "ms";
import useAuthenticatedStatus from "../../services/useAuthenticatedStatus";
import Link from "../Link";

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

const client = new SkynetClient(process.env.GATSBY_API_URL);

const RegistrationLink = () => (
  <Link
    href="https://account.siasky.net/auth/registration"
    className="uppercase underline-primary hover:text-primary transition-colors duration-200"
  >
    Sign up
  </Link>
);

const UploadElement = ({ file, status, error, url = "", progress = 0 }) => {
  const [copied, setCopied] = React.useState(false);
  const [, , reset] = useTimeoutFn(() => setCopied(false), ms("3 seconds"));

  const handleCopy = (url) => {
    copy(url);
    setCopied(true);
    reset();
  };

  return (
    <div>
      <div className="flex items-center">
        {status === "uploading" && <ArrowUpCircle className="flex-shrink-0" />}
        {status === "processing" && <ProgressRound className="flex-shrink-0 animate-spin" />}
        {status === "complete" && <CheckCircle className="flex-shrink-0" />}
        {status === "error" && <Error className="flex-shrink-0 fill-current text-error" />}
        <div className="flex flex-col flex-grow ml-3 overflow-hidden">
          <div className="text-palette-600 text-sm font-light">{file.name}</div>
          <div className="flex justify-between text-palette-400 text-xs space-x-2">
            <div className="font-content truncate">
              {status === "uploading" && (
                <span className="tabular-nums">
                  Uploading {bytes(file.size * progress)} of {bytes(file.size)}
                </span>
              )}

              {status === "processing" && <span className="text-palette-300">Processing...</span>}

              {status === "complete" && (
                <Link href={url} className="hover:text-primary transition-colors duration-200">
                  {url}
                </Link>
              )}

              {status === "error" && error && <span className="text-error">{error}</span>}
            </div>
            <div>
              {status === "uploading" && (
                <span className="uppercase tabular-nums">
                  {Math.floor(progress * 100)}%<span className="hidden desktop:inline"> completed</span>
                </span>
              )}
              {status === "processing" && <span className="uppercase text-palette-300">Wait</span>}
              {status === "complete" && (
                <button
                  className="uppercase hover:text-primary transition-colors duration-200"
                  onClick={() => handleCopy(url)}
                >
                  <span className={classnames({ hidden: copied, "hidden desktop:inline": !copied })}>Copy link</span>
                  <span className={classnames({ hidden: copied, "inline desktop:hidden": !copied })}>Copy</span>
                  <span className={classnames({ hidden: !copied })}>Copied</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={classnames("flex bg-palette-200 mt-1", {
          "bg-error-dashed opacity-20": status === "error",
          "bg-primary-dashed move opacity-20": status === "processing",
        })}
        style={{ height: "5px" }}
      >
        <div
          style={{ width: `${Math.floor(progress * 100)}%` }}
          className={classnames("bg-primary", { hidden: status === "processing" || status === "error" })}
        />
      </div>
    </div>
  );
};

const Uploader = () => {
  const [mode, setMode] = React.useState("file");
  const [files, setFiles] = React.useState([]);

  const { data: authenticationStatus } = useAuthenticatedStatus();
  const authenticated = authenticationStatus?.authenticated ?? false;

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

          const url = client.getSkylinkUrl(response.skylink, { subdomain: mode === "directory" });

          onFileStateChange(file, { status: "complete", url });
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
    if (!inputElement) return;
    if (mode === "directory") inputElement.setAttribute("webkitdirectory", "true");
    if (mode === "file") inputElement.removeAttribute("webkitdirectory");
  }, [inputElement, mode]);

  return (
    <div>
      <div className="max-w-content mx-auto rounded-lg shadow bg-white z-0 relative">
        <div className="flex">
          <button
            className={classnames(
              "uppercase text-xxs desktop:text-xs w-1/2 p-2 desktop:p-3 rounded-tl-lg leading-6 desktop:leading-8",
              {
                "bg-primary": mode === "file",
                "bg-palette-200": mode === "directory",
              }
            )}
            onClick={() => setMode("file")}
          >
            <span className="hidden desktop:inline">Try it now and upload your files</span>
            <span className="inline desktop:hidden">Upload files</span>
          </button>
          <button
            className={classnames(
              "uppercase text-xxs desktop:text-xs w-1/2 p-2 desktop:p-3 rounded-tr-lg leading-6 desktop:leading-8",
              {
                "bg-primary": mode === "directory",
                "bg-palette-200": mode === "file",
              }
            )}
            onClick={() => setMode("directory")}
          >
            <span className="hidden desktop:inline">Do you want to upload a web app or directory?</span>
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
            {files.length === 0 && <Cloud />}
            <h4 className="font-light text-palette-600 text-lg mt-2 text-center">
              {mode === "file" && <span>Add or drop your files here to pin to Skynet</span>}
              {mode === "directory" && <span>Drop any folder with an index.html file to deploy to Skynet</span>}
            </h4>
          </div>
          <div className="absolute left-1/2 -bottom-4 desktop:-bottom-8">
            <div className="relative -left-1/2 transform transition-transform hover:rotate-180" role="button">
              <Add />
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="flex flex-col space-y-5 px-4 py-10 desktop:p-14">
            {files.map((file, index) => (
              <UploadElement key={index} {...file} />
            ))}

            <div className="z-0 relative flex flex-col items-center space-y-1 pt-8">
              <Info />

              {/* mobile - 2 lines */}
              <p className="text-sm font-light text-palette-600 desktop:hidden">Your files are available for 90 days</p>
              <p className="text-sm font-light text-palette-600 desktop:hidden">
                <RegistrationLink /> to keep them forever
              </p>

              {/* desktop - 1 line */}
              <p className="text-sm font-light text-palette-600 hidden desktop:block">
                Your files are available for 90 days, <RegistrationLink /> to keep them forever
              </p>
            </div>
          </div>
        )}
      </div>

      {files.length === 0 && !authenticated && (
        <div className="z-0 relative flex flex-col items-center space-y-1 mt-10">
          <Unlock />
          <p className="text-sm font-light text-palette-600">
            <RegistrationLink /> for free and unlock features
          </p>
        </div>
      )}
    </div>
  );
};

Uploader.propTypes = {};

Uploader.defaultProps = {};

export default Uploader;
