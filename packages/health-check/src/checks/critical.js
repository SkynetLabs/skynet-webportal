const superagent = require("superagent");
const { StatusCodes } = require("http-status-codes");
const { calculateElapsedTime } = require("../utils");

// uploadCheck returns the result of uploading a sample file
async function uploadCheck(done) {
  const time = process.hrtime();

  superagent
    .post(`http://${process.env.PORTAL_URL}/skynet/skyfile`)
    .attach("file", "package.json", "package.json")
    .end((error, response) => {
      const statusCode = (response && response.statusCode) || (error && error.statusCode) || null;

      done({
        name: "upload_file",
        up: statusCode === StatusCodes.OK,
        statusCode,
        time: calculateElapsedTime(time),
      });
    });
}

// downloadCheck returns the result of downloading the hard coded link
async function downloadCheck(done) {
  const time = process.hrtime();
  const skylink = "AACogzrAimYPG42tDOKhS3lXZD8YvlF8Q8R17afe95iV2Q";
  let statusCode;

  try {
    const response = await superagent.get(`http://${process.env.PORTAL_URL}/${skylink}?nocache=true`);

    statusCode = response.statusCode;
  } catch (error) {
    statusCode = error.statusCode || error.status;
  }

  done({
    name: "download_file",
    up: statusCode === StatusCodes.OK,
    statusCode,
    time: calculateElapsedTime(time),
  });
}

module.exports.criticalChecks = [uploadCheck, downloadCheck];
