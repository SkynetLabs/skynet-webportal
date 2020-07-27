const superagent = require("superagent");
const HttpStatus = require("http-status-codes");

async function uploadCheck(done) {
  const time = process.hrtime();

  superagent
    .post(`http://${process.env.PORTAL_URL}/skynet/skyfile`)
    .attach("file", "package.json", "package.json")
    .end((err, res) => {
      const statusCode = (res && res.statusCode) || (err && err.statusCode) || null;

      done({
        name: "upload_file",
        up: statusCode === HttpStatus.OK,
        statusCode,
        time: catchRequestTime(time),
      });
    });
}

function downloadCheck(done) {
  const time = process.hrtime();

  superagent.get(`http://${process.env.PORTAL_URL}`).end((err, res) => {
    const statusCode = (res && res.statusCode) || (err && err.statusCode) || null;

    done({
      name: "download_file",
      up: statusCode === HttpStatus.OK,
      statusCode,
      time: catchRequestTime(time),
    });
  });
}

function catchRequestTime(start) {
  const diff = process.hrtime(start);

  return Math.round((diff[0] * 1e9 + diff[1]) / 1e6); // msec
}

module.exports.checks = [uploadCheck, downloadCheck];
