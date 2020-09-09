const db = require("../db");

// returns all health check entries that are not older than one day
module.exports = (req, res) => {
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  const entries = db
    .get("entries")
    .orderBy("date", "desc")
    .filter(({ date }) => date >= yesterday.toISOString())
    .value();

  res.send(entries);
};
