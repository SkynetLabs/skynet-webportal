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
    return JSON.parse(response?.text);
  } catch {
    return response?.text;
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

module.exports = {
  calculateElapsedTime,
  getYesterdayISOString,
  getResponseContent,
  ensureValidJSON,
};
