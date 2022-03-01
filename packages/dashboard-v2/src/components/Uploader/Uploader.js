import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import path from "path-browserify";
import { useDropzone } from "react-dropzone";
import { nanoid } from "nanoid";

import { Button } from "../Button";
import { UploadIcon } from "../Icons/icons/UploadIcon";
import { FolderUploadIcon } from "../Icons/icons/FolderUploadIcon";

import UploaderItem from "./UploaderItem";
import { PlusIcon } from "../Icons";

const MAX_PARALLEL_UPLOADS = 1;

const getFilePath = (file) => file.webkitRelativePath || file.path || file.name;

const getRootDirectory = (file) => {
  const filePath = getFilePath(file);
  const { root, dir } = path.parse(filePath);

  return path.normalize(dir).slice(root.length).split(path.sep)[0];
};

const Uploader = ({ mode }) => {
  const [uploads, setUploads] = useState([]);

  const onUploadStateChange = useCallback((id, state) => {
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

    setUploads((uploads) => [
      ...files.map((file) => ({ id: nanoid(), file, progress: 0, mode, status: "enqueued" })),
      ...uploads,
    ]);
  };

  useEffect(() => {
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

  const { getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
    onDrop: handleDrop,
    useFsAccessApi: false,
  });
  const inputElement = inputRef.current;

  useEffect(() => {
    if (!inputElement) return;
    if (mode === "directory") inputElement.setAttribute("webkitdirectory", "true");
    if (mode === "file") inputElement.removeAttribute("webkitdirectory");
  }, [inputElement, mode]);

  return (
    <div className="h-full">
      <div
        className={cn("relative px-8 text-palette-400 text-center flex flex-col justify-center", {
          "drop-active": isDragActive,
          "min-h-full": uploads.length === 0,
          "bg-palette-100/50": !isDragActive,
          "bg-palette-100": isDragActive,
        })}
        {...getRootProps()}
        disabled={true}
      >
        <input {...getInputProps()} />
        {uploads.length === 0 ? (
          <div className="flex flex-col items-center">
            {mode === "file" ? (
              <>
                <UploadIcon />
                <p className="py-4">Add, or drop your files here to pin to Skynet</p>
              </>
            ) : (
              <>
                <FolderUploadIcon />
                <p className="py-4">Drop any folder with an index.html file to deploy to Skynet</p>
              </>
            )}
            <Button $primary>Add files</Button>
          </div>
        ) : (
          <div className="p-5">
            <Button $primary className="w-[40px] h-[40px] !p-0 inline-flex justify-center items-center">
              <PlusIcon size={12} />
            </Button>
            <span className="ml-4">Add, or drop your files here</span>
          </div>
        )}
      </div>

      {uploads.length > 0 && (
        <div className="flex flex-col space-y-4 py-10">
          {uploads.map((upload) => (
            <UploaderItem key={upload.id} onUploadStateChange={onUploadStateChange} upload={upload} />
          ))}
        </div>
      )}
    </div>
  );
};

Uploader.propTypes = {
  mode: PropTypes.oneOf(["file", "directory"]),
};

Uploader.defaultProps = {
  mode: "file",
};

export default Uploader;
