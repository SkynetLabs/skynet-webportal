const superagent = require("superagent");
const { StatusCodes } = require("http-status-codes");

// uploadCheck returns the result of uploading a sample file
async function uploadCheck(done) {
  const time = process.hrtime();

  superagent
    .post(`http://${process.env.PORTAL_URL}/skynet/skyfile`)
    .attach("file", "package.json", "package.json")
    .end((err, res) => {
      const statusCode = (res && res.statusCode) || (err && err.statusCode) || null;

      done({
        name: "upload_file",
        up: statusCode === StatusCodes.OK,
        statusCode,
        time: catchRequestTime(time),
        critical: true,
      });
    });
}

// downloadCheck returns the result of downloading the hard coded link
function downloadCheck(done) {
  const time = process.hrtime();
  const skylink = "AACogzrAimYPG42tDOKhS3lXZD8YvlF8Q8R17afe95iV2Q";

  superagent.get(`http://${process.env.PORTAL_URL}/${skylink}?nocache=true`).end((err, res) => {
    const statusCode = (res && res.statusCode) || (err && err.statusCode) || null;

    done({
      name: "download_file",
      up: statusCode === HttpStatus.OK,
      statusCode,
      time: catchRequestTime(time),
      critical: true,
    });
  });
}

// catchRequestTime records the time it took to resolve the request in
// milliseconds
function catchRequestTime(start) {
  const diff = process.hrtime(start);

  return Math.round((diff[0] * 1e9 + diff[1]) / 1e6); // msec
}

module.exports.basicChecks = [uploadCheck, downloadCheck];
module.exports.catchRequestTime = catchRequestTime;
