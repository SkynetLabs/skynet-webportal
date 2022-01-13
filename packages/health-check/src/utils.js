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
 * Authenticate with given credentials and return auth cookie
 * Creates new account if username does not exist
 * Only authenticates when portal is set to authenticated users only mode
 */
function getAuthCookie() {
  // cache auth promise so only one actual request will be made
  if (getAuthCookie.cache) return getAuthCookie.cache;

  // do not authenticate if it is not necessary
  if (process.env.ACCOUNTS_LIMIT_ACCESS !== "authenticated") return {};

  const email = process.env.ACCOUNTS_TEST_USER_EMAIL;
  const password = process.env.ACCOUNTS_TEST_USER_PASSWORD;

  if (!email) throw new Error("ACCOUNTS_TEST_USER_EMAIL cannot be empty");
  if (!password) throw new Error("ACCOUNTS_TEST_USER_PASSWORD cannot be empty");

  async function authenticate() {
    try {
      // authenticate with given test credentials
      const response = await got.post(`${process.env.SKYNET_DASHBOARD_URL}/api/login`, {
        json: { email, password },
      });

      // extract set-cookie from successful authentication request
      const cookies = response.headers["set-cookie"];

      // find the skynet-jwt cookie
      const jwtcookie = cookies.find((cookie) => cookie.startsWith("skynet-jwt"));

      // extract just the cookie value (no set-cookie props) from set-cookie
      return jwtcookie.match(/skynet-jwt=[^;]+;/)[0];
    } catch (error) {
      // 401 means that service worked but user could not have been authenticated
      if (error.response && error.response.statusCode === 401) {
        // sign up with the given credentials
        await got.post(`${process.env.SKYNET_DASHBOARD_URL}/api/user`, {
          json: { email, password },
        });

        // retry authentication
        return authenticate();
      }
    }
  }

  return (getAuthCookie.cache = authenticate());
}

module.exports = {
  calculateElapsedTime,
  getYesterdayISOString,
  getResponseContent,
  ensureValidJSON,
  getAuthCookie,
};
