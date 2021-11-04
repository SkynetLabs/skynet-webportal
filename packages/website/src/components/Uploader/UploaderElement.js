import * as React from "react";
import classnames from "classnames";
import { ArrowUpCircle, Error, CheckCircle, ProgressRound } from "../Icons";
import bytes from "bytes";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import copy from "copy-text-to-clipboard";
import path from "path-browserify";
import { SkynetClient } from "skynet-js";
import { useTimeoutFn } from "react-use";
import ms from "ms";
import Link from "../Link";

const getFilePath = (file) => file.webkitRelativePath || file.path || file.name;

const getRelativeFilePath = (file) => {
  const filePath = getFilePath(file);
  const { root, dir, base } = path.parse(filePath);
  const relative = path.normalize(dir).slice(root.length).split(path.sep).slice(1);

  return path.join(...relative, base);
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

  // Match the error message to a message returned by TUS when upload exceeds max file size
  const matchTusMaxFileSizeError = error.message.match(/upload exceeds maximum size: \d+ > (?<limit>\d+)/);

  if (matchTusMaxFileSizeError) {
    return `File exceeds size limit of ${bytes(parseInt(matchTusMaxFileSizeError.groups.limit, 10))}`;
  }

  // TODO: We should add a note "our team has been notified" and have some kind of notification with this error.
  return `Critical error, please refresh the application and try again. ${error.message}`;
};

const client = new SkynetClient(process.env.GATSBY_API_URL);

export default function UploaderElement({ onUploadStateChange, upload }) {
  const [copied, setCopied] = React.useState(false);
  const [, , reset] = useTimeoutFn(() => setCopied(false), ms("3 seconds"));
  const [retryTimeout, setRetryTimeout] = React.useState(ms("3 seconds")); // retry delay after "429: TOO_MANY_REQUESTS"

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

            response = await client.uploadDirectory(directory, name, { onUploadProgress });
          } else {
            response = await client.uploadFile(upload.file, { onUploadProgress });
          }

          const url = await client.getSkylinkUrl(response.skylink, { subdomain: upload.mode === "directory" });

          onUploadStateChange(upload.id, { status: "complete", url });
        } catch (error) {
          if (error?.response?.status === StatusCodes.TOO_MANY_REQUESTS) {
            onUploadStateChange(upload.id, { status: "retrying", progress: 0 });

            setTimeout(() => {
              onUploadStateChange(upload.id, { status: "enqueued", startedTime: null });
              setRetryTimeout((timeout) => timeout * 2); // increase timeout on next retry
            }, retryTimeout);
          } else {
            onUploadStateChange(upload.id, { status: "error", error: createUploadErrorMessage(error) });
          }
        }
      })();
    }
  }, [onUploadStateChange, upload, retryTimeout]);

  return (
    <div>
      <div className="flex items-center">
        {upload.status === "enqueued" && <ArrowUpCircle className="flex-shrink-0 fill-current text-palette-300" />}
        {upload.status === "retrying" && <ArrowUpCircle className="flex-shrink-0" />}
        {upload.status === "uploading" && <ArrowUpCircle className="flex-shrink-0" />}
        {upload.status === "processing" && <ProgressRound className="flex-shrink-0 animate-spin" />}
        {upload.status === "complete" && <CheckCircle className="flex-shrink-0" />}
        {upload.status === "error" && <Error className="flex-shrink-0 fill-current text-error" />}
        <div className="flex flex-col flex-grow ml-3 overflow-hidden">
          <div className="text-palette-600 text-sm font-light">{upload.file.name}</div>
          <div className="flex justify-between text-palette-400 text-xs space-x-2">
            <div className="font-content truncate">
              {upload.status === "uploading" && (
                <span className="tabular-nums">
                  Uploading {bytes(upload.file.size * upload.progress)} of {bytes(upload.file.size)}
                </span>
              )}
              {upload.status === "enqueued" && <span className="text-palette-300">Upload in queue, please wait</span>}
              {upload.status === "processing" && <span className="text-palette-300">Processing...</span>}
              {upload.status === "complete" && (
                <Link href={upload.url} className="hover:text-primary transition-colors duration-200">
                  {upload.url}
                </Link>
              )}
              {upload.status === "error" && upload.error && <span className="text-error">{upload.error}</span>}
              {upload.status === "retrying" && (
                <span>Too many parallel requests, retrying in {retryTimeout / 1000} seconds</span>
              )}
            </div>
            <div>
              {upload.status === "uploading" && (
                <span className="uppercase tabular-nums">
                  {Math.floor(upload.progress * 100)}%<span className="hidden desktop:inline"> completed</span>
                </span>
              )}
              {upload.status === "processing" && <span className="uppercase text-palette-300">Wait</span>}
              {upload.status === "complete" && (
                <button
                  className="uppercase hover:text-primary transition-colors duration-200"
                  onClick={() => handleCopy(upload.url)}
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
          "bg-error-dashed opacity-20": upload.status === "error",
          "bg-primary-dashed move opacity-20": upload.status === "processing",
        })}
        style={{ height: "5px" }}
      >
        <div
          style={{ width: `${Math.floor(upload.progress * 100)}%` }}
          className={classnames("bg-primary", { hidden: upload.status === "processing" || upload.status === "error" })}
        />
      </div>
    </div>
  );
}
