const FormData = require("form-data");
const ipCheckService = "whatismyip.akamai.com";
const ipRegex = new RegExp(
  `^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$`
);

// sectorSize is the skyd sector size
const sectorSize = 1 << 22; // 40 MiB

// SECOND is a helper constant for defining the number of milliseconds in a
// second
const SECOND = 1000;

// defaultBaseSectorRedundancy is the default baseSectorRedundancy defined by
// skyd
const defaultBaseSectorRedundancy = 10;

// defaultFanoutRedundancy is the default fanout redundancy defined by skyd
const defaultFanoutRedundancy = 3;

// siaDockerContainerIP is the local IP of the sia docker container
const siaDockerContainerIP = "10.10.10.10";

/**
 * Get the time between start and now in milliseconds
 */
function calculateElapsedTime(start) {
  const diff = process.hrtime(start);

  return Math.round((diff[0] * 1e9 + diff[1]) / 1e6); // msec
}

/**
 * Get the ISO string with yesterday's date set (- 24 hours)
 */
function getYesterdayISOString() {
  const date = new Date();

  date.setDate(date.getDate() - 1);

  return date.toISOString();
}

/**
 * Get response from response object if available
 */
function getResponseContent(response) {
  try {
    return JSON.parse(response?.body || response?.text);
  } catch {
    return response?.body || response?.text;
  }
}

/**
 * Ensures that the object serializes to JSON properly
 */
function ensureValidJSON(object) {
  const replacer = (key, value) => (value === undefined ? "--undefined--" : value);
  const stringified = JSON.stringify(object, replacer);

  return JSON.parse(stringified);
}

/**
 * Get variable value from environment (process.env)
 * Exit with code 1 if variable is not set or empty
 * @param {string} name variable name
 * @returns {string}
 */
function getRequiredEnvironmentVariable(name) {
  const value = process.env[name];

  if (!value) {
    console.log(`${name} cannot be empty`);
    process.exit(1);
  }

  return value;
}

/**
 * Authenticate with given credentials and return auth cookie
 * Creates new account if username does not exist
 * Only authenticates when portal is set to authenticated users only mode
 * @param {boolean} forceAuth forcibly ensure authentication with test credentials
 */
function getAuthCookie(forceAuth = false) {
  // cache auth promise so only one actual request will be made
  if (getAuthCookie.cache) return getAuthCookie.cache;

  // accounts disabled, do not try to authenticate
  if (!isPortalModuleEnabled("a")) return "";

  // do not authenticate if it is not required by portal limit access rule
  if (!forceAuth && !["authenticated", "subscription"].includes(process.env.ACCOUNTS_LIMIT_ACCESS)) return "";

  // assign all required environment variables
  const portalDomain = getRequiredEnvironmentVariable("PORTAL_DOMAIN");
  const email = getRequiredEnvironmentVariable("ACCOUNTS_TEST_USER_EMAIL");
  const password = getRequiredEnvironmentVariable("ACCOUNTS_TEST_USER_PASSWORD");

  async function authenticate() {
    const got = require("got");

    try {
      // authenticate with given test user credentials
      const response = await got.post(`https://account.${portalDomain}/api/login`, {
        json: { email, password },
      });

      // extract set-cookie from successful authentication request
      const cookies = response.headers["set-cookie"];

      // throw meaningful error when set-cookie header is missing
      if (!cookies) throw new Error(`Auth successful (code ${response.statusCode}) but 'set-cookie' header is missing`);

      // find the skynet-jwt cookie
      const jwtcookie = cookies.find((cookie) => cookie.startsWith("skynet-jwt"));

      // throw meaningful error when skynet-jwt cookie is missing
      if (!jwtcookie) throw new Error(`Header 'set-cookie' found but 'skynet-jwt' cookie is missing`);

      // extract just the cookie value (no set-cookie props) from set-cookie
      return jwtcookie.match(/skynet-jwt=[^;]+;/)[0];
    } catch (error) {
      // 401 means that service worked but user could not have been authenticated
      if (error.response && error.response.statusCode === 401) {
        // sign up with the given credentials
        await got.post(`https://account.${portalDomain}/api/user`, {
          json: { email, password },
        });

        // retry authentication
        return authenticate();
      }

      // rethrow unhandled exception
      throw error;
    }
  }

  return (getAuthCookie.cache = authenticate());
}

/**
 * isPortalModuleEnabled returns true if the given module is enabled
 */
function isPortalModuleEnabled(module) {
  return process.env.PORTAL_MODULES && process.env.PORTAL_MODULES.indexOf(module) !== -1;
}

// sleep is a helper method of sleeping for for given time. The input time is
// expected in seconds
async function sleep(seconds) {
  return new Promise((r) => setTimeout(r, seconds * SECOND));
}

// skylinkHealthCheck checks if the skylink has reached full redundancy
async function skylinkHealthCheck(skylink, numRetries = 30, authCookie, isLarge = false) {
  // Get the health of the skylink
  const response = await got(`http://${siaDockerContainerIP}/skynet/health/skylink/${skylink}`, {
    headers: { "user-agent": "Sia-Agent", cookie: authCookie },
  });
  const healthData = getResponseContent(response);

  // Check Basesectorredundancy first
  if (healthData.basesectorredundancy !== defaultBaseSectorRedundancy && numRetries > 0) {
    // Semi-smart sleep before retrying. Sleep longer if the redundancy is
    // lower.
    await sleep(10 - healthData.basesectorredundancy);
    return skylinkHealthCheck(skylink, numRetries - 1, authCookie, isLarge);
  }

  // Check the Fanout redundancy if it is a large file
  if (isLarge && healthData.fanoutredundancy != defaultFanoutRedundancy && numRetries > 0) {
    // Semi-smart sleep before retrying. Sleep longer if the redundancy is
    // lower.
    await sleep((defaultFanoutRedundancy - healthData.fanoutredundancy) * 10);
    return skylinkHealthCheck(skylink, numRetries - 1, authCookie, isLarge);
  }

  // Throw error if the basesectorredundancy never reached 10x
  if (healthData.basesectorredundancy !== defaultBaseSectorRedundancy && numRetries === 0) {
    throw new Error(`File uploaded but basesector did not reach full redundancy: ${healthData.basesectorredundancy}`);
  }

  // Throw error if the fanoutredundancy never reached 3x
  if (isLarge && healthData.fanoutredundancy !== defaultFanoutRedundancy && numRetries === 0) {
    throw new Error(`File uploaded but fanout did not reach full redundancy: ${healthData.fanoutredundancy}`);
  }

  return response;
}

// uploadFunc handles the upload and health check for the upload checks
async function uploadFunc(done, payload, name, isLarge = false) {
  // Get time for calculating the elapsed time for the check
  const time = process.hrtime();

  // Initialize check params
  const authCookie = await getAuthCookie();
  const data = { up: false };
  const form = new FormData();

  form.append("file", payload, { filename: `${name}.txt`, contentType: "text/plain" });

  try {
    // Upload file
    const response = await got.post(`https://${process.env.PORTAL_DOMAIN}/skynet/skyfile`, {
      body: form,
      headers: { cookie: authCookie },
    });

    // Check file health
    const responseContent = getResponseContent(response);
    const skylink = responseContent.skylink;
    await skylinkHealthCheck(skylink, 60, authCookie, isLarge);

    // Update data response
    data.statusCode = response.statusCode;
    data.up = true;
    data.ip = response.ip;
    data.skylink = skylink;
  } catch (error) {
    data.statusCode = error.response?.statusCode || error.statusCode || error.status;
    data.errorMessage = error.message;
    data.errorResponseContent = getResponseContent(error.response);
    data.ip = error?.response?.ip ?? null;
    data.skylink = skylink;
  }

  done({ name, time: calculateElapsedTime(time), ...data });
}

module.exports = {
  calculateElapsedTime,
  getYesterdayISOString,
  getResponseContent,
  ensureValidJSON,
  getAuthCookie,
  isPortalModuleEnabled,
  ipCheckService,
  ipRegex,
  sectorSize,
  uploadFunc,
};
