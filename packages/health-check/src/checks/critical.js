const got = require("got");
const FormData = require("form-data");
const { StatusCodes } = require("http-status-codes");
const { calculateElapsedTime, getResponseContent } = require("../utils");

// uploadCheck returns the result of uploading a sample file
async function uploadCheck(done) {
  const time = process.hrtime();
  const form = new FormData();
  const data = Buffer.from(new Date()); // current date to ensure data uniqueness

  form.append("file", data, { filename: "time.txt", contentType: "text/plain" });
  let statusCode, errorResponseContent;

  try {
    const response = await got.post(`${process.env.PORTAL_URL}/skynet/skyfile`, { body: form });

    statusCode = response.statusCode;
  } catch (error) {
    statusCode = error?.response?.statusCode || error.statusCode || error.status;
    errorResponseContent = getResponseContent(error?.response);
  }

  done({
    name: "upload_file",
    up: statusCode === StatusCodes.OK,
    statusCode,
    errorResponseContent,
    time: calculateElapsedTime(time),
  });
}

// downloadCheck returns the result of downloading the hard coded link
async function downloadCheck(done) {
  const time = process.hrtime();
  const skylink = "AACogzrAimYPG42tDOKhS3lXZD8YvlF8Q8R17afe95iV2Q";
  let statusCode, errorMessage, errorResponseContent;

  try {
    const response = await got(`${process.env.PORTAL_URL}/${skylink}?nocache=true`);

    statusCode = response.statusCode;
  } catch (error) {
    statusCode = error?.response?.statusCode || error.statusCode || error.status;
    errorMessage = error.message;
    errorResponseContent = getResponseContent(error.response);
  }

  done({
    name: "download_file",
    up: statusCode === StatusCodes.OK,
    statusCode,
    errorMessage,
    errorResponseContent,
    time: calculateElapsedTime(time),
  });
}

module.exports = [uploadCheck, downloadCheck];
