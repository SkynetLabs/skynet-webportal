import * as React from "react";
import cn from "classnames";
import bytes from "pretty-bytes";
import { StatusCodes } from "http-status-codes";
import copy from "copy-text-to-clipboard";
import path from "path-browserify";
import { useTimeoutFn } from "react-use";
import { SkynetClient } from "skynet-js";
import { ProgressBar } from "./ProgressBar";
import UploaderItemIcon from "./UploaderItemIcon";
import buildUploadErrorMessage from "./buildUploadErrorMessage";

const skynetClient = new SkynetClient("https://siasky.net"); //TODO: proper API url

const getFilePath = (file) => file.webkitRelativePath || file.path || file.name;

const getRelativeFilePath = (file) => {
  const filePath = getFilePath(file);
  const { root, dir, base } = path.parse(filePath);
  const relative = path.normalize(dir).slice(root.length).split(path.sep).slice(1);

  return path.join(...relative, base);
};

export default function UploaderItem({ onUploadStateChange, upload }) {
  const [copied, setCopied] = React.useState(false);
  const [, , reset] = useTimeoutFn(() => setCopied(false), 3000);
  const [retryTimeout, setRetryTimeout] = React.useState(3000); // retry delay after "429: TOO_MANY_REQUESTS"

  const handleCopy = (url) => {
    copy(url);
    setCopied(true);
    reset();
  };

  React.useEffect(() => {
    if (upload.status === "uploading" && !upload.startedTime) {
      onUploadStateChange(upload.id, { startedTime: Date.now() });

      (async () => {
        const onUploadProgress = (progress) => {
          const status = progress === 1 ? "processing" : "uploading";

          onUploadStateChange(upload.id, { status, progress });
        };

        try {
          let response;

          if (upload.mode === "directory") {
            const files = upload.file.files;
            const directory = files.reduce((acc, file) => ({ ...acc, [getRelativeFilePath(file)]: file }), {});
            const name = encodeURIComponent(upload.file.name);

            response = await skynetClient.uploadDirectory(directory, name, { onUploadProgress });
          } else {
            response = await skynetClient.uploadFile(upload.file, { onUploadProgress });
          }

          const url = await skynetClient.getSkylinkUrl(response.skylink, { subdomain: upload.mode === "directory" });

          onUploadStateChange(upload.id, { status: "complete", url });
        } catch (error) {
          if (error?.response?.status === StatusCodes.TOO_MANY_REQUESTS) {
            onUploadStateChange(upload.id, { status: "retrying", progress: 0 });

            setTimeout(() => {
              onUploadStateChange(upload.id, { status: "enqueued", startedTime: null });
              setRetryTimeout((timeout) => timeout * 2); // increase timeout on next retry
            }, retryTimeout);
          } else {
            onUploadStateChange(upload.id, { status: "error", error: buildUploadErrorMessage(error) });
          }
        }
      })();
    }
  }, [onUploadStateChange, upload, retryTimeout]);

  return (
    <div>
      <div className="grid grid-cols-[40px_1fr_min-content]">
        <div className="p-1">
          <UploaderItemIcon status={upload.status} />
        </div>
        <div className="flex flex-col ml-3 overflow-hidden">
          <div className="text-palette-600">
            <div className="truncate">{upload.file.name}</div>
          </div>
          <div className="flex justify-between text-palette-400 text-xs space-x-2 items-end">
            <div className="font-content truncate">
              {upload.status === "uploading" && (
                <span className="tabular-nums">
                  Uploading {bytes(upload.file.size * upload.progress)} of {bytes(upload.file.size)}
                </span>
              )}
              {upload.status === "enqueued" && <span className="text-palette-300">Upload in queue, please wait</span>}
              {upload.status === "processing" && <span className="text-palette-300">Processing...</span>}
              {upload.status === "complete" && (
                <a href={upload.url} className="hover:text-primary transition-colors duration-200">
                  {upload.url}
                </a>
              )}
              {upload.status === "error" && upload.error && <span className="text-error">{upload.error}</span>}
              {upload.status === "retrying" && (
                <span>Too many parallel requests, retrying in {retryTimeout / 1000} seconds</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-base self-end ml-2">
          {upload.status === "uploading" && (
            <span className="uppercase tabular-nums">{Math.floor(upload.progress * 100)}%</span>
          )}
          {upload.status === "processing" && <span className="uppercase text-palette-300">Wait</span>}
          {upload.status === "complete" && (
            <button
              className="uppercase hover:text-primary transition-colors duration-200"
              onClick={() => handleCopy(upload.url)}
            >
              {copied ? (
                <span className={cn({ hidden: !copied })}>Copied</span>
              ) : (
                <span className={cn({ hidden: copied })}>Copy</span>
              )}
            </button>
          )}
        </div>
      </div>

      <ProgressBar className="mt-1" status={upload.status} percentage={upload.progress * 100} />
    </div>
  );
}
