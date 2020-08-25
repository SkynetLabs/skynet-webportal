const { StatusCodes } = require("http-status-codes");
const { sum, sumBy } = require("lodash");
const db = require("./db");

function getStatus() {
  const entry = db.get("entries").orderBy("date", "desc").head().value();

  if (entry && entry.checks.every(({ up }) => up)) {
    return StatusCodes.OK;
  }

  return StatusCodes.SERVICE_UNAVAILABLE;
}

function getTimeout() {
  if (getStatus() === StatusCodes.SERVICE_UNAVAILABLE) {
    return 0;
  }

  const sample = db
    .get("entries")
    .orderBy("date", "desc")
    .filter(({ checks }) => checks.every(({ up }) => up))
    .take(10)
    .value();

  return Math.round(sum(sample.map(({ checks }) => sumBy(checks, "time"))) / sample.size);
}

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
