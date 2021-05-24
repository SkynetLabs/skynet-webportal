const got = require("got");
const FormData = require("form-data");
const { calculateElapsedTime, getResponseContent } = require("../utils");
const { SkynetClient } = require("skynet-js");

const skynetClient = new SkynetClient(process.env.SKYNET_PORTAL_API);
const exampleSkylink = "AACogzrAimYPG42tDOKhS3lXZD8YvlF8Q8R17afe95iV2Q";

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

  done({ name: "upload_file", time: calculateElapsedTime(time), ...data });
}

// websiteCheck checks whether the main website is working
async function websiteCheck(done) {
  return genericAccessCheck("website", process.env.SKYNET_PORTAL_API, done);
}

// downloadCheck returns the result of downloading the hard coded link
async function downloadCheck(done) {
  const url = await skynetClient.getSkylinkUrl(exampleSkylink);

  return genericAccessCheck("skylink", url, done);
}

// skylinkSubdomainCheck returns the result of downloading the hard coded link via subdomain
async function skylinkSubdomainCheck(done) {
  const url = await skynetClient.getSkylinkUrl(exampleSkylink, { subdomain: true });

  return genericAccessCheck("skylink_via_subdomain", url, done);
}

// handshakeSubdomainCheck returns the result of downloading the skylink via handshake domain
async function handshakeSubdomainCheck(done) {
  const url = await skynetClient.getHnsUrl("note-to-self", { subdomain: true });

  return genericAccessCheck("hns_via_subdomain", url, done);
}

// accountWebsiteCheck returns the result of accessing account dashboard website
async function accountWebsiteCheck(done) {
  const url = `${process.env.SKYNET_DASHBOARD_URL}/auth/login`;

  return genericAccessCheck("account_website", url, done);
}

// accountHealthCheck returns the result of accounts service health checks
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

  done({ name: "accounts", time: calculateElapsedTime(time), ...data });
}

async function genericAccessCheck(name, url, done) {
  const time = process.hrtime();
  const data = { up: false, url };

  try {
    const response = await got(url, { headers: { cookie: "nocache=true" } });

    data.statusCode = response.statusCode;
    data.up = true;
    data.ip = response.ip;
  } catch (error) {
    data.statusCode = error?.response?.statusCode || error.statusCode || error.status;
    data.errorMessage = error.message;
    data.errorResponseContent = getResponseContent(error.response);
    data.ip = error?.response?.ip ?? null;
  }

  done({ name, time: calculateElapsedTime(time), ...data });
}

const checks = [uploadCheck, websiteCheck, downloadCheck, skylinkSubdomainCheck, handshakeSubdomainCheck];

if (process.env.ACCOUNTS_ENABLED) {
  checks.push(accountHealthCheck, accountWebsiteCheck);
}

module.exports = checks;
