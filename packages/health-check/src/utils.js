const got = require("got");

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

module.exports = {
  calculateElapsedTime,
  getYesterdayISOString,
  getResponseContent,
  ensureValidJSON,
  getAuthCookie,
  isPortalModuleEnabled,
};
