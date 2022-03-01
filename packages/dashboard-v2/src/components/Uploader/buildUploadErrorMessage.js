import { getReasonPhrase } from "http-status-codes";
import bytes from "pretty-bytes";

export default function buildUploadErrorMessage(error) {
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
}
