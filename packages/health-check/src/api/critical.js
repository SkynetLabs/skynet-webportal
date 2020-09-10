const db = require("../db");
const { getYesterdayISOString } = require("../utils");

// returns all critical health check entries
module.exports = (req, res) => {
  const yesterday = getYesterdayISOString();
  const entries = db
    .get("critical")
    .orderBy("date", "desc")
    .filter(({ date }) => date > yesterday)
    .value();

  res.send(entries);
};
