const ipCheckService = "whatismyip.akamai.com";
const ipRegex = new RegExp(
  `^(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}$`
);

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
 * Authenticate with given credentials and return auth cookie
 * Creates new account if username does not exist
 * Only authenticates when portal is set to authenticated users only mode
 */
function getAuthCookie() {
  // cache auth promise so only one actual request will be made
  if (getAuthCookie.cache) return getAuthCookie.cache;

  // do not authenticate if it is not necessary
  if (!["authenticated", "subscription"].includes(process.env.ACCOUNTS_LIMIT_ACCESS)) return {};

  const email = process.env.ACCOUNTS_TEST_USER_EMAIL;
  const password = process.env.ACCOUNTS_TEST_USER_PASSWORD;

  if (!email) throw new Error("ACCOUNTS_TEST_USER_EMAIL cannot be empty");
  if (!password) throw new Error("ACCOUNTS_TEST_USER_PASSWORD cannot be empty");

  async function authenticate() {
    const got = require("got");

    try {
      // authenticate with given test user credentials
      const response = await got.post(`https://account.${process.env.PORTAL_DOMAIN}/api/login`, {
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
        await got.post(`https://account.${process.env.PORTAL_DOMAIN}/api/user`, {
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

module.exports = {
  calculateElapsedTime,
  getYesterdayISOString,
  getResponseContent,
  ensureValidJSON,
  getAuthCookie,
  isPortalModuleEnabled,
  ipCheckService,
  ipRegex,
};
