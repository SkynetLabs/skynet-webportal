const fs = require("fs");
const superagent = require("superagent");
const tmp = require('tmp');
const { StatusCodes } = require("http-status-codes");
const { calculateElapsedTime, getResponseContent } = require("../utils");

// uploadCheck returns the result of uploading a sample file
async function uploadCheck(done) {
  const time = process.hrtime();
  const file = tmp.fileSync();
  
  fs.writeSync(file.fd, Buffer.from(new Date())); // write current date to temp file

  superagent
    .post(`${process.env.PORTAL_URL}/skynet/skyfile`)
    .attach("file", file.name, file.name)
    .end((error, response) => {
      file.removeCallback();

      const statusCode = (response && response.statusCode) || (error && error.statusCode) || null;

      done({
        name: "upload_file",
        up: statusCode === StatusCodes.OK,
        statusCode,
        errorResponseContent: getResponseContent(error?.response),
        time: calculateElapsedTime(time),
      });
    });
}

// downloadCheck returns the result of downloading the hard coded link
async function downloadCheck(done) {
  const time = process.hrtime();
  const skylink = "AACogzrAimYPG42tDOKhS3lXZD8YvlF8Q8R17afe95iV2Q";
  let statusCode, errorResponseContent;

  try {
    const response = await superagent.get(`${process.env.PORTAL_URL}/${skylink}?nocache=true`);

    statusCode = response.statusCode;
  } catch (error) {
    statusCode = error.statusCode || error.status;
    errorResponseContent = getResponseContent(error.response);
  }

  done({
    name: "download_file",
    up: statusCode === StatusCodes.OK,
    statusCode,
    errorResponseContent,
    time: calculateElapsedTime(time),
  });
}

module.exports = [uploadCheck, downloadCheck];
