const got = require("got");
const FormData = require("form-data");
const { StatusCodes } = require("http-status-codes");
const { calculateElapsedTime, getResponseContent } = require("../utils");

// uploadCheck returns the result of uploading a sample file
async function uploadCheck(done) {
  const time = process.hrtime();
  const form = new FormData();
  const payload = Buffer.from(new Date()); // current date to ensure data uniqueness
  const data = { up: false };

  form.append("file", payload, { filename: "time.txt", contentType: "text/plain" });

  try {
    const response = await got.post(`${process.env.SKYNET_PORTAL_API}/skynet/skyfile`, { body: form });

    data.statusCode = response.statusCode;
    data.up = true;
    data.ip = response.ip;
  } catch (error) {
    data.statusCode = error.response?.statusCode || error.statusCode || error.status;
    data.errorMessage = error.message;
    data.errorResponseContent = getResponseContent(error.response);
    data.ip = error?.response?.ip ?? null;
  }

  done({
    name: "upload_file",
    time: calculateElapsedTime(time),
    ...data,
  });
}

// downloadCheck returns the result of downloading the hard coded link
async function downloadCheck(done) {
  const time = process.hrtime();
  const skylink = "AACogzrAimYPG42tDOKhS3lXZD8YvlF8Q8R17afe95iV2Q";
  const data = { up: false };

  try {
    const response = await got(`${process.env.SKYNET_PORTAL_API}/${skylink}?nocache=true`);

    data.statusCode = response.statusCode;
    data.up = true;
    data.ip = response.ip;
  } catch (error) {
    data.statusCode = error?.response?.statusCode || error.statusCode || error.status;
    data.errorMessage = error.message;
    data.errorResponseContent = getResponseContent(error.response);
    data.ip = error?.response?.ip ?? null;
  }

  done({
    name: "download_file",
    time: calculateElapsedTime(time),
    ...data,
  });
}

async function accountHealthCheck(done) {
  const time = process.hrtime();
  const data = { up: false };

  try {
    const response = await got(`${process.env.SKYNET_DASHBOARD_URL}/health`, { responseType: "json" });

    data.statusCode = response.statusCode;
    data.response = response.body;
    data.up = response.body.dbAlive === true;
    data.ip = response.ip;
  } catch (error) {
    data.statusCode = error?.response?.statusCode || error.statusCode || error.status;
    data.errorMessage = error.message;
    data.errorResponseContent = getResponseContent(error.response);
    data.ip = error?.response?.ip ?? null;
  }

  done({
    name: "account_health",
    time: calculateElapsedTime(time),
    ...data,
  });
}

const checks = [uploadCheck, downloadCheck];

if (process.env.ACCOUNTS_ENABLED) {
  checks.push(accountHealthCheck);
}

module.exports = checks;
