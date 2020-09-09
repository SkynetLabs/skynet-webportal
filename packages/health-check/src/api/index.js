const { StatusCodes } = require("http-status-codes");
const { sum, sumBy } = require("lodash");
const db = require("../db");

// getStatus returns the server's current health check status
function getStatus() {
  const disabled = db.get("disabled").value();

  if (disabled) {
    return StatusCodes.SERVICE_UNAVAILABLE;
  }

  // Grab entry element from DB
  const entry = db.get("entries").orderBy("date", "desc").head().value();

  // Check that every critical check entry is up
  if (entry && entry.checks.every(({ up, critical }) => up && critical)) {
    return StatusCodes.OK;
  }

  // At least one check failed
  return StatusCodes.SERVICE_UNAVAILABLE;
}

// getTimeout returns the average time out from a sample of 10 health check
// entries.
function getTimeout() {
  if (getStatus() === StatusCodes.SERVICE_UNAVAILABLE) {
    return 0;
  }

  // Grab 10 entries from the database as a sample to determine the average
  // timeout for the server.
  const sample = db
    .get("entries")
    .orderBy("date", "desc")
    .filter(({ checks }) => checks.every(({ up, critical }) => up && critical))
    .take(10)
    .value();

  // Return average timeout
  return Math.round(sum(sample.map(({ checks }) => sumBy(checks, "time"))) / sample.size);
}

// getEntriesSinceYesterday gets the health check entries since yesterday
function getEntriesSinceYesterday() {
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  return db
    .get("entries")
    .orderBy("date", "desc")
    .filter(({ date }) => date >= yesterday.toISOString())
    .value();
}

module.exports = (req, res) => {
  setTimeout(() => {
    res.status(getStatus()).send(getEntriesSinceYesterday());
  }, getTimeout());
};
