const db = require("../db");
const { getYesterdayISOString } = require("../utils");

// returns all verbose health check entries
module.exports = (req, res) => {
  const yesterday = getYesterdayISOString();
  const entries = db
    .get("verbose")
    .orderBy("date", "desc")
    .filter(({ date }) => date > yesterday)
    .value();

  res.send(entries);
};
