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
  isPortalModuleEnabled,
  ipCheckService,
  ipRegex,
};
