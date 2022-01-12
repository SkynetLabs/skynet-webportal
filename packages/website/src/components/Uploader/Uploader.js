import * as React from "react";
import classnames from "classnames";
import { Add, Cloud, Unlock, Info } from "../Icons";
import classNames from "classnames";
import path from "path-browserify";
import { useDropzone } from "react-dropzone";
import { nanoid } from "nanoid";
import useAccounts from "../../services/useAccounts";
import useAccountsUrl from "../../services/useAccountsUrl";
import Link from "../Link";
import UploaderElement from "./UploaderElement";

const MAX_PARALLEL_UPLOADS = 1;

const getFilePath = (file) => file.webkitRelativePath || file.path || file.name;

const getRootDirectory = (file) => {
  const filePath = getFilePath(file);
  const { root, dir } = path.parse(filePath);

  return path.normalize(dir).slice(root.length).split(path.sep)[0];
};

const RegistrationLink = () => {
  const accountsUrl = useAccountsUrl();

  return (
    <Link
      href={`${accountsUrl}/auth/registration`}
      className="uppercase underline-primary hover:text-primary transition-colors duration-200"
    >
      Sign up
    </Link>
  );
};

const LogInLink = () => {
  const accountsUrl = useAccountsUrl();

  return (
    <Link
      href={`${accountsUrl}/auth/login`}
      className="uppercase underline-primary hover:text-primary transition-colors duration-200"
    >
      Log in
    </Link>
  );
};

const Uploader = () => {
  const [mode, setMode] = React.useState("file");
  const [uploads, setUploads] = React.useState([]);

  const { data: accounts } = useAccounts();
  const showAccountFeatures = accounts?.enabled && !accounts?.auth_required && !accounts?.authenticated;
  const disabledComponent = accounts?.enabled && accounts?.auth_required && !accounts?.authenticated;

  const onUploadStateChange = React.useCallback((id, state) => {
    setUploads((uploads) => {
      const index = uploads.findIndex((upload) => upload.id === id);

      return [...uploads.slice(0, index), { ...uploads[index], ...state }, ...uploads.slice(index + 1)];
    });
  }, []);

  const handleDrop = async (files) => {
    if (mode === "directory" && files.length) {
      const name = getRootDirectory(files[0]); // get the file path from the first file
      const size = files.reduce((acc, file) => acc + file.size, 0);

      files = [{ name, size, files }];
    }

    setUploads((uploads) => [...files.map((file) => ({ id: nanoid(), file, mode, status: "enqueued" })), ...uploads]);
  };

  React.useEffect(() => {
    const enqueued = uploads.filter(({ status }) => status === "enqueued");
    const uploading = uploads.filter(({ status }) => ["uploading", "processing", "retrying"].includes(status));
    const queue = enqueued.slice(0, MAX_PARALLEL_UPLOADS - uploading.length).map(({ id }) => id);

    if (queue.length && uploading.length < MAX_PARALLEL_UPLOADS) {
      setUploads((uploads) => {
        return uploads.map((upload) => {
          if (queue.includes(upload.id)) return { ...upload, status: "uploading" };
          return upload;
        });
      });
    }
  }, [uploads]);

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({ onDrop: handleDrop });
  const inputElement = inputRef.current;

  React.useEffect(() => {
    if (!inputElement) return;
    if (mode === "directory") inputElement.setAttribute("webkitdirectory", "true");
    if (mode === "file") inputElement.removeAttribute("webkitdirectory");
  }, [inputElement, mode]);

  return (
    <div className={classnames("relative", { "p-8": disabledComponent })}>
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
          disabled={true}
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
            {uploads.length === 0 && <Cloud />}
            <h4 className="font-light text-palette-600 text-lg mt-2 text-center">
              {mode === "file" && <span>Add or drop your files here to pin to Skynet</span>}
              {mode === "directory" && <span>Drop any folder with an index.html file to deploy to Skynet</span>}
            </h4>
          </div>
          {!disabledComponent && (
            <div className="absolute left-1/2 -bottom-4 desktop:-bottom-8">
              <div className="relative -left-1/2 transform transition-transform hover:rotate-180" role="button">
                <Add />
              </div>
            </div>
          )}
        </div>

        {uploads.length > 0 && (
          <div className="flex flex-col space-y-5 px-4 py-10 desktop:p-14">
            {uploads.map((upload) => (
              <UploaderElement key={upload.id} onUploadStateChange={onUploadStateChange} upload={upload} />
            ))}

            {showAccountFeatures && (
              <div className="z-0 relative flex flex-col items-center space-y-1 pt-8">
                <Info />

                {/* mobile - 2 lines */}
                <p className="text-sm font-light text-palette-600 desktop:hidden">
                  Your files are available for 90 days
                </p>
                <p className="text-sm font-light text-palette-600 desktop:hidden">
                  <RegistrationLink /> to keep them forever
                </p>

                {/* desktop - 1 line */}
                <p className="text-sm font-light text-palette-600 hidden desktop:block">
                  Your files are available for 90 days, <RegistrationLink /> to keep them forever
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {uploads.length === 0 && showAccountFeatures && (
        <div className="z-0 relative flex flex-col items-center space-y-1 mt-10">
          <Unlock />
          <p className="text-sm font-light text-palette-600">
            <RegistrationLink /> for free and unlock features
          </p>
        </div>
      )}

      {disabledComponent && (
        <div className="absolute inset-0 bg-palette-500 bg-opacity-90 rounded-lg">
          <div className="flex h-full">
            <div className="m-auto">
              <h4 className="font-light text-palette-100 text-lg mt-2 text-center">
                <LogInLink /> or <RegistrationLink /> for free
              </h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Uploader.propTypes = {};

Uploader.defaultProps = {};

export default Uploader;
