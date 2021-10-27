const got = require("got");
const FormData = require("form-data");
const { isEqual } = require("lodash");
const { calculateElapsedTime, getResponseContent } = require("../utils");
const { SkynetClient, genKeyPairAndSeed } = require("skynet-js");

const skynetClient = new SkynetClient(process.env.SKYNET_PORTAL_API);
const exampleSkylink = "AACogzrAimYPG42tDOKhS3lXZD8YvlF8Q8R17afe95iV2Q";

// check that any relevant configuration is properly set in skyd
async function skydConfigCheck(done) {
  const time = process.hrtime();
  const data = { up: false };

  try {
    const response = await got(`http://10.10.10.10:9980/renter`, { headers: { "User-Agent": "Sia-Agent" } }).json();

    // make sure initial funding is set to 10SC
    if (response.settings.allowance.paymentcontractinitialfunding !== "10000000000000000000000000") {
      throw new Error("Skynet Portal Per-Contract Budget is not set correctly!");
    }

    data.up = true;
    data.ip = response.ip;
  } catch (error) {
    data.statusCode = error.response?.statusCode || error.statusCode || error.status;
    data.errorMessage = error.message;
    data.errorResponseContent = getResponseContent(error.response);
    data.ip = error?.response?.ip ?? null;
  }

  done({ name: "skyd_config", time: calculateElapsedTime(time), ...data });
}

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
  return done(await genericAccessCheck("website", process.env.SKYNET_PORTAL_API));
}

// downloadCheck returns the result of downloading the hard coded link
async function downloadCheck(done) {
  const url = await skynetClient.getSkylinkUrl(exampleSkylink);

  return done(await genericAccessCheck("skylink", url));
}

// skylinkSubdomainCheck returns the result of downloading the hard coded link via subdomain
async function skylinkSubdomainCheck(done) {
  const url = await skynetClient.getSkylinkUrl(exampleSkylink, { subdomain: true });

  return done(await genericAccessCheck("skylink_via_subdomain", url));
}

// handshakeSubdomainCheck returns the result of downloading the skylink via handshake domain
async function handshakeSubdomainCheck(done) {
  const url = await skynetClient.getHnsUrl("note-to-self", { subdomain: true });

  return done(await genericAccessCheck("hns_via_subdomain", url));
}

// websiteSkylinkCheck returns the result of accessing siasky.net website through skylink
async function websiteSkylinkCheck(done) {
  const websiteSkylink = "AQBG8n_sgEM_nlEp3G0w3vLjmdvSZ46ln8ZXHn-eObZNjA";
  const url = await skynetClient.getSkylinkUrl(websiteSkylink, { subdomain: true });

  return done(await genericAccessCheck("website_skylink", url));
}

// accountWebsiteCheck returns the result of accessing account dashboard website
async function accountWebsiteCheck(done) {
  const url = `${process.env.SKYNET_DASHBOARD_URL}/auth/login`;

  return done(await genericAccessCheck("account_website", url));
}

// registryWriteAndReadCheck writes to registry and immediately reads and compares the data
async function registryWriteAndReadCheck(done) {
  const time = process.hrtime();
  const data = { name: "registry_write_and_read", up: false };
  const { privateKey, publicKey } = genKeyPairAndSeed();
  const expected = { datakey: "foo-key", data: "foo-data", revision: BigInt(0) };

  try {
    await skynetClient.registry.setEntry(privateKey, expected);
    const { entry } = await skynetClient.registry.getEntry(publicKey, expected.datakey);

    if (isEqual(expected, entry)) {
      data.up = true;
    } else {
      data.errors = [{ message: "Data mismatch in registry (read after write)", entry, expected }];
    }
  } catch (error) {
    data.errors = [{ message: error.message }];
  }

  return done({ ...data, time: calculateElapsedTime(time) });
}

// directServerApiAccessCheck returns the basic server api check on direct server address
async function directServerApiAccessCheck(done) {
  if (!process.env.SKYNET_SERVER_API) {
    return done({ up: false, errors: [{ message: "SKYNET_SERVER_API env variable not configured" }] });
  }

  const [portalAccessCheck, serverAccessCheck] = await Promise.all([
    genericAccessCheck("portal_api_access", process.env.SKYNET_PORTAL_API),
    genericAccessCheck("server_api_access", process.env.SKYNET_SERVER_API),
  ]);

  if (portalAccessCheck.ip !== serverAccessCheck.ip) {
    serverAccessCheck.up = false;
    serverAccessCheck.errors = serverAccessCheck.errors ?? [];
    serverAccessCheck.errors.push({
      message: "Access ip mismatch between portal and server access",
      response: {
        portal: { name: process.env.SKYNET_PORTAL_API, ip: portalAccessCheck.ip },
        server: { name: process.env.SKYNET_SERVER_API, ip: serverAccessCheck.ip },
      },
    });
  }

  return done(serverAccessCheck);
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

async function genericAccessCheck(name, url) {
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

  return { name, time: calculateElapsedTime(time), ...data };
}

const checks = [
  skydConfigCheck,
  uploadCheck,
  websiteCheck,
  websiteSkylinkCheck,
  downloadCheck,
  skylinkSubdomainCheck,
  handshakeSubdomainCheck,
  registryWriteAndReadCheck,
  directServerApiAccessCheck,
];

if (process.env.ACCOUNTS_ENABLED === "true") {
  checks.push(accountHealthCheck, accountWebsiteCheck);
}

module.exports = checks;
